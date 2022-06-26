# Terraform and provider configurations


# Terraform configuration
terraform {
  # Providers
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.17.0"
    }
    local = {
      version = "~>2.1"
    }
  }

  # Backend (Terraform Cloud, configuration defined in *_backend.conf files)
  backend "remote" {}
}


# AWS (provider) configuration
provider "aws" {
  region     = "us-east-2"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
