terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/api/prod/tidal.tfstate"
  }
}

provider "aws" { region  = "us-east-1" }

variable "env" {
  default = "prod"
  type    = string
}

module "core" {
  env                  = var.env
  source               = "../../modules/core"
  registry_secrets_arn = "github_registry_login"
  app_image            = "docker.pkg.github.com/bken-io/api/api:latest"
}