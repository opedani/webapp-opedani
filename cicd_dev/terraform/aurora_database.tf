# Terraform code specific to the Aurora Serverless v2 Database


# DB engine + version
data "aws_rds_engine_version" "postgresql" {
  engine  = "aurora-postgresql"
  version = "13.6"
}


# Aurora PostgreSQL Serverless v2 Module
module "aurora_postgresql_v2" {
  source  = "registry.terraform.io/terraform-aws-modules/rds-aurora/aws"
  version = "7.5.1"

  name              = "${var.name}-postgresqlv2"
  engine            = data.aws_rds_engine_version.postgresql.engine
  engine_mode       = "provisioned"
  engine_version    = data.aws_rds_engine_version.postgresql.version
  storage_encrypted = true

  vpc_id                = aws_vpc.vpc.id
  subnets               = aws_subnet.private_subnet.id
  create_security_group = true
  allowed_cidr_blocks   = ["0.0.0.0/0"]

  monitoring_interval = 60

  apply_immediately   = true
  skip_final_snapshot = true

  db_parameter_group_name         = aws_db_parameter_group.postgresql13_db_param_grp.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.postgresql13_custer_param_grp.id

  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 0.5
  }

  instance_class = "db.serverless"
  instances = {
    one = {}
  }
}


# DB Parameter Group
resource "aws_db_parameter_group" "postgresql13_db_param_grp" {
  name        = "${var.name}-aurora-db-postgres13-parameter-group"
  family      = "aurora-postgresql13"
  description = "${var.name}-aurora-db-postgres13-parameter-group"
}


# RDS Cluster Parameter Group
resource "aws_rds_cluster_parameter_group" "postgresql13_custer_param_grp" {
  name        = "${var.name}-aurora-postgres13-cluster-parameter-group"
  family      = "aurora-postgresql13"
  description = "${var.name}-aurora-postgres13-cluster-parameter-group"
}
