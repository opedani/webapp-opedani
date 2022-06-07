#!/bin/bash


# Update packages
sudo yum update -y


# Initialize web server
sudo su
sudo yum -y install httpd
echo "<p> OpEdAni </p>" >> /var/www/html/index.html
sudo systemctl start httpd
sudo systemctl enable httpd
