# Terraform code specific to the Aurora Serverless v2 Database


# Aurora RDS Cluster
resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier = "aurora-cluster"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "13.6"
  database_name      = "aurora-db"
  master_username    = "postgres"
  master_password    = "PLACE_PASSWORD_HERE"

  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }
}


# Aurora RDS Cluster Instance
resource "aws_rds_cluster_instance" "example" {
  cluster_identifier = aws_rds_cluster.aurora_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_cluster.engine
  engine_version     = aws_rds_cluster.aurora_cluster.engine_version
}
