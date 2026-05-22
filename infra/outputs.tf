output "alb_dns_name" {
  description = "DNS do Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "api_url" {
  description = "URL da API via ALB"
  value       = "http://${aws_lb.main.dns_name}"
}

output "swagger_url" {
  description = "URL do Swagger via ALB"
  value       = "http://${aws_lb.main.dns_name}/swagger"
}

output "ecs_cluster_name" {
  description = "Nome do cluster ECS — usar no secret ECS_CLUSTER do GitHub"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Nome do service ECS — usar no secret ECS_SERVICE do GitHub"
  value       = aws_ecs_service.api.name
}

output "rds_endpoint" {
  description = "Endpoint do RDS"
  value       = aws_db_instance.postgres.address
  sensitive   = true
}

output "ecr_repository_url" {
  description = "URL do repositorio ECR"
  value       = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.ecr_repository_name}"
}