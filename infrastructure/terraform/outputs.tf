output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Hostname"
  value       = aws_lb.main.dns_name
}

output "cloudfront_domain_name" {
  description = "CloudFront Distribution Domain Name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "ecr_repository_url" {
  description = "Amazon ECR Repository URL"
  value       = aws_ecr_repository.app.repository_url
}

output "rds_endpoint" {
  description = "RDS PostgreSQL Endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis Primary Endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "s3_media_bucket" {
  description = "S3 Media Bucket Name"
  value       = aws_s3_bucket.media.id
}

output "acm_certificate_arn" {
  description = "ACM SSL Certificate ARN"
  value       = aws_acm_certificate.cert.arn
}
