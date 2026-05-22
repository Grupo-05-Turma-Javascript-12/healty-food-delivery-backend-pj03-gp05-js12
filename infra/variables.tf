variable "aws_region" {
  description = "Regiao AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "healthyfood"
}

variable "environment" {
  description = "Ambiente"
  type        = string
  default     = "prod"
}

variable "db_username" {
  description = "Usuario do banco PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Senha do banco PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "db_healthyfood"
}

variable "jwt_secret" {
  description = "Segredo JWT"
  type        = string
  sensitive   = true
}

variable "datadog_api_key" {
  description = "API key do Datadog"
  type        = string
  sensitive   = true
}

variable "aws_account_id" {
  description = "ID da conta AWS"
  type        = string
}

variable "ecr_repository_name" {
  description = "Nome do repositorio ECR"
  type        = string
  default     = "healthyfood-api"
}

variable "app_port" {
  description = "Porta da aplicacao"
  type        = number
  default     = 4000
}

variable "task_cpu" {
  description = "CPU da task ECS em unidades (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memoria da task ECS em MB"
  type        = number
  default     = 512
}