
terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "bken-tf-state"
    key    = "services/web/dev/terraform.tfstate"
  }
}

provider "aws" { region = "us-east-1" }
variable "fargate_image" { type = string }

module "core" {
  env           = "dev"
  source        = "../../modules/core"
  fargate_image = var.fargate_image
}
