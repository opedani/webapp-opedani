#!/bin/bash
# Initializes web server


sudo su
sudo yum -y install httpd
echo "<p> OpEdAni </p>" >> /var/www/html/index.html
sudo systemctl enable httpd
sudo systemctl start httpd
