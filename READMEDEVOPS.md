# Healthy Food API

A production-ready REST API for healthy food delivery built with **NestJS**, **TypeScript**, and **PostgreSQL** — containerized, deployed to AWS ECS Fargate with full observability powered by **Datadog APM**.

---

## Overview

This project manages users, food categories, and products for a healthy food delivery platform. It features JWT authentication, role-based endpoint protection, and full-stack observability with Datadog tracing and log correlation — all running on serverless containers via ECS Fargate.

**Live API:** `http://<ALB_DNS_NAME>`  
**Swagger Docs:** `http://<ALB_DNS_NAME>/swagger`

---

## Architecture

```
  GitHub Actions CI/CD
  ┌────────────────────────────────────────────────────┐
  │  push to main                                      │
  │      → test (Jest + TypeScript check)              │
  │      → build Docker image                          │
  │      → push to ECR (scan on push enabled)          │
  │      → update ECS Task Definition                  │
  │      → force new ECS deployment                    │
  │      → smoke tests (Python) against ALB            │
  └───────────────────────────┬────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                    AWS (us-east-1)                      │
  │                                                         │
  │  VPC 10.2.0.0/16                                        │
  │                                                         │
  │  ┌──────────────────────────────────────────────────┐   │
  │  │  Public Subnets (10.2.1.0/24 | 10.2.2.0/24)     │   │
  │  │                                                  │   │
  │  │  Application Load Balancer                       │   │
  │  │  ├── Listener :80                                │   │
  │  │  └── Target Group → ECS Tasks (health: /health)  │   │
  │  │                  │                               │   │
  │  │  ECS Fargate Task (256 CPU / 512 MB)             │   │
  │  │  ├── Container: healthyfood-api :4000            │   │
  │  │  │   └── dd-trace (APM auto-instrumentation)     │   │
  │  │  └── Container: datadog-agent (sidecar)          │   │
  │  │       ├── APM traces ← port 8126                 │   │
  │  │       └── Logs ← Docker log driver               │   │
  │  └──────────────────────┬───────────────────────────┘   │
  │                         │ PostgreSQL :5432               │
  │  ┌──────────────────────▼───────────────────────────┐   │
  │  │  Private Subnets (10.2.3.0/24 | 10.2.4.0/24)    │   │
  │  │                                                  │   │
  │  │  RDS PostgreSQL 16 (db.t3.micro)                 │   │
  │  │  Security Group: accepts only from ECS SG        │   │
  │  └──────────────────────────────────────────────────┘   │
  │                                                         │
  │  ECR: healthyfood-api (scan on push, lifecycle policy)  │
  │  SSM: /healthyfood/prod/{db_password,jwt_secret,dd_key} │
  │  CloudWatch: /ecs/healthyfood/{api,datadog-agent}       │
  └─────────────────────────────────────────────────────────┘

  Datadog Observability
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │  NestJS API                                             │
  │  └── dd-trace (auto-instruments HTTP + TypeORM)         │
  │       ├── Traces → Agent :8126 → Datadog APM            │
  │       └── Log injection (dd.trace_id in every log)      │
  │                                                         │
  │  Datadog Agent (sidecar)                                │
  │  ├── Collects traces from API container                 │
  │  ├── Collects logs from all containers                  │
  │  └── Sends to datadoghq.com                             │
  │                                                         │
  │  Datadog APM Dashboard                                  │
  │  ├── Request rate by endpoint                           │
  │  ├── P95 / P99 latency                                  │
  │  ├── Error rate                                         │
  │  └── Correlated logs per trace                          │
  └─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | NestJS 11 | Modular architecture, DI, TypeScript-first |
| Language | TypeScript 5 | Static typing, compile-time safety |
| ORM | TypeORM 0.3 | Entity mapping, relationship management |
| Database | PostgreSQL 16 (RDS) | Relational database |
| Auth | JWT + Passport | Stateless authentication — LocalStrategy + JwtStrategy |
| Docs | Swagger / OpenAPI | Interactive API documentation |
| Container | Docker multi-stage | Minimal production image (~150MB) |
| Registry | AWS ECR | Private image registry with scan on push |
| Orchestration | AWS ECS Fargate | Serverless containers — no EC2 management |
| Load Balancer | AWS ALB | HTTP routing, health checks, TLS termination |
| CI/CD | GitHub Actions | Automated test → build → push ECR → deploy ECS |
| IaC | Terraform | Reproducible AWS infrastructure |
| Observability | Datadog APM + Logs | Distributed tracing and log correlation |
| Secrets | AWS SSM Parameter Store | Encrypted secrets — never in env vars or code |
| Scripts | Python 3 | Smoke tests post-deploy |

---

## Features

- **JWT Authentication** — LocalStrategy validates credentials, JwtStrategy protects routes. Passwords hashed with bcrypt (10 salt rounds)
- **Three-entity domain** — Users, Categories, and Products with bidirectional relationships
- **Automatic APM** — dd-trace auto-instruments every HTTP request and TypeORM query without modifying business logic
- **Log-trace correlation** — `dd.trace_id` injected in every log line, enabling one-click navigation from log to trace in Datadog
- **Sidecar pattern** — Datadog Agent runs as a sidecar container in the same ECS Task, sharing the network namespace
- **Encrypted secrets** — All sensitive values stored in SSM Parameter Store with KMS encryption, fetched at runtime by ECS
- **Smoke tests** — Python script validates critical endpoints after every deploy, failing the pipeline if the API misbehaves

---

## Project Structure

```
src/
├── tracer.ts                          # dd-trace init — must be first import
├── main.ts                            # Bootstrap — tracer, Helmet, ValidationPipe, Swagger
├── app.module.ts                      # Root module — ConfigModule + TypeORM + LoggerModule
├── health/
│   └── health.controller.ts           # GET /health — DB connectivity check
├── logger/
│   └── logger.module.ts               # Winston JSON logger — Datadog-compatible format
├── common/
│   └── interceptors/
│       └── logging.interceptor.ts     # Per-request logging with duration_ms
├── auth/
│   ├── bcrypt/bcrypt.ts               # bcrypt wrapper service
│   ├── controllers/auth.controller.ts # POST /usuarios/login
│   ├── entities/userlogin.entity.ts   # Login DTO
│   ├── guard/jwt-auth.guard.ts        # Route protection
│   ├── services/auth.service.ts       # validateUser + login + JWT signing
│   ├── strategy/jwt.strategy.ts       # JWT validation via ConfigService
│   ├── strategy/local.strategy.ts     # Credential validation — usernameField: usuario
│   └── auth.module.ts
├── usuario/
│   ├── entities/user.entity.ts        # tb_usuarios — OneToMany products
│   ├── controllers/user.controller.ts
│   ├── services/user.service.ts
│   └── usuario.module.ts
├── categoria/
│   ├── entities/categoria.entity.ts   # tb_categorias — OneToMany products
│   ├── controllers/categoria.controller.ts
│   ├── services/categoria.service.ts
│   └── categoria.module.ts
└── produto/
    ├── entities/produto.entity.ts     # tb_produtos — ManyToOne categoria + usuario
    ├── controllers/produto.controller.ts
    ├── services/produto.service.ts
    └── produto.module.ts

