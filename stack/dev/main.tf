terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/web/dev/tidal.tfstate"
  }
}

provider "aws" { region  = "us-east-1" }

module "core" {
  env              = "dev"
  source           = "../../modules/core"
  alb_listener_arn = "arn:aws:elasticloadbalancing:us-east-1:594206825329:listener/app/dev-services/279ca79c2006ab38/555fcd4a863bfde9"
}