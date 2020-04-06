data "aws_lb" "services" {
  name = "${var.env}-services"
}

resource "aws_security_group" "web_security_group" {
  name        = "web"
  description = "Allows web traffic"
  vpc_id      = data.aws_vpc.bken1.id
}

resource "aws_security_group_rule" "web_ingress" {
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.web_security_group.id
}

resource "aws_security_group_rule" "web_egress" {
  from_port         = 1
  to_port           = 65535
  protocol          = "tcp"
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.web_security_group.id
}

resource "aws_alb_target_group" "web" {
  port        = 80
  target_type = "ip"
  name        = "web"
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.bken1.id
}

resource "aws_alb_listener_rule" "web" {
  priority     = 50000
  listener_arn = var.alb_listener_arn

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.web.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
