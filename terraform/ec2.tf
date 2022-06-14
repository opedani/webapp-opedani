# ec2 module configurations


# Web server's AMI (image)
data "aws_ami" "web_server_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2", ]
  }
}


# Web server (ec2 instance)
resource "aws_instance" "web_server_ec2" {
  ami             = data.aws_ami.web_server_ami.id
  instance_type   = "t2.micro"
  user_data       = file("init.sh")
  security_groups = [aws_security_group.web_server_sg.name]
  key_name        = "kagekowalski.pub"
}


# Public IP for ec2 instance (Elastic IP)
resource "aws_eip" "web_server_eip" {
  instance = aws_instance.web_server_ec2.id
  vpc      = true
}


# Hosted Zone for DNS Records
resource "aws_route53_zone" "opedani_hosted_zone" {
  name = var.root_domain
}


# DNS root domain record
resource "aws_route53_record" "opedani_root" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = var.root_domain
  type    = "A"
  ttl     = "300"
  records = [aws_eip.web_server_eip.public_ip]
}


# DNS www record
resource "aws_route53_record" "opedani_www" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = "www"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.web_server_eip.public_ip]
}


# RSA key pair for SSH
resource "aws_key_pair" "kagekowalski_ssh_key" {
  key_name   = "kagekowalski.pub"
  public_key = file("kagekowalski.pub")
}
