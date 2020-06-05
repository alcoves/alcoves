data "aws_ecs_cluster" "bken" {
  cluster_name = "bken"
}

data "template_file" "web_container_def" {
  template = file("${path.module}/templates/fargate_task.json")

  vars = {
    app_image = var.fargate_image
    log_group = aws_cloudwatch_log_group.web.name
  }
}

resource "aws_ecs_task_definition" "web" {
  cpu                      = 256
  memory                   = 512
  family                   = "web-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::594206825329:role/ecsTaskAll"
  task_role_arn            = "arn:aws:iam::594206825329:role/ecsTaskAll"
  container_definitions    = data.template_file.web_container_def.rendered
}

resource "aws_ecs_service" "web" {
  health_check_grace_period_seconds = 0
  desired_count                     = 1
  platform_version                  = "1.4.0"
  launch_type                       = "FARGATE"
  name                              = "web-${var.env}"
  cluster                           = data.aws_ecs_cluster.bken.id
  task_definition                   = aws_ecs_task_definition.web.arn

  service_registries {
    container_port = 3000
    container_name = "web"
    registry_arn   = "arn:aws:servicediscovery:us-east-1:594206825329:service/srv-twtystbnuv6kl5iq"
  }

  network_configuration {
    // If false, fargate fails to pull image
    // TODO :: Add egress from IGW or NAT so that this can be false
    assign_public_ip = true
    security_groups  = [aws_security_group.web_security_group.id]
    subnets = [
      data.aws_subnet.sub1.id,
      data.aws_subnet.sub2.id,
      data.aws_subnet.sub3.id,
      data.aws_subnet.sub4.id,
      data.aws_subnet.sub5.id,
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "web" {
  name = "fargate/bken/web-${var.env}"

  tags = {
    Environment = var.env
    Application = "web"
  }
}
