# CloudFront Origin Access Control (OAC) for S3
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "fancyhub-s3-oac"
  description                       = "OAC for FancyHub S3 Media Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "FancyHub.in Production CDN"
  default_root_object = ""
  aliases             = [var.domain_name, "www.${var.domain_name}", "assets.${var.domain_name}"]
  price_class         = "PriceClass_All" # Includes all Indian PoPs (Mumbai, Delhi, Chennai, BLR, Kolkata)

  # Origin 1: Application Load Balancer (SSR & Dynamic API Routes)
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "ALB-FancyHub-App"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Origin 2: S3 Media Bucket
  origin {
    domain_name              = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id                = "S3-FancyHub-Media"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # Default Cache Behavior (Forward to ALB)
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "ALB-FancyHub-App"

    forwarded_values {
      query_string = true
      headers      = ["Host", "Authorization", "Accept", "Cookie", "x-razorpay-signature", "x-verify", "x-webhook-signature"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  # Ordered Cache Behavior 1: Next.js Static Chunks (Aggressively Cached at Edge)
  ordered_cache_behavior {
    path_pattern     = "/_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-FancyHub-App"

    forwarded_values {
      query_string = false
      headers      = ["Origin"]
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 86400
    default_ttl            = 604800
    max_ttl                = 31536000 # 1 Year
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # Ordered Cache Behavior 2: S3 Media & Public Uploads
  ordered_cache_behavior {
    path_pattern     = "/uploads/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-FancyHub-Media"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 3600
    default_ttl            = 86400
    max_ttl                = 2592000 # 30 Days
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  web_acl_id = aws_wafv2_web_acl.main.arn

  tags = {
    Name = "${var.app_name}-cloudfront"
  }
}
