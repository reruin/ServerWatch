#!/bin/bash
#
# Ref. https://github.com/nodequery/nq-agent

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin


if [ -f /etc/serverwatch/token.log ]
then
  token=($(cat /etc/serverwatch/token.log))
else
  echo "Error: Token is missing."
  exit 1
fi

# 去收尾空格 取单行
function li ()
{
  echo "$1" | sed -e 's/^ *//g;s/[ \;]*$//g' | sed -n '1 p'
}

# 转数字 
function num ()
{
  case $1 in
      ''|*[!0-9\.]*) echo 0 ;;
      *) echo $1 ;;
  esac
}

# Base64
function base ()
{
  echo "$1" | tr -d '\n' | base64 | tr -d '=' | tr -d '\n' | sed 's/\//%2F/g' | sed 's/\+/%2B/g'
}

function system ()
{
  uptime=$(cat /proc/uptime | awk '{ print $1 }')

  # 会话数
  sessions=$(who | wc -l)

  # 进程数
  processes=$(ps axc | wc -l)

  # 进程
  processes_array="$(ps axc -o uname:12,pcpu,rss,etime,state,cmd --sort=-pcpu,-rss --noheaders --width 120 | head -n 15)"
  processes_array="$(echo "$processes_array" | grep -v " ps$" | sed 's/ \+ / /g' | sed '/^$/d' | tr "\n" ";")"

  # 已分配文件句柄的数目
  file_handles=$(cat /proc/sys/fs/file-nr | awk '{ print $1 }')
  # 文件句柄的最大数目
  file_handles_limit=$(cat /proc/sys/fs/file-nr | awk '{ print $3 }')
}

# 操作系统
function os ()
{
  os_kernel=$(uname -r)

  if ls /etc/*release > /dev/null 2>&1
  then
    os_name=$(li "$(cat /etc/*release | grep '^PRETTY_NAME=\|^NAME=\|^DISTRIB_ID=' | awk -F\= '{ print $2 }' | tr -d '"' | tac)")
  fi

  if [ -z "$os_name" ]
  then
    if [ -e /etc/redhat-release ]
    then
      os_name=$(li "$(cat /etc/redhat-release)")
    elif [ -e /etc/debian_version ]
    then
      os_name=$(li "Debian $(cat /etc/debian_version)")
    fi

    if [ -z "$os_name" ]
    then
      os_name=$(li "$(uname -s)")
    fi
  fi

  case $(uname -m) in
    x86_64)
      os_arch="x64"
      ;;
    i*86)
      os_arch="x86"
      ;;
    *)
      os_arch=$(uname -m)
      ;;
  esac
}

function cpu ()
{
  cpu_name=$(li "$(cat /proc/cpuinfo | grep 'model name' | awk -F\: '{ print $2 } END { if (!NR) print "N/A" }')")
  cpu_cores=$(($(cat /proc/cpuinfo | grep 'model name' | awk -F\: '{ print $2 }' | sed -e :a -e '$!N;s/\n/\|/;ta' | tr -cd \| | wc -c)+1))
  cpu_freq=$(li "$(cat /proc/cpuinfo | grep 'cpu MHz' | awk -F\: '{ print $2 }')")

}

# RAM
function ram ()
{
  ram_total=$(li $(num "$(cat /proc/meminfo | grep ^MemTotal: | awk '{ print $2 }')"))
  ram_free=$(li $(num "$(cat /proc/meminfo | grep ^MemFree: | awk '{ print $2 }')"))
  ram_cached=$(li $(num "$(cat /proc/meminfo | grep ^Cached: | awk '{ print $2 }')"))
  ram_buffers=$(li $(num "$(cat /proc/meminfo | grep ^Buffers: | awk '{ print $2 }')"))
  ram_usage=$((($ram_total-($ram_free+$ram_cached+$ram_buffers))*1024))
  ram_total=$(($ram_total*1024))

  swap_total=$(li $(num "$(cat /proc/meminfo | grep ^SwapTotal: | awk '{ print $2 }')"))
  swap_free=$(li $(num "$(cat /proc/meminfo | grep ^SwapFree: | awk '{ print $2 }')"))
  swap_usage=$((($swap_total-$swap_free)*1024))
  swap_total=$(($swap_total*1024))
}

# 磁盘
function disk ()
{
  disk_total=$(li $(num "$(($(df -P -B 1 | grep '^/' | awk '{ print $2 }' | sed -e :a -e '$!N;s/\n/+/;ta')))"))
  disk_usage=$(li $(num "$(($(df -P -B 1 | grep '^/' | awk '{ print $3 }' | sed -e :a -e '$!N;s/\n/+/;ta')))"))

  ## 所有磁盘
  disk_array=$(li "$(df -P -B 1 | grep '^/' | awk '{ print $1" "$2" "$3";" }' | sed -e :a -e '$!N;s/\n/ /;ta' | awk '{ print $0 } END { if (!NR) print "N/A" }')")
}

function network ()
{
  ## 活动链接
  if [ -n "$(command -v ss)" ]
  then
    connections=$(li $(num "$(ss -tun | tail -n +2 | wc -l)"))
  else
    ### netstat 效率低
    connections=$(li $(num "$(netstat -tun | tail -n +3 | wc -l)"))
  fi

  ## 当前活动网络接口
  nic=$(li "$(ip route get 8.8.8.8 | grep dev | awk -F'dev' '{ print $2 }' | awk '{ print $1 }')")

  ## 内部检测到的ipv4 真云检测不到实际ip
  ipv4=$(li "$(ip addr show $nic | grep 'inet ' | awk '{ print $2 }' | awk -F\/ '{ print $1 }' | grep -v '^127' | awk '{ print $0 } END { if (!NR) print "N/A" }')")
  ipv6=$(li "$(ip addr show $nic | grep 'inet6 ' | awk '{ print $2 }' | awk -F\/ '{ print $1 }' | grep -v '^::' | grep -v '^0000:' | grep -v '^fe80:' | awk '{ print $0 } END { if (!NR) print "N/A" }')")


  if [ -d /sys/class/net/$nic/statistics ]
  then
    rx=$(li $(num "$(cat /sys/class/net/$nic/statistics/rx_bytes)"))
    tx=$(li $(num "$(cat /sys/class/net/$nic/statistics/tx_bytes)"))
  else
    rx=$(li $(num "$(ip -s link show $nic | grep '[0-9]*' | grep -v '[A-Za-z]' | awk '{ print $1 }' | sed -n '1 p')"))
    tx=$(li $(num "$(ip -s link show $nic | grep '[0-9]*' | grep -v '[A-Za-z]' | awk '{ print $1 }' | sed -n '2 p')"))
  fi


  # 回程延迟
  ## 广州电信
  #ping_cu=$(ping -c 2 -w 2 14.215.116.1 | grep rtt | cut -d'/' -f4 | awk '{ print $3 }')
  ## 上海移动
  #ping_cm=$(ping -c 2 -w 2 183.192.160.3 | grep rtt | cut -d'/' -f4 | awk '{ print $3 }')
  ## 重庆联通
  #ping_ct=$(ping -c 2 -w 2 113.207.32.65 | grep rtt | cut -d'/' -f4 | awk '{ print $3 }')
  ## 北京教育网
  #ping_edu=$(ping -c 2 -w 2 202.205.6.30 | grep rtt | cut -d'/' -f4 | awk '{ print $3 }')
}

function load (){
  loadavg=$(li "$(cat /proc/loadavg | awk '{ print $1" "$2" "$3 }')")

  
  time=$(date +%s)
  stat=($(cat /proc/stat | head -n1 | sed 's/[^0-9 ]*//g' | sed 's/^ *//'))
  cpu=$((${stat[0]}+${stat[1]}+${stat[2]}+${stat[3]}))
  io=$((${stat[3]}+${stat[4]}))
  idle=${stat[3]}

  if [ -e /etc/serverwatch/data.log ]
  then
    data=($(cat /etc/serverwatch/data.log))
    interval=$(($time-${data[0]}))
    cpu_gap=$(($cpu-${data[1]}))
    io_gap=$(($io-${data[2]}))
    idle_gap=$(($idle-${data[3]}))

    if [[ $cpu_gap > "0" ]]
    then
      load_cpu=$(((1000*($cpu_gap-$idle_gap)/$cpu_gap+5)/10))
    fi

    if [[ $io_gap > "0" ]]
    then
      load_io=$(((1000*($io_gap-$idle_gap)/$io_gap+5)/10))
    fi

    if [[ $rx > ${data[4]} ]]
    then
      rx_gap=$((($rx-${data[4]})/$interval))
    fi

    if [[ $tx > ${data[5]} ]]
    then
      tx_gap=$((($tx-${data[5]})/$interval))
    fi
  fi

  ## 缓存
  echo "$time $cpu $io $idle $rx $tx" > /etc/serverwatch/data.log

  rx_gap=$(li $(num "$rx_gap"))
  tx_gap=$(li $(num "$tx_gap"))
  load_cpu=$(li $(num "$load_cpu"))
  load_io=$(li $(num "$load_io"))
}

