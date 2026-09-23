# Production Environment Variable Overrides
environment          = "production"
app_name             = "fancyhub"
domain_name          = "fancyhub.in"
aws_region           = "ap-south-1"
vpc_cidr             = "10.0.0.0/16"
availability_zones   = ["ap-south-1a", "ap-south-1b"]

# Sizing for Production (High-Availability Multi-AZ)
db_instance_class    = "db.t4g.medium"
db_allocated_storage = 50
ecs_task_cpu         = 1024
ecs_task_memory      = 2048
ecs_min_capacity     = 2
ecs_max_capacity     = 8
