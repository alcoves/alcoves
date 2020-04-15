data "aws_ecs_cluster" "pier11" {
  cluster_name = "pier11"
}

data "template_file" "web_container_def" {
  template = file("${path.module}/templates/fargate_task.json")

  vars = {
    credentials = "github_registry_login"
    log_group   =  aws_cloudwatch_log_group.web.name
    app_image   = "docker.pkg.github.com/bken-io/web/web:dev"
  }
}

resource "aws_ecs_task_definition" "web" {
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  family                   = "web"
  execution_role_arn       = "arn:aws:iam::594206825329:role/ecsTaskAll"
  task_role_arn            = "arn:aws:iam::594206825329:role/ecsTaskAll"
  container_definitions    = data.template_file.web_container_def.rendered
}

resource "aws_ecs_service" "web" {
  desired_count    = 1
  platform_version = 1.40
  launch_type      = "FARGATE"
  name             = "web-${var.env}"
  depends_on       = [aws_alb_target_group.web]
  cluster          = data.aws_ecs_cluster.pier11.id
  task_definition  = aws_ecs_task_definition.web.arn

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.web_security_group.id]
    subnets          = [
      data.aws_subnet.sub1.id, 
      data.aws_subnet.sub2.id,
      data.aws_subnet.sub3.id,
      data.aws_subnet.sub4.id,
      data.aws_subnet.sub5.id,
      data.aws_subnet.sub6.id,
    ]
  }

  load_balancer {
    container_port   = 80
    container_name   = "web"
    target_group_arn = aws_alb_target_group.web.arn
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "web" {
  name = "services/web-${var.env}"

  tags = {
    Environment = var.env
    Application = "web"
  }
}
