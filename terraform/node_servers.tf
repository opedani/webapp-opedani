# Terraform code specific to the Node servers


# Node app server
resource "aws_instance" "node1_ec2" {
  ami             = data.aws_ami.amazon_linux_2_ami.id
  instance_type   = "t2.micro"
  user_data       = file("data/node_init.sh")
  security_groups = [aws_security_group.node1_sg.name]
  key_name        = "kagekowalski.pub"
}


# Public IP for node1 server (Elastic IP)
resource "aws_eip" "node1_eip" {
  instance = aws_instance.node1_ec2.id
  vpc      = true
}


# DNS record from node1.opedani.net to node1 IP
resource "aws_route53_record" "opedani_node1" {
  zone_id = aws_route53_zone.opedani_hosted_zone.zone_id
  name    = "node1"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.node1_eip.public_ip]
}


# Security Group and Rules for node1 server
resource "aws_security_group" "node1_sg" {
  name        = "node1_sg"
  description = "Security Group for node1 server"
}
resource "aws_security_group_rule" "node1_sg_ssh_in" {
  description       = "Allows ssh traffic in"
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node1_sg.id
}
resource "aws_security_group_rule" "node1_sg_ssh_out" {
  description       = "Allows ssh traffic out"
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node1_sg.id
}
resource "aws_security_group_rule" "node1_sg_3000_in" {
  description       = "Allows traffic in on port 3000"
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node1_sg.id
}
resource "aws_security_group_rule" "node1_sg_3000_out" {
  description       = "Allows traffic out on port 3000"
  type              = "egress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node1_sg.id
}