infra/
├── main.tf          # VPC + ALB + ECS Cluster + Task Definition + ECS Service + RDS + SSM
├── variables.tf     # Typed variables — sensitive = true for secrets
└── outputs.tf       # ALB DNS, ECS cluster/service names, ECR URL

scripts/
├── smoke_test.py    # Post-deploy validation — 7 tests, exit code 1 on failure
└── requirements.txt
```

---

## API Endpoints

### Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Database connectivity and uptime |

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/usuarios/login` | Public | Authenticate and receive JWT token |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/usuarios/cadastrar` | Public | Register new user |
| GET | `/usuarios/all` | JWT | List all users |
| GET | `/usuarios/:id` | JWT | Get user by ID |
| PUT | `/usuarios` | JWT | Update user |
| DELETE | `/usuarios/:id` | JWT | Delete user |

### Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categorias` | JWT | List all categories |
| GET | `/categorias/:id` | JWT | Get category by ID |
| POST | `/categorias` | JWT | Create category |
| PUT | `/categorias` | JWT | Update category |
| DELETE | `/categorias/:id` | JWT | Delete category |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/produtos` | JWT | List all products |
| GET | `/produtos?preco=X` | JWT | Filter products by max price |
| GET | `/produtos/disponiveis` | JWT | Products in stock |
| GET | `/produtos/:id` | JWT | Get product by ID |
| POST | `/produtos` | JWT | Create product |
| PUT | `/produtos` | JWT | Update product |
| DELETE | `/produtos/:id` | JWT | Delete product |

---

## Running Locally

### Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Python 3.9+ (for smoke tests)
- Datadog account (free trial available)

### Setup

```bash
# Clone the repository
git clone https://github.com/Grupo-05-Turma-Javascript-12/healty-food-delivery-backend-pj03-gp05-js12
cd healty-food-delivery-backend-pj03-gp05-js12

# Create environment file
cp .env.example .env
# Edit .env — set DATABASE_*, JWT_SECRET, DD_API_KEY

# Start all services (API + PostgreSQL + Datadog Agent)
docker compose up -d

# Development mode (hot reload)
npm install
npm run start:dev
```

### Run smoke tests locally

```bash
pip install -r scripts/requirements.txt
python scripts/smoke_test.py
```

---

## Environment Variables

```env
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_USER=healthyfood
DATABASE_PASSWORD=your_password
DATABASE_NAME=db_healthyfood
JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_EXPIRES_IN=1h
PORT=4000
DD_API_KEY=your_datadog_api_key
```

---

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions pipeline:

```
push to main
    ├── Job: test
    │     ├── Spin up PostgreSQL service container
    │     ├── npm ci
    │     ├── TypeScript check (tsc --noEmit)
    │     ├── ESLint
    │     └── Jest (--passWithNoTests)
    │
    ├── Job: build (needs: test)
    │     ├── Configure AWS credentials
    │     ├── Login to ECR
    │     ├── docker build --target production
    │     └── docker push
    │           ├── :<commit-sha>
    │           └── :latest
    │
    └── Job: deploy (needs: build)
          ├── Download current Task Definition
          ├── Render updated Task Definition (new image tag)
          ├── Register new Task Definition revision
          ├── Update ECS Service
          ├── Wait for service stability
          ├── sleep 60s (ALB health check stabilization)
          └── Python smoke tests against ALB
