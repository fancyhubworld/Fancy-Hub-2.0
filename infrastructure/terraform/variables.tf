variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1" # Mumbai
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Primary root domain for the marketplace"
  type        = string
  default     = "fancyhub.in"
}

variable "app_name" {
  description = "Application identifier"
  type        = string
  default     = "fancyhub"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for Multi-AZ deployment"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "db_instance_class" {
  description = "RDS PostgreSQL Instance Class"
  type        = string
  default     = "db.t4g.medium"
}

variable "db_allocated_storage" {
  description = "RDS Allocated Storage in GB"
  type        = number
  default     = 50
}

variable "ecs_task_cpu" {
  description = "Fargate Task CPU units (1024 = 1 vCPU)"
  type        = number
  default     = 1024
}

variable "ecs_task_memory" {
  description = "Fargate Task Memory in MB"
  type        = number
  default     = 2048
}

variable "ecs_min_capacity" {
  description = "Minimum number of running Fargate tasks"
  type        = number
  default     = 2
}

variable "ecs_max_capacity" {
  description = "Maximum number of running Fargate tasks during flash sales"
  type        = number
  default     = 8
}
