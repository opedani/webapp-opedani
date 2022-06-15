# Terraform code specific to the Node servers


# Node app server
resource "aws_instance" "node_ec2_1" {
  ami             = data.aws_ami.amazon_linux_2_ami.id
  instance_type   = "t2.micro"
  user_data       = file("data/node_init.sh")
  security_groups = [aws_security_group.apache_sg.name]
  key_name        = "kagekowalski.pub"
}