```

---

## Infrastructure (Terraform)

```
VPC (10.2.0.0/16)
├── Public Subnets  (10.2.1.0/24 | 10.2.2.0/24)  — ALB + ECS Tasks
└── Private Subnets (10.2.3.0/24 | 10.2.4.0/24)  — RDS PostgreSQL

Application Load Balancer
├── Listener: HTTP :80 → Target Group
└── Health check: GET /health → expects 200

ECS Fargate Task (256 CPU / 512 MB)
├── Container: healthyfood-api    (essential)
└── Container: datadog-agent      (non-essential sidecar)

Security Groups:
├── ALB:  inbound 80 from 0.0.0.0/0
├── ECS:  inbound 4000 from ALB SG only
└── RDS:  inbound 5432 from ECS SG only

Secrets (SSM Parameter Store — SecureString):
├── /healthyfood/prod/db_password
├── /healthyfood/prod/jwt_secret
└── /healthyfood/prod/datadog_api_key

Remote State: S3 (healthyfood-terraform-state) + DynamoDB locking
```

```bash
cd infra
terraform init
terraform plan \
  -var="db_username=..." -var="db_password=..." \
  -var="jwt_secret=..."  -var="datadog_api_key=..." \
  -var="aws_account_id=..."
terraform apply
```

---

## Observability (Datadog)

**Auto-instrumented by dd-trace:**

- HTTP requests — method, route, status code, duration
- TypeORM queries — operation type, table, duration
- Node.js runtime — event loop lag, heap usage, GC activity

**Log-trace correlation:**

Every log line produced by Winston contains `dd.trace_id` and `dd.span_id` injected by dd-trace. In Datadog Log Explorer, clicking "View in APM" on any log navigates directly to the corresponding trace.

**Key Datadog queries:**

```
# All 5xx errors in production
service:healthyfood-api env:prod status:error

# Slow requests (> 500ms)
service:healthyfood-api duration:>500ms

# Login endpoint performance
service:healthyfood-api resource_name:"POST /usuarios/login"
```

---

## Smoke Tests (Python)

Post-deploy validation runs automatically in the CI/CD pipeline:

| Test | Endpoint | Validates |
|---|---|---|
| Health check | GET /health | API up + DB connected |
| Swagger docs | GET /swagger | Documentation accessible |
| User registration | POST /usuarios/cadastrar | Write path working |
| Authentication | POST /usuarios/login | JWT generation working |
| List categories | GET /categorias | Read path + auth working |
| List products | GET /produtos | Product listing working |
| Unauthorized access | GET /produtos (no token) | JwtAuthGuard active |

All 7 tests must pass for the pipeline to succeed.

---

## Key Technical Decisions

**Why ECS Fargate instead of EC2?**  
Fargate eliminates server management — no OS patches, no instance sizing, no capacity planning. The tradeoff is higher per-unit cost and less control, which is acceptable for a portfolio project. In production at scale, EC2-backed ECS with Spot instances would be more cost-efficient.

**Why Datadog APM instead of OpenTelemetry + Prometheus?**  
Datadog APM provides automatic instrumentation with zero code changes, log-trace correlation out of the box, and a unified platform for traces, logs, and metrics. The sidecar pattern on ECS is the standard Datadog deployment model — it reflects real production architectures. The Drugstore API uses OpenTelemetry + Prometheus, demonstrating both vendor-neutral and commercial observability approaches across the portfolio.

**Why SSM Parameter Store instead of environment variables?**  
Environment variables in ECS Task Definitions are visible in plaintext in the AWS console and in Terraform state. SSM Parameter Store with `SecureString` type encrypts values at rest with KMS and decrypts them only at container startup. Credentials never appear in logs, console, or version control.

**Why JWT secret moved from constants.ts to ConfigService?**  
The original project hardcoded the JWT secret in source code — anyone with repository access could forge valid tokens for any user. ConfigService reads from environment variables at runtime, keeping secrets out of version control entirely.

**Why smoke tests after every deploy?**  
ECS can report a deployment as successful (task is running) while the application is misconfigured — wrong environment variables, failed database migration, missing secrets. Smoke tests validate the actual behavior of the deployed application against the real ALB endpoint, catching configuration issues that infrastructure health checks miss.

---

## Author

**Raylander Ribeiro Ferreira**  
DevOps & Cloud Engineer | AWS SAA | AWS DVA  
[LinkedIn](https://linkedin.com/in/raylanderribeiro) · [GitHub](https://github.com/RayRibeirost)