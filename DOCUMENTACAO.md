# Sistema de Gestão de Vendas Interna
## Documentação Técnica — Entrega de Trabalho

---

## Sumário

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura](#2-arquitetura)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Estrutura de Diretórios](#4-estrutura-de-diretórios)
5. [Microserviços](#5-microserviços)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [Funcionalidades da Aplicação Mobile](#7-funcionalidades-da-aplicação-mobile)
8. [Offline First — Sincronização de Pedidos](#8-offline-first--sincronização-de-pedidos)
9. [Banco de Dados](#9-banco-de-dados)
10. [Mensageria com RabbitMQ](#10-mensageria-com-rabbitmq)
11. [API Reference](#11-api-reference)
12. [Testes Unitários](#12-testes-unitários)
13. [Variáveis de Ambiente](#13-variáveis-de-ambiente)
14. [Deploy e Infraestrutura](#14-deploy-e-infraestrutura)
15. [Fluxos Principais](#15-fluxos-principais)

---

## 1. Visão Geral do Sistema

O sistema é uma aplicação **fullstack mobile** de gestão de vendas interna, desenvolvida com React Native (Expo) no frontend e uma arquitetura de **microserviços** no backend. O objetivo é permitir que uma empresa gerencie seu catálogo de produtos, controle o estoque e registre pedidos de venda — inclusive com equipes externas que podem operar **offline**.

### Escopo

- **Administrador**: gerencia os funcionários (usuários) do sistema
- **Funcionário**: cadastra produtos da empresa, registra vendas (pedidos), consulta o estoque
- **Sistema**: controla automaticamente a saída do estoque a cada venda confirmada

### Objetivos do Projeto

| Objetivo | Descrição |
|---|---|
| Gestão de Funcionários | Admin cadastra/edita/remove funcionários com controle de perfil |
| Catálogo de Produtos | CRUD do catálogo da empresa, produtos vinculados ao funcionário responsável |
| Registro de Vendas | Criação de pedidos com validação de estoque em tempo real |
| Controle de Estoque | Inventário persistido no Firebase, atualizado via fila de mensagens |
| Offline-First | Vendas registradas offline são sincronizadas automaticamente ao reconectar |

---

## 2. Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                  React Native App (Expo)                  │
│         - Telas de Login, Cadastro, Dashboard            │
│         - Gerenciamento via Context API + SQLite         │
└──────────┬───────────────────────────┬───────────────────┘
           │ REST                      │ REST
           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Server (Porta 3000)│    │ Pedido-Service (3001)│
│  - Autenticação JWT  │    │  - Criação de pedidos│
│  - CRUD Usuários     │    │  - Valida estoque    │
│  - CRUD Produtos     │    │  - Publica no queue  │
│  - Firebase Firestore│    └──────────┬──────────┘
└─────────────────────┘               │ AMQP
                                       ▼
                           ┌───────────────────────┐
                           │    RabbitMQ (CloudAMQP) │
                           │     fila_pedidos        │
                           └───────────┬────────────┘
                                       │ Consume
                                       ▼
                           ┌───────────────────────┐
                           │ Estoque-Service (3002) │
                           │  - Controle de estoque │
                           │  - In-memory store     │
                           └───────────────────────┘
```

### Padrão Arquitetural

- **Frontend**: React Native com Expo, arquitetura baseada em Context API para estado global
- **Backend**: Microserviços REST independentes com Express.js
- **Mensageria**: Fila assíncrona RabbitMQ para desacoplamento entre pedidos e estoque
- **Autenticação**: JWT stateless com expiração de 1 hora
- **Persistência**: Firebase Firestore (cloud) + SQLite/AsyncStorage (local offline)

---

## 3. Tecnologias Utilizadas

### Frontend (App Mobile)

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React Native | 0.83.2 | Framework mobile multiplataforma |
| Expo | 55.0.7 | Toolchain de desenvolvimento |
| expo-sqlite | 55.0.16 | Banco de dados local para offline |
| AsyncStorage | 2.2.0 | Persistência de chave-valor (web/mobile) |
| NetInfo | 11.5.2 | Detecção de conectividade de rede |
| jwt-decode | 4.0.0 | Decodificação de tokens JWT no cliente |
| Firebase SDK | 12.12.1 | SDK cliente Firebase |

### Backend (Microserviços)

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 18+ | Runtime JavaScript server-side |
| Express.js | 4.x | Framework web REST API |
| Firebase Admin SDK | 13.8.0 | Acesso ao Firestore com credenciais admin |
| jsonwebtoken | 9.0.3 | Geração e verificação de tokens JWT |
| bcrypt | 6.0.0 | Hash seguro de senhas |
| amqplib | 0.10.4 | Cliente AMQP para RabbitMQ |
| Resend / Nodemailer | — | Envio de e-mails transacionais |

### Infraestrutura

| Serviço | Plataforma | Finalidade |
|---|---|---|
| Banco de Dados | Firebase Firestore | Persistência cloud de usuários e produtos |
| Fila de Mensagens | CloudAMQP | Hospedagem gerenciada do RabbitMQ |
| Server API | Render | Deploy do backend principal |
| Microserviços | Render | Deploy de pedido-service e estoque-service |
| App (web) | Vercel | Hospedagem da versão web do Expo |

### Ferramentas de Teste

| Ferramenta | Versão | Finalidade |
|---|---|---|
| Jest | 29.7.0 | Framework de testes unitários |
| Supertest | 7.x | Testes de integração de rotas HTTP |

---

## 4. Estrutura de Diretórios

```
Produtos-Usuarios/
├── App.js                          # Tela principal: tabs, CRUD, orquestração
├── index.js                        # Entry point Expo
├── package.json                    # Dependências do app mobile
│
├── screens/
│   ├── LoginScreen.js              # Tela de autenticação
│   └── RegisterScreen.js           # Tela de cadastro
│
├── context/
│   └── AuthContext.js              # Context API: token JWT, login, logout
│
├── components/
│   ├── Toast.js                    # Notificações toast
│   └── ConfirmModal.js             # Modal de confirmação
│
├── styles/
│   └── globalStyles.js             # Estilos centralizados
│
├── src/
│   ├── hooks/
│   │   ├── useConectividade.js     # Hook de detecção de rede
│   │   └── useSincronizador.js     # Hook de sincronização offline
│   └── database/
│       ├── database.js             # Inicialização SQLite/AsyncStorage
│       ├── pedidosRepository.js    # Repositório de pedidos locais
│       ├── produtosRepository.js   # Cache de produtos offline
│       └── storage.js              # Implementação AsyncStorage (web)
│
├── server/                         # Microserviço principal (porta 3000)
│   ├── app.js                      # Express app (testável)
│   ├── server.js                   # Entry point + listen
│   ├── firebase.js                 # Inicialização Firebase Admin
│   ├── routes/
│   │   ├── auth.js                 # POST /auth/register, /auth/login
│   │   ├── products.js             # CRUD /products
│   │   └── users.js                # CRUD /users (admin only)
│   ├── middleware/
│   │   └── protect.js              # Middlewares autenticar + autorizar
│   ├── data/
│   │   └── db.js                   # Funções CRUD Firestore
│   ├── services/
│   │   └── email.js                # Envio de senha provisória
│   └── __tests__/
│       ├── protect.test.js         # 8 testes de middleware
│       ├── auth.test.js            # 9 testes de autenticação
│       └── products.test.js        # 13 testes de produtos
│
├── pedido-service/                 # Microserviço de pedidos (porta 3001)
│   ├── app.js                      # Express app (testável)
│   ├── server.js                   # Entry point
│   ├── rabbitmq.js                 # Publisher RabbitMQ
│   ├── routes/
│   │   └── pedidos.js              # POST/GET /pedidos
│   ├── data/
│   │   └── pedidos.js              # In-memory store de pedidos
│   └── __tests__/
│       └── pedidos.test.js         # 7 testes de pedidos
│
└── estoque-service/                # Microserviço de estoque (porta 3002)
    ├── app.js                      # Express app (testável)
    ├── server.js                   # Entry point + inicia consumidor
    ├── rabbitmq.js                 # Consumer RabbitMQ
    ├── routes/
    │   └── estoque.js              # GET/POST /estoque
    ├── data/
    │   └── estoque.js              # In-memory store de estoque
    └── __tests__/
        └── estoque.test.js         # 10 testes de estoque
```

---

## 5. Microserviços

### 5.1 Server — API Principal (porta 3000)

Responsável por autenticação, gerenciamento de usuários e produtos. Conecta ao Firebase Firestore para persistência.

**Responsabilidades:**
- Registro e login com JWT
- CRUD de usuários com controle de perfil
- CRUD de produtos com validação de propriedade
- Envio de senha provisória por e-mail ao criar usuário

### 5.2 Pedido-Service (porta 3001)

Gerencia a criação de pedidos. Consulta o estoque antes de aceitar e publica na fila RabbitMQ.

**Responsabilidades:**
- Validar disponibilidade de estoque antes de aceitar pedido
- Publicar pedido na fila `fila_pedidos`
- Manter lista em memória de pedidos criados

### 5.3 Estoque-Service (porta 3002)

Controla o inventário. Consome mensagens da fila RabbitMQ e atualiza o estoque.

**Responsabilidades:**
- Expor endpoints REST para consulta e adição de estoque
- Consumir mensagens da fila e decrementar estoque automaticamente
- Manter dados de estoque em memória

---

## 6. Autenticação e Autorização

### Fluxo JWT

```
Cliente              Server
  │                    │
  │──POST /auth/login──▶│
  │                    │ 1. Busca usuário no Firestore
  │                    │ 2. Compara senha com bcrypt
  │                    │ 3. Gera JWT com { id, nome, perfil }
  │◀─── { token } ─────│    expiração: 1 hora
  │                    │
  │──GET /users ───────▶│ Header: Authorization: Bearer <token>
  │   Bearer <token>    │ 4. Middleware autenticar() verifica token
  │                    │ 5. Middleware autorizar('admin') verifica perfil
  │◀─── [users] ────────│
```

### Perfis de Acesso

| Perfil | Pode acessar |
|---|---|
| `admin` | CRUD usuários, CRUD todos os produtos |
| `usuario` | Leitura de produtos, CRUD dos próprios produtos, criar pedidos |
| Anônimo | Apenas leitura de produtos (GET /products) |

### Restauração de Sessão (Mobile)

Ao abrir o app, o `AuthContext` recupera o token do `AsyncStorage`, verifica se expirou via `jwtDecode` (sem chamada à rede) e restaura o estado do usuário sem necessidade de re-login.

---

## 7. Funcionalidades da Aplicação Mobile

### Interface por Abas

| Aba | Perfil | Funcionalidade |
|---|---|---|
| Usuários | Admin only | Listar, criar, editar e excluir usuários |
| Produtos | Todos | Listar todos os produtos; criar/editar/excluir os próprios |
| Pedidos | Todos | Criar pedidos a partir do cache de produtos |
| Estoque | Todos | Visualizar e adicionar itens ao estoque |

### Layout Responsivo

- **Desktop (web)**: layout de 2 colunas (lista + formulário visíveis simultaneamente)
- **Mobile**: navegação alternada entre lista e formulário

### Confirmação de Ações Destrutivas

Exclusões de usuários e produtos exibem modal de confirmação antes de prosseguir.

---

## 8. Offline First — Sincronização de Pedidos

Esta é uma das funcionalidades mais complexas do sistema, permitindo criar pedidos mesmo sem conexão com a internet.

### Fluxo de Criação Offline

```
Usuário cria pedido
        │
        ▼
┌─────────────────────┐
│  Há conexão?        │
└─────────────────────┘
   Não │          │ Sim
       ▼          ▼
  Salva no    Envia direto
  SQLite com  para API e
  status=     salva com
  PENDENTE    SINCRONIZADO
       │
       ▼
  Conectou?
       │
       ▼
  useSincronizador
  dispara sincronizar()
       │
  Para cada PENDENTE:
  1. Status → SINCRONIZANDO
  2. POST /pedidos
  3. 201? → SINCRONIZADO
  4. Erro? → ERRO + msg
```

### Status de Pedidos

| Status | Descrição |
|---|---|
| `PENDENTE` | Criado localmente, aguardando sincronização |
| `SINCRONIZANDO` | Em processo de envio para a API |
| `SINCRONIZADO` | Confirmado pelo servidor |
| `ERRO` | Falhou na sincronização (mensagem de erro salva) |

### Detecção de Conectividade

O hook `useConectividade` usa `@react-native-community/netinfo` para monitorar o estado da rede. Quando a conexão é restaurada, `useSincronizador.sincronizar()` é invocado automaticamente.

### Cache de Produtos

O `produtosRepository` mantém um cache local dos produtos em SQLite (mobile) ou AsyncStorage (web), permitindo criar pedidos offline sem precisar consultar a API.

---

## 9. Banco de Dados

### Firebase Firestore (Cloud)

Banco de dados NoSQL orientado a documentos utilizado pelo servidor principal.

#### Coleção `auth_users`
```json
{
  "id": "auto-generated",
  "nome": "string",
  "email": "string",
  "senha": "string (bcrypt hash)",
  "perfil": "admin | usuario"
}
```

#### Coleção `users`
```json
{
  "id": "auto-generated",
  "name": "string",
  "email": "string"
}
```

#### Coleção `products`
```json
{
  "id": "auto-generated",
  "name": "string",
  "description": "string",
  "price": "number",
  "userId": "string (referência ao criador)"
}
```

### SQLite Local (Mobile)

Utilizado para armazenar dados offline no dispositivo.

#### Tabela `pedidos_pendentes`
```sql
CREATE TABLE pedidos_pendentes (
  id TEXT PRIMARY KEY,
  produto TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDENTE',
  erro_msg TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### Tabela `produtos_cache`
```sql
CREATE TABLE produtos_cache (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  price REAL,
  userId TEXT
)
```

### Coleção `estoque` no Firestore (via estoque-service)

O estoque é persistido no Firestore pelo `estoque-service`. Na inicialização, os dados são carregados do Firestore para memória (cache). A cada escrita (POST /estoque ou consumo da fila), o Firestore é atualizado de forma assíncrona.

```
estoque/{produto_name}: { produto: "Notebook", quantidade: 10 }
```

O `pedido-service` mantém em memória apenas a lista de pedidos da sessão atual.

---

## 10. Mensageria com RabbitMQ

### Configuração da Fila

```
Nome da fila: fila_pedidos
Tipo: durable (sobrevive a reinicialização do broker)
Mensagens: persistent: true
```

### Fluxo de Mensagens

```
pedido-service                    RabbitMQ                  estoque-service
     │                               │                            │
     │──publicarPedido(pedido)───────▶│                            │
     │   { id, produto, quantidade } │──── fila_pedidos ──────────▶│
     │                               │                            │
     │                               │                 iniciarConsumidor()
     │                               │                 consome mensagem
     │                               │                 atualiza estoque:
     │                               │                 item.quantidade -= qtd
     │                               │◀── ack ────────────────────│
```

### Publisher (pedido-service/rabbitmq.js)

Conecta, cria canal, asserta fila, publica mensagem JSON e fecha conexão a cada publicação.

### Consumer (estoque-service/rabbitmq.js)

Conecta na inicialização, fica ouvindo a fila e processa mensagens conforme chegam. A conexão é mantida persistente.

---

## 11. API Reference

### Server (porta 3000)

#### POST /auth/register
Cadastra novo usuário.

**Body:**
```json
{ "nome": "string", "email": "string", "senha": "string (min 8)", "perfil": "admin|usuario" }
```

**Respostas:** `201 Created` | `400 Bad Request` | `409 Conflict`

---

#### POST /auth/login
Autentica usuário e retorna token JWT.

**Body:**
```json
{ "email": "string", "senha": "string" }
```

**Respostas:** `200 OK` com `{ token }` | `401 Unauthorized`

---

#### GET /products
Lista todos os produtos. Público.

**Resposta:** `200 OK` com array de produtos.

---

#### POST /products
Cria produto. Requer autenticação.

**Header:** `Authorization: Bearer <token>`

**Body:** `{ "name", "description", "price" }`

**Resposta:** `201 Created`

---

#### PUT /products/:id
Atualiza produto. Dono ou admin.

**Header:** `Authorization: Bearer <token>`

**Respostas:** `200 OK` | `403 Forbidden` | `404 Not Found`

---

#### DELETE /products/:id
Remove produto. Dono ou admin.

**Header:** `Authorization: Bearer <token>`

**Respostas:** `200 OK` | `403 Forbidden` | `404 Not Found`

---

#### GET /users
Lista usuários. Admin only.

**Header:** `Authorization: Bearer <token>` (perfil admin)

**Resposta:** `200 OK` | `403 Forbidden`

---

#### POST /users
Admin cria usuário e envia senha provisória por e-mail.

**Header:** `Authorization: Bearer <token>` (perfil admin)

**Body:** `{ "name", "email", "perfil" }`

**Resposta:** `201 Created` | `409 Conflict`

---

### Pedido-Service (porta 3001)

#### POST /pedidos
Cria pedido (com verificação de estoque).

**Body:** `{ "id": "string", "produto": "string", "quantidade": "number" }`

**Respostas:** `201 Created` | `422 Unprocessable Entity` (estoque insuficiente) | `500` (RabbitMQ indisponível)

---

#### GET /pedidos
Lista todos os pedidos criados na sessão.

**Resposta:** `200 OK` com array de pedidos.

---

### Estoque-Service (porta 3002)

#### GET /estoque
Lista todo o estoque.

**Resposta:** `200 OK` com array de `{ produto, quantidade }`.

---

#### GET /estoque/:produto
Consulta estoque de um produto específico.

**Respostas:** `200 OK` | `404 Not Found`

---

#### POST /estoque
Adiciona estoque (cria ou incrementa).

**Body:** `{ "produto": "string", "quantidade": "number (positivo)" }`

**Respostas:** `201 Created` | `400 Bad Request`

---

## 12. Testes Unitários

### Cobertura

| Serviço | Arquivo de Testes | Testes | Resultado |
|---|---|---|---|
| estoque-service | `__tests__/estoque.test.js` | 10 | ✅ 10/10 |
| pedido-service | `__tests__/pedidos.test.js` | 7 | ✅ 7/7 |
| server (middleware) | `__tests__/protect.test.js` | 8 | ✅ 8/8 |
| server (autenticação) | `__tests__/auth.test.js` | 9 | ✅ 9/9 |
| server (produtos) | `__tests__/products.test.js` | 13 | ✅ 13/13 |
| **Total** | — | **47** | **✅ 47/47** |

### Executar os Testes

```bash
# Estoque Service
cd estoque-service && npm test

# Pedido Service
cd pedido-service && npm test

# Server (API Principal)
cd server && npm test
```

### Estratégia de Mock

- **Firebase Firestore**: mockado com `jest.mock('../firebase')` — evita dependência de credenciais reais
- **RabbitMQ**: mockado com `jest.mock('../rabbitmq')` — evita conexão de rede em testes
- **fetch global**: substituído por `jest.fn()` no pedido-service para simular respostas do estoque
- **Dados in-memory**: resetados em `beforeEach` via `splice()` para isolamento de testes

### Casos de Teste por Módulo

#### estoque.test.js
- Listagem completa do estoque
- Busca por produto existente e inexistente
- Adição de estoque em produto existente e novo
- Validações: produto vazio, quantidade zero, negativa, não-numérica
- Trimming de espaços no nome do produto

#### pedidos.test.js
- Listagem de pedidos (vazio e com dados)
- Criação de pedido com estoque disponível
- Rejeição por produto inexistente no estoque
- Rejeição por estoque insuficiente
- Comportamento quando serviço de estoque indisponível
- Erro de RabbitMQ retorna 500

#### protect.test.js
- Rejeição sem header Authorization
- Rejeição com token inválido e expirado
- Acesso com token válido e população de req.usuario
- Autorização: sem req.usuario, perfil incorreto, perfil correto, múltiplos perfis

#### auth.test.js
- Validações de registro: nome, email, senha, perfil
- Conflito de email duplicado no registro
- Login com usuário inexistente
- Login com senha incorreta
- Login com sucesso e verificação do payload do token

#### products.test.js
- Listagem pública de produtos
- Criação exige autenticação
- Edição/exclusão exige autenticação
- Controle de propriedade: usuário só edita/exclui os próprios
- Admin pode operar qualquer produto
- 404 para produtos inexistentes

---

## 13. Variáveis de Ambiente

### App Mobile (.env.local)

```env
EXPO_PUBLIC_API_URL=https://sua-api.onrender.com
EXPO_PUBLIC_PEDIDO_API_URL=https://pedido-service.onrender.com
EXPO_PUBLIC_ESTOQUE_API_URL=https://estoque-service.onrender.com
```

### Server (server/.env)

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-longa
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...} # JSON da conta de serviço
RESEND_API_KEY=re_xxxx                                   # Chave da API de e-mail
```

### Pedido-Service (pedido-service/.env)

```env
PORT=3001
RABBITMQ_URL=amqps://user:pass@host/vhost
ESTOQUE_API_URL=https://estoque-service.onrender.com
```

### Estoque-Service (estoque-service/.env)

```env
PORT=3002
RABBITMQ_URL=amqps://user:pass@host/vhost
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  # mesmo valor do server
```

---

## 14. Deploy e Infraestrutura

### Diagrama de Infraestrutura

```
[Usuário Mobile / Browser]
         │
         │ HTTPS
         ▼
   ┌─────────────┐     ┌──────────────────┐
   │   Vercel    │     │      Render       │
   │  (Frontend  │     │  ┌─────────────┐ │
   │   Expo Web) │     │  │   server    │ │
   └─────────────┘     │  │  (porta 3000│ │
                       │  └──────┬──────┘ │
                       │         │        │
                       │  ┌──────┴──────┐ │     ┌──────────────┐
                       │  │pedido-service│ │     │  CloudAMQP   │
                       │  │ (porta 3001)│─┼────▶│  RabbitMQ    │
                       │  └──────┬──────┘ │     └──────┬───────┘
                       │         │        │            │
                       │  ┌──────┴──────┐ │◀───────────┘
                       │  │estoque-svc  │ │
                       │  │ (porta 3002)│ │
                       │  └─────────────┘ │
                       └──────────────────┘
                                │
                                │
                       ┌────────▼────────┐
                       │   Firebase      │
                       │   Firestore     │
                       │  (banco cloud)  │
                       └─────────────────┘
```

---

## 15. Fluxos Principais

### 15.1 Fluxo de Login

```
1. Usuário insere email + senha
2. LoginScreen chama AuthContext.login()
3. POST /auth/login → verifica email no Firestore
4. bcrypt.compare(senha, hash)
5. jwt.sign({ id, nome, perfil }, JWT_SECRET, { expiresIn: '1h' })
6. Token salvo no AsyncStorage
7. jwtDecode(token) → extrai payload para contexto
8. App redireciona para Dashboard
```

### 15.2 Fluxo de Criação de Produto

```
1. Usuário preenche formulário na aba Produtos
2. App.js chama createProduct({ ...dados, userId: usuario.id })
3. POST /products com Bearer token
4. Middleware autenticar() verifica JWT
5. createProduct() salva no Firestore
6. App atualiza lista local
```

### 15.3 Fluxo de Pedido com Fila

```
1. Usuário seleciona produto do cache e informa quantidade
2. POST /pedidos (pedido-service)
3. pedido-service consulta GET /estoque/:produto
4. Se estoque OK: publica na fila RabbitMQ (fila_pedidos)
5. pedido-service retorna 201
6. estoque-service consome mensagem
7. item.quantidade -= quantidade
```

### 15.4 Fluxo Offline-First

```
1. App detecta ausência de rede (NetInfo)
2. Pedido salvo no SQLite com status PENDENTE
3. Quando conexão restabelecida:
   a. useSincronizador.sincronizar() é chamado
   b. getPedidosPendentes() busca registros locais
   c. Para cada pedido: POST /pedidos (com timeout 10s)
   d. 201 → updateStatusPedido(id, 'SINCRONIZADO')
   e. Erro → updateStatusPedido(id, 'ERRO', mensagem)
4. Toast informa ao usuário quantos pedidos foram sincronizados
```

---

## Conclusão

O sistema demonstra na prática conceitos avançados de desenvolvimento fullstack mobile:

- **Microserviços**: três serviços independentes com responsabilidades bem definidas
- **Mensageria assíncrona**: desacoplamento via RabbitMQ com garantia de entrega
- **Offline-First**: experiência de usuário contínua independentemente de conectividade
- **Autenticação JWT**: stateless, com refresh por expiração e perfis de acesso
- **Testes unitários**: 47 testes cobrindo middleware, autenticação, CRUD e validações
- **Responsividade**: interface adaptada para web e mobile no mesmo codebase

---

*Documento gerado em: Junho de 2026*
