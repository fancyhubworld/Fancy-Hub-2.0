# Primary Media & Static Assets S3 Bucket
resource "aws_s3_bucket" "media" {
  bucket        = "fancyhub-media-${var.environment}-${var.aws_region}"
  force_destroy = false

  tags = {
    Name = "fancyhub-media-${var.environment}"
    Tier = "Storage"
  }
}

# S3 Bucket Versioning for Accidental Data Loss Prevention
resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Server-Side Encryption with KMS
resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block Public Access (All reads route through CloudFront OAC)
resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS Configuration for Direct Client Pre-Signed Uploads
resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = ["https://${var.domain_name}", "https://www.${var.domain_name}", "https://staging.${var.domain_name}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 Lifecycle Rule for Inactive / Deleted Asset Archival
resource "aws_s3_bucket_lifecycle_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "archive-old-versions"
    status = "Enabled"

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}
