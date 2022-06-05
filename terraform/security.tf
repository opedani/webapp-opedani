# Security Rules and Groups


resource "aws_security_group" "web_server_sg" {
  name        = "web_server_sg"
  description = "Security Group for web server"
  vpc_id      = aws_eip.web_server_eip.id
}


resource "aws_security_group_rule" "http_in" {
  description       = "Allows http traffic in"
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.web_server_sg.id
}


resource "aws_security_group_rule" "http_out" {
  description       = "Allows http traffic out"
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.web_server_sg.id
}


resource "aws_security_group_rule" "https_in" {
  description       = "Allows https traffic in"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.web_server_sg.id
}


resource "aws_security_group_rule" "https_out" {
  description       = "Allows https traffic out"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.web_server_sg.id
}
