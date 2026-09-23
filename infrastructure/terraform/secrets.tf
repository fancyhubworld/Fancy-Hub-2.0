# Secrets Manager: Database Credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "${var.app_name}/${var.environment}/database"
  description             = "PostgreSQL database connection strings for FancyHub"
  recovery_window_in_days = 0 # Immediate deletion on destroy for test teardowns

  tags = {
    Name = "${var.app_name}-db-secret"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    DATABASE_URL = "postgresql://${aws_db_instance.postgres.username}:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}?sslmode=require&pgbouncer=true"
    DIRECT_URL   = "postgresql://${aws_db_instance.postgres.username}:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}?sslmode=require"
  })
}

# Secrets Manager: Application Core Secrets
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.app_name}/${var.environment}/app-secrets"
  description             = "Master Encryption Key, JWT Secrets, and Third-Party API Keys"
  recovery_window_in_days = 0

  tags = {
    Name = "${var.app_name}-app-secret"
  }
}

resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}

resource "random_password" "api_master_key" {
  length  = 64
  special = false
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    JWT_SECRET                 = random_password.jwt_secret.result
    API_ENCRYPTION_MASTER_KEY  = random_password.api_master_key.result
  })
}
