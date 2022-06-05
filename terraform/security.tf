# Security Rules and Groups


#resource "aws_security_group" "web_server_http" {
#  source = "terraform-aws-modules/security-group/aws//modules/http-80"
#
#  name        = "web_server_http"
#  description = "Security group for web-server with HTTP ports open within VPC"
#  vpc_id      = aws_eip.web_server_eip.vpc
#
#  ingress_cidr_blocks = ["0.0.0.0/0"]
#}
#
#
#resource "aws_security_group" "web-server_https" {
#  source = "terraform-aws-modules/security-group/aws//modules/https-443"
#
#  name   = "web_server_https"
#  description = "Security group for web-server with HTTP ports open within VPC"
#  vpc_id      = aws_eip.web_server_eip.vpc
#
#  ingress_cidr_blocks = ["0.0.0.0/0"]
#}
