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
  ami           = data.aws_ami.web_server_ami.id
  instance_type = "t2.micro"
  user_data     = file("init.sh")
}
