locals {
  bucket_name = "${var.env}.bken.io"
}

resource "aws_s3_bucket" "bken" {
  bucket =  local.bucket_name
  acl    = "public-read"

  policy = <<POLICY
{
    "Version": "2008-10-17",
    "Id": "Policy1397632521960",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${local.bucket_name}/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": [
                        "2400:cb00::/32",
                        "2405:8100::/32",
                        "2405:b500::/32",
                        "2606:4700::/32",
                        "2803:f800::/32",
                        "2c0f:f248::/32",
                        "2a06:98c0::/29",
                        "103.21.244.0/22",
                        "103.22.200.0/22",
                        "103.31.4.0/22",
                        "104.16.0.0/12",
                        "108.162.192.0/18",
                        "131.0.72.0/22",
                        "141.101.64.0/18",
                        "162.158.0.0/15",
                        "172.64.0.0/13",
                        "173.245.48.0/20",
                        "188.114.96.0/20",
                        "190.93.240.0/20",
                        "197.234.240.0/22",
                        "198.41.128.0/17"
                    ]
                }
            }
        }
    ]
}
POLICY

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}