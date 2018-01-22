#!/bin/bash

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

echo "+============================================================+"
echo "|                    ServerWatch Installer                   |"
echo "|                                                            |"
echo "|                                         <reruin@gmail.com> |"
echo "|------------------------------------------------------------|"
echo "|                                         https://reruin.net |"
echo "+============================================================+"
echo ""

echo -e "\n|   ServerWatch is installing ... "

# Base64
function base ()
{
  echo "$1" | tr -d '\n' | base64 | tr -d '=' | tr -d '\n' | sed 's/\//%2F/g' | sed 's/\+/%2B/g'
}


# 检测依赖
if [ -n "$(command -v apt-get)" ]
then
  if [ -z "$(command -v crontab)" ]
  then
    apt-get -y update >/dev/null 2>&1
    apt-get -y install cron >/dev/null 2>&1
  fi
  if [ -z "$(command -v curl)" ]
  then
    apt-get -y install curl >/dev/null 2>&1
  fi
elif [ -n "$(command -v yum)" ]
then
  if [ -z "$(command -v crontab)" ]
  then
    yum -y install cron vixie-cron >/dev/null 2>&1
  fi
  if [ -z "$(command -v curl)" ]
  then
    yum -y install curl >/dev/null 2>&1
  fi
elif [ -n "$(command -v pacman)" ]
then
  if [ -z "$(command -v crontab)" ]
  then
    pacman -S --noconfirm cronie
  fi
  if [ -z "$(command -v curl)" ]
  then
    pacman -S --noconfirm curl
  fi
fi


if [ -z "$(command -v crontab)" ]
then
  echo -e "|\n|  Error: Crontab could NOT be installed\n|"
  exit 1
fi


# 若没有运行
if [ -z "$(ps -Al | grep cron | grep -v grep)" ]
then

  if [ -n "$(command -v apt-get)" ]
  then
    service cron start
  elif [ -n "$(command -v yum)" ]
  then
    chkconfig crond on
    service crond start
  elif [ -n "$(command -v pacman)" ]
  then
    systemctl start cronie
    systemctl enable cronie
  fi
  
  ## 再次检测
  if [ -z "$(ps -Al | grep cron | grep -v grep)" ]
  then
    echo -e "|\n|   Error: Cron could NOT be started\n|"
    exit 1
  fi
fi

# 清除旧脚本
if [ -f /etc/serverwatch/agent.sh ]
then
  rm -Rf /etc/serverwatch
  (crontab -l | grep -v "/etc/serverwatch/agent.sh") | crontab -
fi

# 创建目录
mkdir -p /etc/serverwatch

# 获取一次基础数据:位置 运营商 等
meta=$(curl -s myip.ipip.net -4)

wget -O /etc/serverwatch/agent.sh --post-data="data=$(base "$meta")" --no-check-certificate __HOST__ >/dev/null 2>&1


if [ -f /etc/serverwatch/agent.sh ]
then
  chmod +x /etc/serverwatch/agent.sh
  ## 添加token
  echo "__TOKEN__" > /etc/serverwatch/token.log

  ## 配置 cron 检测频率
  interval=__INTERVAL__


  for x in "${interval[@]}"
  do
    crontab -l 2>/dev/null | { cat; echo "$x bash /etc/serverwatch/agent.sh > /etc/serverwatch/cron.log 2>&1"; } | crontab -
  done
  

  echo -e "|\n|   Success: The ServerWatch has been installed\n|"

  ### 删除安装脚本
  if [ -f $0 ]
  then
    rm -f $0
  fi
else
  echo -e "|\n|   Error: The ServerWatch could NOT be installed\n|"
fi