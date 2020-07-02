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

module "core" {
  env    = var.env
  source = "../../modules/core"
}
