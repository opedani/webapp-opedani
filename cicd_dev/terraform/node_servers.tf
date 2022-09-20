# Terraform code specific to the Node servers


# Node app server
#resource "aws_instance" "node1_ec2" {
#  ami                         = data.aws_ami.amazon_linux_2_ami.id
#  instance_type               = "t2.micro"
#  key_name                    = aws_key_pair.ansible_ssh_key.key_name
#  vpc_security_group_ids      = [aws_security_group.node_sg.id]
#  subnet_id                   = aws_subnet.public_subnet.id
#  associate_public_ip_address = true
#}


# Public IP for node1 server (Elastic IP)
resource "aws_eip" "node1_eip" {
  #  instance = aws_instance.node1_ec2.id
  vpc = true
}


# Security Group and Rules for node1 server
resource "aws_security_group" "node_sg" {
  vpc_id      = aws_vpc.vpc.id
  name        = "node1_sg"
  description = "Security Group for node1 server"
}
resource "aws_security_group_rule" "node_sg_http_in" {
  description       = "Allows http traffic in"
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_http_out" {
  description       = "Allows http traffic out"
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_https_in" {
  description       = "Allows https traffic in"
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_https_out" {
  description       = "Allows https traffic out"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_ssh_in" {
  description       = "Allows ssh traffic in"
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_ssh_out" {
  description       = "Allows ssh traffic out"
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_3000_in" {
  description       = "Allows traffic in on port 3000"
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["${aws_eip.apache_eip.public_ip}/32"]
  security_group_id = aws_security_group.node_sg.id
}
resource "aws_security_group_rule" "node_sg_3000_out" {
  description       = "Allows traffic out on port 3000"
  type              = "egress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["${aws_eip.apache_eip.public_ip}/32"]
  security_group_id = aws_security_group.node_sg.id
}
