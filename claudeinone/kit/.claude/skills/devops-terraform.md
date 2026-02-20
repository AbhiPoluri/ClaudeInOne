# Terraform Infrastructure-as-Code

Declarative infrastructure provisioning across cloud providers.

## Setup

```bash
brew install terraform
terraform version
```

## AWS Example

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# Subnet
resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "main-subnet"
  }
}

# Security Group
resource "aws_security_group" "app" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.app.id]

  tags = {
    Name = "app-server"
  }
}

# RDS Database
resource "aws_db_instance" "postgres" {
  identifier     = "my-postgres-db"
  engine         = "postgres"
  engine_version = "14.7"
  instance_class = "db.t3.micro"

  db_name  = "myapp"
  username = "admin"
  password = var.db_password

  allocated_storage = 20
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.app.id]
}

# Outputs
output "instance_public_ip" {
  value = aws_instance.app.public_ip
}

output "database_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
```

## Variables

```hcl
# variables.tf
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 1
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default = {
    Terraform   = "true"
    Environment = "production"
  }
}
```

## Modules

```hcl
# main.tf
module "networking" {
  source = "./modules/networking"

  vpc_cidr       = "10.0.0.0/16"
  subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24"]
  environment    = var.environment
}

module "database" {
  source = "./modules/database"

  engine              = "postgres"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  db_name             = "myapp"
  db_password         = var.db_password
  security_group_id   = module.networking.security_group_id
}
```

## State Management

```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan -var-file="prod.tfvars"

# Apply changes
terraform apply -var-file="prod.tfvars" -auto-approve

# Destroy resources
terraform destroy -var-file="prod.tfvars"

# View state
terraform state show aws_instance.app
terraform state list
```

## Remote State

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

## Best Practices

✅ **Use modules** - Organize code logically
✅ **Version state** - Store in remote backends
✅ **Use variables** - Separate config from code
✅ **Plan before apply** - Review changes
✅ **Lock state** - Prevent concurrent modifications

## Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Registry](https://registry.terraform.io/)
