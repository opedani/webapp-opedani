#!/bin/bash
# Script for initializing apache_ec2 server


# Update packages
sudo yum update -y


# Install and configure httpd (Apache Web Server) as a reverse proxy
sudo yum install -y httpd
cd /etc/httpd/conf
echo 'LoadModule proxy_module modules/mod_proxy.so' | sudo tee -a httpd.conf
echo 'LoadModule proxy_balancer_module modules/mod_proxy_balancer.so' | sudo tee -a httpd.conf
echo 'LoadModule proxy_http_module modules/mod_proxy_http.so' | sudo tee -a httpd.conf
echo '<Proxy balancer://myset>' | sudo tee -a httpd.conf
echo '    BalancerMember http://node1.opedani.net:3000' | sudo tee -a httpd.conf
echo '    ProxySet lbmethod=bytraffic' | sudo tee -a httpd.conf
echo '</Proxy>' | sudo tee -a httpd.conf
echo 'ProxyPass "/"  "balancer://myset/"' | sudo tee -a httpd.conf
echo 'ProxyPassReverse "/"  "balancer://myset/"' | sudo tee -a httpd.conf


# Enable and start httpd
sudo systemctl enable httpd
sudo systemctl start httpd
