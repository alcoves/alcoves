data "aws_ecs_cluster" "bken" {
  cluster_name = "bken"
}

data "template_file" "web_container_def" {
  template = file("${path.module}/templates/fargate_task.json")

  vars = {
    log_group = aws_cloudwatch_log_group.web.name
    app_image = "594206825329.dkr.ecr.us-east-1.amazonaws.com/bken/web:dev"
  }
}

resource "aws_ecs_task_definition" "web" {
  cpu                      = 256
  memory                   = 512
  family                   = "web"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::594206825329:role/ecsTaskAll"
  task_role_arn            = "arn:aws:iam::594206825329:role/ecsTaskAll"
  container_definitions    = data.template_file.web_container_def.rendered
}

resource "aws_ecs_service" "web" {
  desired_count    = 1
  platform_version = 1.40
  launch_type      = "FARGATE"
  name             = "web-${var.env}"
  cluster          = data.aws_ecs_cluster.bken.id
  task_definition  = aws_ecs_task_definition.web.arn

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.web_security_group.id]
    subnets = [
      data.aws_subnet.sub1.id,
      data.aws_subnet.sub2.id,
      data.aws_subnet.sub3.id,
      data.aws_subnet.sub4.id,
      data.aws_subnet.sub5.id,
      data.aws_subnet.sub6.id,
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "web" {
  name = "aws/fargate/bken-web-${var.env}"

  tags = {
    Environment = var.env
    Application = "web"
  }
}
