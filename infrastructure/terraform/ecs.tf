# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-cluster"
  }
}

# ECS CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.app_name}-${var.environment}"
  retention_in_days = 30

  tags = {
    Name = "${var.app_name}-${var.environment}-logs"
  }
}

# Amazon ECR Repository for Docker Images
resource "aws_ecr_repository" "app" {
  name                 = "${var.app_name}-marketplace"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.app_name}-ecr"
  }
}

# ECR Lifecycle Policy to Retain Last 15 Production Images
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 15 production images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 15
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ECS Task Definition for Next.js 14 Standalone Container
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.app_name}-${var.environment}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "nextjs-app"
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3000" },
        { name = "HOSTNAME", value = "0.0.0.0" },
        { name = "NEXT_PUBLIC_APP_NAME", value = "FancyHub.in" },
        { name = "NEXT_PUBLIC_APP_URL", value = "https://${var.domain_name}" },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "AWS_S3_BUCKET", value = aws_s3_bucket.media.id }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:DATABASE_URL::"
        },
        {
          name      = "DIRECT_URL"
          valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:DIRECT_URL::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:JWT_SECRET::"
        },
        {
          name      = "API_ENCRYPTION_MASTER_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:API_ENCRYPTION_MASTER_KEY::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "nextjs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1"]
        interval    = 15
        timeout     = 5
        retries     = 3
        startPeriod = 30
      }
    }
  ])

  tags = {
    Name = "${var.app_name}-${var.environment}-task-def"
  }
}

# ECS Service with Rolling Blue/Green Update Strategy
resource "aws_ecs_service" "app" {
  name                               = "${var.app_name}-${var.environment}-service"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.app.arn
  desired_count                      = var.ecs_min_capacity
  launch_type                        = "FARGATE"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 60

  network_configuration {
    subnets          = aws_subnet.private_app[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "nextjs-app"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name = "${var.app_name}-${var.environment}-service"
  }
}

# Auto-Scaling Target for Fargate Tasks
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = var.ecs_max_capacity
  min_capacity       = var.ecs_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CPU Target Tracking Auto-Scaling Policy (Scale up if CPU > 70%)
resource "aws_appautoscaling_policy" "ecs_cpu" {
  name               = "${var.app_name}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
