# ec2 module configurations


# Web server's AMI (image)
data "aws_ami" "web_server_ami" {
  most_recent   = true
  owners        = ["amazon"]

  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2",]
  }
}


# Web server (ec2 instance)
resource "aws_instance" "web_server_ec2" {
  ami             = data.aws_ami.web_server_ami.id
  instance_type   = "t2.micro"
  user_data       = file("init.sh")
  security_groups = [aws_security_group.web_server_sg.name]
}


# Public IP for ec2 instance (Elastic IP)
resource "aws_eip" "web_server_eip" {
  instance = aws_instance.web_server_ec2.id
  vpc      = true
}


resource "aws_route53_zone" "opedani_hosted_zone" {
  name = "opedani.net"
}


resource "aws_route53_record" "nameservers" {
  allow_overwrite = true
  name            = "opedani.net"
  ttl             = 3600
  type            = "NS"
  zone_id         = aws_route53_zone.opedani_hosted_zone.zone_id
  records         = aws_route53_zone.opedani_hosted_zone.name_servers
}


resource "aws_route53_record" "web_server_dns_record" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = "opedani.net"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.web_server_eip.public_ip]
}
