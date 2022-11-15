# Terraform code specific to the database


# Initial example table
resource "aws_dynamodb_table" "anime_table" {
  name           = "Anime"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "ID"
  range_key      = "Titles"

  attribute {
    name = "ID"
    type = "N"
  }

  attribute {
    name = "Titles"
    type = "S"
  }

  attribute {
    name = "Songs"
    type = "S"
  }
}
