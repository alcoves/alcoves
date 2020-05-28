locals {
  function_name       = "${var.env}-bken-io"
  archive_output_path = "${path.module}/dist/${local.function_name}.zip"
}

data "archive_file" "bken_web_handler_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src/"
  output_path = local.archive_output_path
}

resource "aws_lambda_function" "bken_web_handler" {
  timeout          = 30
  memory_size      = 512
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  function_name    = local.function_name
  filename         = local.archive_output_path
  role             = "arn:aws:iam::594206825329:role/lambda-all"
  depends_on       = [aws_cloudwatch_log_group.bken_web_handler]
  source_code_hash = data.archive_file.bken_web_handler_zip.output_base64sha256

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      NODE_ENV = "production"
    }
  }
}

resource "aws_cloudwatch_log_group" "bken_web_handler" {
  retention_in_days = 7
  name              = "/aws/lambda/${local.function_name}"
}
