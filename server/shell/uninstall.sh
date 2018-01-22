#!/bin/bash

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

echo "+============================================================+"
echo "|                   ServerWatch Uninstaller                  |"
echo "|                                                            |"
echo "|                                         <reruin@gmail.com> |"
echo "|------------------------------------------------------------|"
echo "|                                         https://reruin.net |"
echo "+============================================================+"
echo ""

echo -e "\n|   ServerWatch is uninstalling ... "



if [ -f /etc/serverwatch/agent.sh ]
then
  # 清除crob
  (crontab -l | grep -v "/etc/serverwatch/agent.sh") | crontab -
  # 清除目录
  rm -Rf /etc/serverwatch

  wget --no-check-certificate -qO- __HOST__ >/dev/null 2>&1

fi

echo -e "|\n|   Success: The ServerWatch has been removed\n|"