# Terraform code that is not specific to a single server


# AMI for most recent Amazon Linux 2 OS
data "aws_ami" "amazon_linux_2_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2", ]
  }
}


# Hosted Zone for DNS Records
resource "aws_route53_zone" "opedani_hosted_zone" {
  name = var.root_domain
}


# RSA key pair for SSH
resource "aws_key_pair" "kagekowalski_ssh_key" {
  key_name   = "kagekowalski.pub"
  public_key = file("data/kagekowalski.pub")
}
