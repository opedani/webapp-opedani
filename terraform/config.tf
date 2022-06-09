# Terraform and provider configurations


# Terraform configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.17.0"
    }
  }

  backend "terraform_cloud" {
    organization = "opedani"
    workspaces {
      name = "webapp-opedani"
    }
  }
}


# AWS (provider) configuration
provider "aws" {
  region     = "us-east-2"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
