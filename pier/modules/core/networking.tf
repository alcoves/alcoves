data "aws_lb" "services" {
  name = "${var.env}-services"
}

resource "aws_security_group" "api_security_group" {
  name        = "api"
  description = "Allows api traffic"
  vpc_id      = data.aws_vpc.bken1.id
}

resource "aws_security_group_rule" "api_ingress" {
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_security_group.id
}

resource "aws_security_group_rule" "api_egress" {
  from_port         = 1
  to_port           = 65535
  protocol          = "tcp"
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_security_group.id
}

resource "aws_alb_target_group" "api" {
  port        = 80
  target_type = "ip"
  name        = "api"
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.bken1.id
}
