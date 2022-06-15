# Terraform code specific to the Node servers


# Node app server
resource "aws_instance" "ec2_node_1" {
  ami           = data.aws_ami.amazon_linux_2_ami.id
  instance_type = "t2.micro"
  user_data       = file("init.sh")
  security_groups = [aws_security_group.apache_sg.name]
  key_name        = "kagekowalski.pub"
}
