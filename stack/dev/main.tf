terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/web/dev/tidal.tfstate"
  }
}

provider "aws" { region  = "us-east-1" }

module "core" {
  env    = "dev"
  source = "../../modules/core"
}