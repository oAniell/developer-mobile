# pedido-service

Microsserviço responsável por registrar pedidos e publicá-los na fila RabbitMQ `fila_pedidos`.

## Pré-requisitos

### Subir o RabbitMQ via Docker

```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

O painel de administração ficará disponível em http://localhost:15672 (usuário: `guest`, senha: `guest`).

## Instalação

```bash
cd pedido-service
npm install
```

## Configuração

Edite o arquivo `.env` se necessário:

```
PORT=3001
RABBITMQ_URL=amqp://localhost
```

## Executar

```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

## Endpoints

### POST /pedidos

Cria um pedido e publica na fila RabbitMQ.

**Body:**
```json
{ "id": "1", "produto": "Notebook", "quantidade": 2 }
```

**Resposta (201):**
```json
{ "id": "1", "produto": "Notebook", "quantidade": 2 }
```

### GET /pedidos

Retorna todos os pedidos registrados em memória.

**Resposta (200):**
```json
[{ "id": "1", "produto": "Notebook", "quantidade": 2 }]
```
