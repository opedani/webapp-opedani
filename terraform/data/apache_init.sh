#!/bin/bash
# Script for initializing apache_ec2 server


# Update packages
sudo yum update -y


# Initialize web server
sudo yum -y install httpd
echo "<p> OpEdAni </p>" >> /var/www/html/index.html
sudo systemctl enable httpd
sudo systemctl start httpd
