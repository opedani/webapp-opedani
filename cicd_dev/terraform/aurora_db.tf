# Terraform code specific to the Aurora Serverless v2 Database


# Aurora RDS Cluster
resource "aws_rds_cluster" "aurora_cluster" {
  # Rarely changed critical input
  cluster_identifier = "aurora-cluster"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "13.6"
  database_name      = "aurora-db"
  master_username    = "postgres"
  master_password    = var.aurora_cluster_pw

  # Rarely changed non-critical input
  backup_retention_period = 7

  # Changeable input
  allow_major_version_upgrade      = false
  db_cluster_parameter_group_name  = aws_rds_cluster_parameter_group.aurora_cluster_param_grp
  db_instance_parameter_group_name = aws_db_parameter_group.aurora_db_param_grp

  # Scaling info
  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }
}


# Aurora RDS Cluster Instance
resource "aws_rds_cluster_instance" "aurora_cluster_instance" {
  cluster_identifier = aws_rds_cluster.aurora_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_cluster.engine
  engine_version     = aws_rds_cluster.aurora_cluster.engine_version
}


# Aurora Cluster Parameter Group
resource "aws_rds_cluster_parameter_group" "aurora_cluster_param_grp" {
  name        = "aurora-cluster-parameter-group"
  family      = "aurora-postgresql13"
  description = "aurora-cluster-parameter-group"
}


# Aurora DB Parameter Group
resource "aws_db_parameter_group" "aurora_db_param_grp" {
  name        = "aurora-db-parameter-group"
  family      = "aurora-postgresql13"
  description = "aurora-db-parameter-group"
}
