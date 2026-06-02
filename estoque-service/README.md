# estoque-service

Microsserviço responsável por gerenciar o estoque e consumir pedidos da fila RabbitMQ `fila_pedidos`.

## Hospedagem

- **Serviço**: Render
- **Mensageria**: CloudAMQP (fila `fila_pedidos`)

## Pré-requisitos

### Subir o RabbitMQ via Docker

```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

O painel de administração ficará disponível em http://localhost:15672 (usuário: `guest`, senha: `guest`).

## Instalação

```bash
cd estoque-service
npm install
```

## Configuração

Edite o arquivo `.env` se necessário:

```
PORT=3002
RABBITMQ_URL=amqp://localhost
```

## Executar

```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

Ao iniciar, o serviço automaticamente começa a consumir mensagens da fila `fila_pedidos` e atualiza o estoque em memória.

## Estoque inicial

| Produto  | Quantidade |
|----------|-----------|
| Notebook | 10        |
| Mouse    | 50        |

## Endpoints

### GET /estoque

Retorna o estado atual do estoque em memória.

**Resposta (200):**
```json
[
  { "produto": "Notebook", "quantidade": 10 },
  { "produto": "Mouse", "quantidade": 50 }
]
```
