# Terraform and provider configurations


# Terraform configuration
terraform {
  # Providers
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.56.0"
    }
  }

  # Backend (Terraform Cloud)
  backend "remote" {
    organization = "opedani"

    workspaces {
      name = "production"
    }
  }
}


# AWS (provider) configuration
provider "aws" {
  region     = "us-east-2"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