function update ()
{
  data_post="token=${token[0]}&data=$(base "$uptime") $(base "$sessions") $(base "$processes") $(base "$processes_array") $(base "$file_handles") $(base "$file_handles_limit") $(base "$os_kernel") $(base "$os_name") $(base "$os_arch") $(base "$cpu_name") $(base "$cpu_cores") $(base "$cpu_freq") $(base "$ram_total") $(base "$ram_usage") $(base "$swap_total") $(base "$swap_usage") $(base "$disk_array") $(base "$disk_total") $(base "$disk_usage") $(base "$connections") $(base "$nic") $(base "$ipv4") $(base "$ipv6") $(base "$rx") $(base "$tx") $(base "$rx_gap") $(base "$tx_gap") $(base "$loadavg") $(base "$load_cpu") $(base "$load_io"))"

  #上传数据
  if [ -n "$(command -v timeout)" ]
  then
    timeout -s SIGKILL 30 wget -q -o /dev/null -O /etc/serverwatch/agent.log -T 25 --post-data "$data_post" --no-check-certificate "__HOST__"
  else
    wget -q -o /dev/null -O /etc/serverwatch/agent.log -T 25 --post-data "$data_post" --no-check-certificate "__HOST__"
    wget_pid=$!
    wget_counter=0
    wget_timeout=30

    while kill -0 "$wget_pid" && (( wget_counter < wget_timeout ))
    do
        sleep 1
        (( wget_counter++ ))
    done

    kill -0 "$wget_pid" && kill -s SIGKILL "$wget_pid"
  fi
}

function main ()
{

  system
  os
  cpu
  ram
  disk
  network
  load
  update
}

main

exit 1