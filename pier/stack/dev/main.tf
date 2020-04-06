terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/api/dev/tidal.tfstate"
  }
}

provider "aws" { region  = "us-east-1" }

variable "env" {
  default = "dev"
  type    = string
}

module "core" {
  env                  = var.env
  source               = "../../modules/core"
  registry_secrets_arn = "github_registry_login"
  app_image            = "docker.pkg.github.com/bken-io/api/api:dev"
  alb_listener_arn     = "arn:aws:elasticloadbalancing:us-east-1:594206825329:listener/app/dev-services/279ca79c2006ab38/555fcd4a863bfde9"
}