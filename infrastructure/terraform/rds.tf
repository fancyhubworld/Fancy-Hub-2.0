# DB Subnet Group across private data subnets
resource "aws_db_subnet_group" "main" {
  name        = "${var.app_name}-${var.environment}-db-subnet-group"
  description = "Database subnet group for FancyHub Multi-AZ RDS"
  subnet_ids  = aws_subnet.private_data[*].id

  tags = {
    Name = "${var.app_name}-${var.environment}-db-subnet-group"
  }
}

# PostgreSQL Parameter Group for Performance Tuning
resource "aws_db_parameter_group" "postgres15" {
  name   = "${var.app_name}-${var.environment}-pg15-params"
  family = "postgres15"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "500" # Log slow queries > 500ms
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-pg15-params"
  }
}

# Master Database Password stored in Secrets Manager
resource "random_password" "db_password" {
  length  = 24
  special = false
}

# AWS RDS PostgreSQL Multi-AZ Instance
resource "aws_db_instance" "postgres" {
  identifier                  = "${var.app_name}-${var.environment}-db"
  engine                      = "postgres"
  engine_version              = "15.6"
  instance_class              = var.db_instance_class
  allocated_storage           = var.db_allocated_storage
  max_allocated_storage       = 200 # Auto-growth up to 200 GB
  storage_type                = "gp3"
  iops                        = 3000
  storage_throughput          = 125
  multi_az                    = true # Synchronous Multi-AZ standby replica
  publicly_accessible         = false
  db_subnet_group_name        = aws_db_subnet_group.main.name
  vpc_security_group_ids      = [aws_security_group.rds.id]
  parameter_group_name        = aws_db_parameter_group.postgres15.name

  db_name  = "fancyhub_production"
  username = "fancyhub_admin"
  password = random_password.db_password.result

  backup_retention_period   = 30 # 30-Day Point-in-Time Recovery (PITR)
  backup_window             = "21:00-22:00" # UTC (2:30 AM - 3:30 AM IST)
  maintenance_window        = "Sun:22:30-Sun:23:30"
  copy_tags_to_snapshot     = true
  deletion_protection       = true # Production safety lock
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.app_name}-${var.environment}-db-final-snapshot"
  storage_encrypted         = true

  tags = {
    Name = "${var.app_name}-${var.environment}-rds-postgres"
  }
}
