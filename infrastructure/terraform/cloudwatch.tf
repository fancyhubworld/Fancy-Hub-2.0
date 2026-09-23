# SNS Topic for Critical P0 / Operational Alarms
resource "aws_sns_topic" "alarms" {
  name = "${var.app_name}-${var.environment}-alarms"

  tags = {
    Name = "${var.app_name}-alarms"
  }
}

# CloudWatch Alarm: High HTTP 5xx Error Rate
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.app_name}-high-5xx-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10 # More than 10 5xx errors in 2 consecutive minutes
  alarm_description   = "Triggers when application returns elevated 5xx error rates"
  alarm_actions       = [aws_sns_topic.alarms.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.app.arn_suffix
  }
}

# CloudWatch Alarm: RDS High CPU Utilization (> 80%)
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.app_name}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggers when PostgreSQL CPU utilization exceeds 80%"
  alarm_actions       = [aws_sns_topic.alarms.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }
}

# CloudWatch Alarm: RDS Low Freeable Memory (< 500 MB)
resource "aws_cloudwatch_metric_alarm" "rds_memory" {
  alarm_name          = "${var.app_name}-rds-low-memory"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeableMemory"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 524288000 # 500 MB
  alarm_description   = "Triggers when PostgreSQL freeable memory drops below 500 MB"
  alarm_actions       = [aws_sns_topic.alarms.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }
}
