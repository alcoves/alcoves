resource "aws_security_group" "web_security_group" {
  name        = "web"
  description = "Allows web traffic"
  vpc_id      = data.aws_vpc.bken1.id
}

resource "aws_security_group_rule" "app" {
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.web_security_group.id
}

resource "aws_security_group_rule" "http" {
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

data "aws_vpc" "bken1" {
  filter {
    name   = "tag:Name"
    values = ["bken1"]
  }
}

data "aws_subnet" "sub1" {
  filter {
    name   = "tag:Name"
    values = ["bken1_sub1"]
  }
}

data "aws_subnet" "sub2" {
  filter {
    name   = "tag:Name"
    values = ["bken1_sub2"]
  }
}

data "aws_subnet" "sub3" {
  filter {
    name   = "tag:Name"
    values = ["bken1_sub3"]
  }
}

data "aws_subnet" "sub4" {
  filter {
    name   = "tag:Name"
    values = ["bken1_sub4"]
  }
}

data "aws_subnet" "sub5" {
  filter {
    name   = "tag:Name"
    values = ["bken1_sub5"]
  }
}
