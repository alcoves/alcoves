terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/api/dev/tidal.tfstate"
  }
}

provider "aws" { region = "us-east-2" }

variable "env" {
  default = "dev"
  type    = string
}

locals {
  function_name       = "bken-api-${var.env}"
  archive_output_path = "${path.module}/../../dist/${local.function_name}.zip"
}

data "archive_file" "tidal_api_zip" {
  type        = "zip"
  output_path = local.archive_output_path
  source_dir  = "${path.module}/../../server/"
}

resource "aws_lambda_function" "tidal_api" {
  timeout          = 30
  memory_size      = 1536
  runtime          = "nodejs12.x"
  handler          = "src/index.handler"
  function_name    = local.function_name
  filename         = local.archive_output_path
  depends_on       = [aws_cloudwatch_log_group.tidal_api]
  role             = "arn:aws:iam::594206825329:role/lambda-all"
  source_code_hash = data.archive_file.tidal_api_zip.output_base64sha256

  environment {
    variables = {
      BKEN_ENV = var.env
    }
  }

  tracing_config {
    mode = "Active"
  }
}

resource "aws_cloudwatch_log_group" "tidal_api" {
  retention_in_days = 7
  name              = "/aws/lambda/${local.function_name}"
}
