# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.app_name}-${var.environment}-redis-subnet-group"
  subnet_ids = aws_subnet.private_data[*].id

  tags = {
    Name = "${var.app_name}-${var.environment}-redis-subnet-group"
  }
}

# ElastiCache Parameter Group
resource "aws_elasticache_parameter_group" "redis7" {
  name   = "${var.app_name}-${var.environment}-redis7-params"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "volatile-lru" # Cache eviction policy for transient data
  }
}

# AWS ElastiCache Redis Cluster
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.app_name}-${var.environment}-redis"
  description                   = "Redis cluster for FancyHub cache, rate limiting, and queues"
  node_type                     = "cache.t4g.micro"
  port                          = 6379
  parameter_group_name          = aws_elasticache_parameter_group.redis7.name
  subnet_group_name             = aws_elasticache_subnet_group.main.name
  security_group_ids            = [aws_security_group.redis.id]
  automatic_failover_enabled    = true
  multi_az_enabled              = true
  num_cache_clusters            = 2 # 1 Primary + 1 Replica
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true
  auth_token_update_strategy    = "SET"
  auth_token                    = random_password.redis_auth.result
  snapshot_retention_limit      = 7
  snapshot_window               = "20:00-21:00"

  tags = {
    Name = "${var.app_name}-${var.environment}-redis"
  }
}

resource "random_password" "redis_auth" {
  length  = 32
  special = false
}
