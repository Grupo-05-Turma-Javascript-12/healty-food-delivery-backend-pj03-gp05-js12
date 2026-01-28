# NutriBox - Delivery de Comidas Saudáveis

## 📌 Descrição Geral

O **NutriBox** é uma API para gerenciamento de um sistema de delivery de comidas saudáveis.  
A aplicação permite o cadastro de usuários, produtos e categorias, facilitando a organização e a oferta de refeições saudáveis de forma prática e moderna.

A proposta comercial gira em torno da **praticidade na regularização de uma alimentação mais saudável**, utilizando uma arquitetura moderna baseada em API.

---

## Regras de Negócio

### 1. Usuários
- Nome, usuário, senha e foto são obrigatórios.
- O e-mail deve ser exclusivo por usuário.
- O ID é gerado automaticamente pelo sistema.
- Um usuário pode estar associado a vários produtos.

### 2. Produtos
- Nome e preço são obrigatórios.
- O preço não pode ser negativo.
- Produtos são criados como ativos por padrão.
- Produtos podem estar associados a categorias.

### 3. Categorias
- Nome é obrigatório.
- Uma categoria pode estar associada a vários produtos.

---

## Identidade das Entidades
- O ID é único, automático e gerado pelo banco de dados.
- O ID não pode ser alterado.
- As entidades podem possuir nomes iguais, desde que tenham IDs diferentes.

---

## Entidades e Atributos

### Usuário (`tb_usuarios`)
| Campo          | Tipo                          |
|----------------|-------------------------------|
| id             | INT (PK, AI)                  |
| nome           | VARCHAR(255) NOT NULL         |
| usuario        | VARCHAR(255) NOT NULL         |
| senha          | VARCHAR(150) NOT NULL         |
| foto           | VARCHAR(5000) NOT NULL        |
| data_cadastro  | DATE AUTO                     |
| produtos       | FK                            |

### Produto (`tb_produtos`)
| Campo       | Tipo                          |
|-------------|-------------------------------|
| id          | INT (PK, AI)                  |
| nome        | VARCHAR(255) NOT NULL         |
| descricao   | VARCHAR(255) NOT NULL         |
| preco       | DECIMAL(10,2) NOT NULL        |
| em_estoque  | BOOLEAN DEFAULT TRUE          |
| categoria   | FK                            |

### Categoria (`tb_categorias`)
| Campo    | Tipo                   |
|----------|------------------------|
| id       | INT (PK, AI)           |
| nome     | VARCHAR(255) NOT NULL  |
| descricao| VARCHAR(500)           |
| produtos | FK                     |



## Funcionalidades (CRUD)

### Usuários
- getAllUsers  
- getUserById  
- getUserByUsername  
- createUser  
- updateUser  
- deleteUser  

### Produtos
- getAllProducts  
- getProductById  
- createProduct  
- updateProduct  
- deleteProduct  

### Categorias
- getAllCategories  
- getCategoryById  
- createCategory  
- updateCategory  
- deleteCategory  


## Endpoints da API

### Usuários

GET    /usuarios                -> Lista todos os usuários  
GET    /usuarios/:id            -> Busca usuário por ID  
GET    /usuarios/:username      -> Busca usuário por username  
POST   /usuarios                -> Cria novo usuário  
PUT    /usuarios                -> Atualiza usuário  
DELETE /usuarios/:id            -> Remove usuário  

### Produtos

GET    /produtos                -> Lista todos os produtos  
GET    /produtos/:id            -> Busca produto por ID  
POST   /produtos                -> Cria novo produto  
PUT    /produtos                -> Atualiza produto  
DELETE /produtos/:id            -> Remove produto  

### Categorias

GET    /categorias              -> Lista todas as categorias  
GET    /categorias/:id          -> Busca categoria por ID  
POST   /categorias              -> Cria nova categoria  
PUT    /categorias              -> Atualiza categoria  
DELETE /categorias/:id          -> Remove categoria  

**Tecnologias Utilizadas**
Banco de Dados: SQL
Back-end: NestJS
ORM: TypeORM

**Acesso à Aplicação**
https://healty-food-delivery-backend-pj03-gp05.onrender.com/

**Etapas do Projeto**
Fase 1: CRUD

Configurar Entidades
Configurar Módulos
Configurar Services
Configurar Controllers
Configurar Relações

Fase 2: Autenticação

Configurar estratégias
Configurar Guards
Relacionamento com User

Fase 3: Módulo Principal

Configuração do AppModule
Configuração do arquivo de dados
Finalização

Em paralelo:
Integração com Swagger
Deploy no Render
