
terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/web/dev/terraform.tfstate"
  }
}

provider "aws" { region = "us-east-2" }

module "core" {
  env    = "dev"
  source = "../../modules/core"
}
