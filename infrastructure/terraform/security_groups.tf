# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-${var.environment}-alb-sg"
  description = "Controls HTTPS access to ALB from CloudFront / Internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from CloudFront and Internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP to HTTPS redirect"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-alb-sg"
  }
}

# ECS Fargate App Security Group
resource "aws_security_group" "ecs" {
  name        = "${var.app_name}-${var.environment}-ecs-sg"
  description = "Allows traffic only from ALB to Next.js port 3000"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Traffic from ALB on Port 3000"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-ecs-sg"
  }
}

# RDS PostgreSQL Security Group
resource "aws_security_group" "rds" {
  name        = "${var.app_name}-${var.environment}-rds-sg"
  description = "Allows PostgreSQL traffic strictly from ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from ECS App Security Group"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-rds-sg"
  }
}

# ElastiCache Redis Security Group
resource "aws_security_group" "redis" {
  name        = "${var.app_name}-${var.environment}-redis-sg"
  description = "Allows Redis traffic strictly from ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Redis Port 6379 from ECS App Security Group"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-redis-sg"
  }
}
