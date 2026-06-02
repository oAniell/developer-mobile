# Produtos & Usuários

Aplicação fullstack com arquitetura de microsserviços para gerenciamento de usuários, produtos, pedidos e estoque.

## Arquitetura

```
Frontend (Expo/React Native)
        │
        ├── server          → usuários, produtos, autenticação
        ├── pedido-service  → criação de pedidos
        └── estoque-service → consumo de pedidos e controle de estoque
                                    │
                             [RabbitMQ - fila_pedidos]
```

## Serviços e Hospedagem

| Serviço | Descrição | Hospedagem |
|---|---|---|
| Frontend | App React Native (web) | Vercel |
| server | API principal — usuários, produtos e auth | Render |
| pedido-service | Microsserviço de pedidos | Render |
| estoque-service | Microsserviço de estoque | Render |
| RabbitMQ | Fila de mensagens (`fila_pedidos`) | CloudAMQP |

## Fluxo de Pedidos

1. Frontend envia POST para `pedido-service`
2. `pedido-service` publica o pedido na fila `fila_pedidos`
3. `estoque-service` consome a mensagem e atualiza o estoque

## Variáveis de Ambiente

### server
```
PORT=3000
```

### pedido-service
```
PORT=3001
RABBITMQ_URL=amqps://<usuario>:<senha>@<host>/<vhost>
```

### estoque-service
```
PORT=3002
RABBITMQ_URL=amqps://<usuario>:<senha>@<host>/<vhost>
```

### Frontend
```
EXPO_PUBLIC_API_URL=<url do server>
EXPO_PUBLIC_PEDIDO_API_URL=<url do pedido-service>
EXPO_PUBLIC_ESTOQUE_API_URL=<url do estoque-service>
```
