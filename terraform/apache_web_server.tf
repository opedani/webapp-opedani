# Terraform code specific to the Apache Reverse Proxy Web Server


# Apache Web Server (ec2 instance)
resource "aws_instance" "apache_ec2" {
  ami             = data.aws_ami.amazon_linux_2_ami.id
  instance_type   = "t2.micro"
  user_data       = file("data/apache_init.sh")
  security_groups = [aws_security_group.apache_sg.name]
  key_name        = aws_key_pair.kagekowalski_ssh_key.key_name
}


# Public IP for Apache Web Server (Elastic IP)
resource "aws_eip" "apache_eip" {
  instance = aws_instance.apache_ec2.id
  vpc      = true
}


# DNS record from opedani.net to Apache Web Server IP
resource "aws_route53_record" "opedani_root" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = var.root_domain
  type    = "A"
  ttl     = "300"
  records = [aws_eip.apache_eip.public_ip]
}


# DNS record from www.opedani.net to Apache Web Server IP
resource "aws_route53_record" "opedani_www" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = "www"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.apache_eip.public_ip]
}


# Security Group and Rules for Apache Web Server
resource "aws_security_group" "apache_sg" {
  name        = "apache_sg"
  description = "Security Group for Apache Web Server"
}
resource "aws_security_group_rule" "apache_sg_http_in" {
  description       = "Allows http traffic in"
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_http_out" {
  description       = "Allows http traffic out"
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_https_in" {
  description       = "Allows https traffic in"
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_https_out" {
  description       = "Allows https traffic out"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_ssh_in" {
  description       = "Allows ssh traffic in"
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_ssh_out" {
  description       = "Allows ssh traffic out"
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_3000_in" {
  description       = "Allows traffic in on port 3000"
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["${aws_eip.node1_eip.public_ip}/32"]
  security_group_id = aws_security_group.apache_sg.id
}
resource "aws_security_group_rule" "apache_sg_3000_out" {
  description       = "Allows traffic out on port 3000"
  type              = "egress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["${aws_eip.node1_eip.public_ip}/32"]
  security_group_id = aws_security_group.apache_sg.id
}
