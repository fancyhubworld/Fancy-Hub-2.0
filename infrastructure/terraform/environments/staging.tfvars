# Staging Environment Variable Overrides
environment          = "staging"
app_name             = "fancyhub"
domain_name          = "staging.fancyhub.in"
aws_region           = "ap-south-1"
vpc_cidr             = "10.1.0.0/16"
availability_zones   = ["ap-south-1a", "ap-south-1b"]

# Sizing for Staging (Cost-Optimized / Isolated)
db_instance_class    = "db.t4g.micro"
db_allocated_storage = 20
ecs_task_cpu         = 512
ecs_task_memory      = 1024
ecs_min_capacity     = 1
ecs_max_capacity     = 2
