data "aws_ecs_cluster" "pier11" {
  cluster_name = "pier11"
}

data "aws_secretsmanager_secret_version" "wasabi_access_key_id" {
  secret_id = "wasabi_access_key_id"
}

data "aws_secretsmanager_secret_version" "wasabi_secret_access_key" {
  secret_id = "wasabi_secret_access_key"
}

data "aws_secretsmanager_secret_version" "jwt_key" {
  secret_id = "jwt_key"
}

data "aws_secretsmanager_secret_version" "beta_code" {
  secret_id = "beta_code"
}

data "template_file" "api_container_def" {
  template = file("${path.module}/templates/fargate_task.json")

  vars = {
    tidal_env                = var.env
    app_image                = var.app_image
    credentials              = var.registry_secrets_arn
    log_group                = aws_cloudwatch_log_group.api.name
    jwt_key                  = data.aws_secretsmanager_secret_version.jwt_key.secret_string
    beta_code                = data.aws_secretsmanager_secret_version.beta_code.secret_string
    wasabi_access_key_id     = data.aws_secretsmanager_secret_version.wasabi_access_key_id.secret_string
    wasabi_secret_access_key = data.aws_secretsmanager_secret_version.wasabi_secret_access_key.secret_string
  }
}

resource "aws_ecs_task_definition" "api" {
  cpu                      = 256
  memory                   = 512
  family                   = "api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::594206825329:role/ecsTaskAll"
  task_role_arn            = "arn:aws:iam::594206825329:role/ecsTaskAll"
  container_definitions    = data.template_file.api_container_def.rendered
}

resource "aws_ecs_service" "api" {
  desired_count    = 1
  platform_version = 1.40
  launch_type      = "FARGATE"
  name             = "api-${var.env}"
  depends_on       = [aws_alb_target_group.api]
  cluster          = data.aws_ecs_cluster.pier11.id
  task_definition  = aws_ecs_task_definition.api.arn

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.api_security_group.id]
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
    container_name   = "api"
    target_group_arn = aws_alb_target_group.api.arn
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name = "services/api-${var.env}"

  tags = {
    Environment = var.env
    Application = "api"
  }
}
