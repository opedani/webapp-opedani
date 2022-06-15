#!/bin/bash
# Script for initializing node servers


# Update packages
sudo yum update -y


# Install node.js (LTS), dev tools recommended by node installation, git, and pm2
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs git gcc-c++ make
sudo npm install pm2@latest -g


# Setup node app with pm2
git clone https://github.com/opedani/webapp-opedani.git
cd webapp-opedani/
npm install
cd ..
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 ecosystem
rm ecosystem.config.js
cat << EOF > ecosystem.config.js
module.exports = {
  apps : [{
    name               : 'webapp-opedani',
    script             : 'webapp-opedani/app.js',
    instances          : 'max',
    max_memory_restart : '256M'
  }]
};
EOF
pm2 reload ecosystem.config.js
pm2 save
