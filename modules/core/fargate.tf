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
    # container_port = 3000 // The port value, already specified in the task definition, to be used for your service discovery service. If the task definition your service task specifies uses the bridge or host network mode, you must specify a containerName and containerPort combination from the task definition. If the task definition your service task specifies uses the awsvpc network mode and a type SRV DNS record is used, you must specify either a containerName and containerPort combination or a port value, but not both.
    # container_name = "web" // The container name value, already specified in the task definition, to be used for your service discovery service. If the task definition that your service task specifies uses the bridge or host network mode, you must specify a containerName and containerPort combination from the task definition. If the task definition that your service task specifies uses the awsvpc network mode and a type SRV DNS record is used, you must specify either a containerName and containerPort combination or a port value, but not both.
    # port         = 3000 // The port value used if your service discovery service specified an SRV record. This field may be used if both the awsvpc network mode and SRV records are used.
    registry_arn = "arn:aws:servicediscovery:us-east-1:594206825329:service/srv-twtystbnuv6kl5iq"
  }

  network_configuration {
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
