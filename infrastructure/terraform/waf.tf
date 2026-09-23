# AWS WAF WebACL for CloudFront Edge Protection
resource "aws_wafv2_web_acl" "main" {
  name        = "${var.app_name}-${var.environment}-waf"
  description = "WAF rules protecting FancyHub storefront, APIs, and payment webhooks"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # Rule 1: Rate Limiting (Max 300 requests per 5 minutes per IP)
  rule {
    name     = "RateLimitRule"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 300
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "WAFRateLimitMetric"
      sampled_requests_enabled   = true
    }
  }

  # Rule 2: AWS Managed Common Rule Set (OWASP Top 10)
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "WAFCommonRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # Rule 3: AWS Managed SQL Injection Rule Set
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "WAFSQLiRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "FancyHubWAFMetrics"
    sampled_requests_enabled   = true
  }

  tags = {
    Name = "${var.app_name}-waf"
  }
}
