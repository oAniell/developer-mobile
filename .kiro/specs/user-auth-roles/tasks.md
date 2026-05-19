# Plano de Implementação: user-auth-roles

## Visão Geral

Implementação incremental da autenticação JWT com controle de acesso baseado em perfil (RBAC) no aplicativo React Native (Expo) com backend Node.js/Express e Firebase/Firestore. O plano conecta a infraestrutura já existente no backend ao frontend, aplica as regras de acesso em todas as rotas e persiste a sessão do usuário via `AsyncStorage`.

---

## Tarefas

- [ ] 1. Preparar infraestrutura de testes e dependências
  - Instalar `fast-check` e `jest` no `server/` (`npm install --save-dev fast-check jest`)
  - Instalar `fast-check` e `jest` no frontend (`npm install --save-dev fast-check jest @testing-library/react-native`)
  - Criar estrutura de diretórios `server/__tests__/` e `__tests__/` na raiz
  - Adicionar script `"test": "jest"` nos `package.json` do servidor e do frontend
  - _Requisitos: 1.1, 2.1, 3.1, 4.1, 6.1_

- [ ] 2. Backend — Validação de entrada e proteção da rota de registro
  - [ ] 2.1 Adicionar validação de campos em `POST /auth/register`
    - Validar `nome`: não vazio, máximo 100 caracteres → HTTP 400 com mensagem descritiva
    - Validar `email`: formato válido via regex → HTTP 400 com mensagem descritiva
    - Validar `senha`: mínimo 8 caracteres → HTTP 400 com mensagem descritiva
    - Validar `perfil`: deve ser exatamente `"admin"` ou `"usuario"` → HTTP 400 com `"Perfil inválido. Use 'admin' ou 'usuario'"`
    - Arquivo: `server/routes/auth.js`
    - _Requisitos: 1.1, 1.3, 1.4_

  - [ ]* 2.2 Escrever teste de propriedade para registro com dados válidos
    - **Propriedade 1: Registro com dados válidos sempre cria usuário com senha hasheada**
    - **Valida: Requisito 1.1**
    - Arquivo: `server/__tests__/auth.test.js`
    - Arbitrários: `fc.record({ nome, email, senha, perfil })` com valores válidos

  - [ ]* 2.3 Escrever teste de propriedade para rejeição de perfis inválidos
    - **Propriedade 2: Validação de entrada rejeita perfis inválidos**
    - **Valida: Requisito 1.3**
    - Arquivo: `server/__tests__/auth.test.js`
    - Arbitrários: `fc.string().filter(s => s !== 'admin' && s !== 'usuario')`

  - [ ]* 2.4 Escrever teste de propriedade para payload do JWT no login
    - **Propriedade 8: Login bem-sucedido sempre produz token com payload correto**
    - **Valida: Requisito 2.1**
    - Arquivo: `server/__tests__/auth.test.js`
    - Arbitrários: `fc.record({ id, nome, perfil })` → JWT

  - [ ]* 2.5 Escrever testes unitários para fluxos de autenticação
    - Cadastro com email duplicado → HTTP 409
    - Login com email inexistente → HTTP 401
    - Login com senha incorreta → HTTP 401
    - Arquivo: `server/__tests__/auth.test.js`
    - _Requisitos: 1.2, 2.2_

- [ ] 3. Backend — Proteger rotas de usuários com autenticação e autorização
  - [ ] 3.1 Aplicar middlewares `autenticar` e `autorizar('admin')` em todas as rotas de `/users`
    - `GET /users`: adicionar `autenticar, autorizar('admin')`
    - `POST /users`: adicionar `autenticar, autorizar('admin')`
    - `PUT /users/:id`: adicionar `autenticar, autorizar('admin')`
    - `DELETE /users/:id`: adicionar `autenticar, autorizar('admin')`
    - Arquivo: `server/routes/users.js`
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.2_

  - [ ]* 3.2 Escrever teste de propriedade para acesso de admin em /users
    - **Propriedade 3: Role_Guard permite acesso de admin a todas as operações de escrita em /users**
    - **Valida: Requisitos 3.1, 3.2, 3.3**
    - Arquivo: `server/__tests__/users.test.js`
    - Arbitrários: `fc.record({ id, nome, perfil: 'admin' })` → JWT

  - [ ]* 3.3 Escrever teste de propriedade para bloqueio de usuário comum em /users
    - **Propriedade 4: Role_Guard bloqueia usuário comum em operações de escrita em /users**
    - **Valida: Requisito 3.4**
    - Arquivo: `server/__tests__/users.test.js`
    - Arbitrários: `fc.record({ id, nome, perfil: 'usuario' })` → JWT

  - [ ]* 3.4 Escrever testes unitários para rotas de usuários
    - `GET /users` sem token → HTTP 401
    - `POST /users` sem token → HTTP 401
    - `PUT /users/:id` com token de `usuario` → HTTP 403
    - Arquivo: `server/__tests__/users.test.js`
    - _Requisitos: 3.4, 3.5, 5.2_

- [ ] 4. Checkpoint — Verificar backend de autenticação e usuários
  - Garantir que todos os testes do servidor passem, tirar dúvidas com o usuário se necessário.

- [ ] 5. Backend — Proteger rotas de produtos com autenticação e ownership
  - [ ] 5.1 Adicionar função `getProductById` em `server/data/db.js`
    - Buscar documento por ID na coleção `products`
    - Retornar `null` se não existir
    - Arquivo: `server/data/db.js`
    - _Requisitos: 4.2, 4.6_

  - [ ] 5.2 Aplicar autenticação e associar `userId` em `POST /products`
    - Adicionar middleware `autenticar`
    - Incluir `userId: req.usuario.id` no objeto do produto antes de salvar no Firestore
    - Arquivo: `server/routes/products.js`
    - _Requisitos: 4.1_

  - [ ] 5.3 Aplicar autenticação e verificação de ownership em `PUT /products/:id` e `DELETE /products/:id`
    - Adicionar middleware `autenticar`
    - Buscar produto via `getProductById`; retornar HTTP 404 se não existir
    - Comparar `produto.userId` com `req.usuario.id`; retornar HTTP 403 com `"Você não tem permissão para modificar este produto"` se diferente
    - Executar atualização/exclusão somente se ownership confirmada
    - Arquivo: `server/routes/products.js`
    - _Requisitos: 4.2, 4.3, 4.4, 4.5, 4.6, 4.9_

  - [ ]* 5.4 Escrever teste de propriedade para associação de userId em POST /products
    - **Propriedade 5: Produto criado sempre recebe o userId do usuário autenticado**
    - **Valida: Requisito 4.1**
    - Arquivo: `server/__tests__/products.test.js`
    - Arbitrários: `fc.record({ id, nome, perfil })` + dados de produto válidos

  - [ ]* 5.5 Escrever teste de propriedade para verificação de ownership em PUT/DELETE /products
    - **Propriedade 6: Verificação de ownership em modificação de produtos**
    - **Valida: Requisitos 4.2, 4.3, 4.4, 4.5**
    - Arquivo: `server/__tests__/products.test.js`
    - Arbitrários: `fc.record({ userId })` + `fc.record({ id })` para simular pares produto/usuário

  - [ ]* 5.6 Escrever testes unitários para rotas de produtos
    - `GET /products` sem token → HTTP 200
    - `POST /products` sem token → HTTP 401
    - `PUT /products/:id` com produto inexistente → HTTP 404
    - `DELETE /products/:id` com produto de outro usuário → HTTP 403
    - Arquivo: `server/__tests__/products.test.js`
    - _Requisitos: 4.6, 4.9, 5.1_

- [ ] 6. Checkpoint — Verificar backend de produtos
  - Garantir que todos os testes do servidor passem, tirar dúvidas com o usuário se necessário.

- [ ] 7. Frontend — Criar AuthContext com persistência de sessão
  - [ ] 7.1 Criar arquivo `context/AuthContext.js` com estado e funções de autenticação
    - Definir estado: `{ token, usuario: {id, nome, perfil}, carregando }`
    - Implementar `login(email, senha)`: chama `POST /auth/login`, armazena token e dados no estado e no `AsyncStorage`
    - Implementar `logout()`: limpa estado e remove token do `AsyncStorage`
    - Implementar `registrar(dados)`: chama `POST /auth/register`
    - Implementar `useEffect` de inicialização: lê `AsyncStorage`, valida token via `jwt-decode`, restaura sessão ou limpa estado
    - Tratar erro de I/O no `AsyncStorage` com `try/catch`, registrar no console e apresentar tela de login
    - Nunca armazenar a senha do usuário no dispositivo
    - Arquivo: `context/AuthContext.js`
    - _Requisitos: 2.3, 2.6, 2.7, 2.8, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 7.2 Escrever teste de propriedade para restauração de sessão com token válido
    - **Propriedade 11: Restauração de sessão com token válido preserva dados do usuário**
    - **Valida: Requisito 6.2**
    - Arquivo: `__tests__/AuthContext.test.js`
    - Arbitrários: `fc.record({ id, nome, perfil })` → JWT válido (não expirado)

  - [ ]* 7.3 Escrever teste de propriedade para remoção de token inválido na inicialização
    - **Propriedade 12: Token inválido ou expirado é sempre removido na inicialização**
    - **Valida: Requisito 6.4**
    - Arquivo: `__tests__/AuthContext.test.js`
    - Arbitrários: `fc.string()` como token inválido

  - [ ]* 7.4 Escrever teste de propriedade para senha nunca no AsyncStorage
    - **Propriedade 10: Token nunca é armazenado com a senha do usuário**
    - **Valida: Requisito 6.6**
    - Arquivo: `__tests__/AuthContext.test.js`
    - Arbitrários: `fc.record({ ...dados, senha })` com qualquer senha

  - [ ]* 7.5 Escrever testes unitários para AuthContext
    - Logout limpa estado e AsyncStorage
    - AsyncStorage vazio na inicialização → estado não autenticado
    - Erro de I/O no AsyncStorage → estado não autenticado + log no console
    - Token expirado na inicialização → estado limpo
    - Arquivo: `__tests__/AuthContext.test.js`
    - _Requisitos: 2.6, 6.3, 6.4, 6.5_

- [ ] 8. Frontend — Criar telas de Login e Cadastro
  - [ ] 8.1 Criar tela `screens/LoginScreen.js`
    - Campos: email, senha
    - Botão de login que chama `login()` do AuthContext
    - Exibir mensagem de erro retornada pela API inline
    - Link/botão para navegar para a tela de cadastro
    - Arquivo: `screens/LoginScreen.js`
    - _Requisitos: 2.2, 2.4, 2.5_

  - [ ] 8.2 Criar tela `screens/RegisterScreen.js`
    - Campos: nome, email, senha, seletor de perfil (`"admin"` / `"usuario"`)
    - Validação inline sem chamar a API: nome não vazio, email válido, senha ≥ 8 chars, perfil selecionado
    - Exibir `"Email já cadastrado"` quando API retornar HTTP 409
    - Navegar para tela de login após cadastro bem-sucedido
    - Arquivo: `screens/RegisterScreen.js`
    - _Requisitos: 1.5, 1.6, 1.7, 1.8_

- [ ] 9. Frontend — Refatorar App.js com navegação condicional baseada em perfil
  - [ ] 9.1 Envolver o App com `AuthContext.Provider` e implementar navegação condicional
    - Renderizar `<SplashScreen />` (ou indicador de carregamento) enquanto `carregando === true`
    - Renderizar `<LoginScreen />` ou `<RegisterScreen />` quando `token === null`
    - Renderizar tela de usuários quando `usuario.perfil === 'admin'`
    - Renderizar tela de produtos quando `usuario.perfil === 'usuario'`
    - Renderizar lista de produtos (somente leitura) para visitante (sem token)
    - Arquivo: `App.js`
    - _Requisitos: 2.4, 2.7, 2.8, 5.3, 5.4, 5.5_

  - [ ] 9.2 Adicionar header `Authorization: Bearer <token>` em todas as chamadas fetch para rotas protegidas
    - Rotas protegidas: `POST /users`, `PUT /users/:id`, `DELETE /users/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
    - Tratar resposta HTTP 401 com token expirado: limpar estado via `logout()`, exibir `"Sessão expirada. Faça login novamente"` e navegar para login
    - Arquivo: `App.js`
    - _Requisitos: 2.8, 3.9_

  - [ ]* 9.3 Escrever teste de propriedade para header Authorization em requisições protegidas
    - **Propriedade 9: Auth_Context sempre inclui o token no header de requisições protegidas**
    - **Valida: Requisito 3.9**
    - Arquivo: `__tests__/App.test.js`
    - Arbitrários: `fc.string()` como token

  - [ ]* 9.4 Escrever testes unitários para navegação
    - Login com perfil `admin` → renderiza tela de usuários
    - Login com perfil `usuario` → renderiza tela de produtos
    - Logout → renderiza tela de login
    - Token expirado em requisição → exibe mensagem e navega para login
    - Arquivo: `__tests__/App.test.js`
    - _Requisitos: 2.4, 2.7, 2.8_

- [ ] 10. Frontend — Adaptar componentes existentes para controle de acesso por perfil
  - [ ] 10.1 Modificar `CardUser` para receber e respeitar prop `podeEditar`
    - Adicionar prop `podeEditar: boolean`
    - Exibir botões de editar e excluir somente quando `podeEditar === true`
    - Arquivo: `components/users/cardUser.js`
    - _Requisitos: 3.7, 3.8_

  - [ ] 10.2 Modificar `CardProduct` para receber e respeitar prop `ehProprietario`
    - Adicionar prop `ehProprietario: boolean`
    - Exibir botões de editar e excluir somente quando `ehProprietario === true`
    - Arquivo: `components/products/cardProduct.js`
    - _Requisitos: 4.7, 4.8, 5.3_

  - [ ] 10.3 Modificar `CreateUsers` para ocultar formulário quando perfil não é `admin`
    - Adicionar prop `podeGerenciar: boolean`
    - Retornar `null` ou ocultar o formulário quando `podeGerenciar === false`
    - Arquivo: `components/users/createUsers.js`
    - _Requisitos: 3.8_

  - [ ] 10.4 Passar props de controle de acesso nos pontos de uso em `App.js`
    - `CardUser`: passar `podeEditar={usuario?.perfil === 'admin'}`
    - `CardProduct`: passar `ehProprietario={item.userId === usuario?.id}`
    - `CreateUsers`: passar `podeGerenciar={usuario?.perfil === 'admin'}`
    - Exibir botão `"Entrar"` na lista de produtos quando visitante (sem token)
    - Arquivo: `App.js`
    - _Requisitos: 3.7, 3.8, 4.7, 4.8, 5.3, 5.4_

  - [ ]* 10.5 Escrever teste de propriedade para botões de ação por ownership em CardProduct
    - **Propriedade 7: Botões de ação em produtos aparecem apenas nos produtos próprios do usuário**
    - **Valida: Requisitos 4.7, 4.8**
    - Arquivo: `__tests__/CardProduct.test.js`
    - Arbitrários: `fc.array(produto)` + `fc.string()` como userId do usuário autenticado

  - [ ]* 10.6 Escrever testes unitários para componentes adaptados
    - `CardUser` com `podeEditar=false` → botões ocultos
    - `CardUser` com `podeEditar=true` → botões visíveis
    - `CardProduct` com `ehProprietario=false` → botões ocultos
    - `CreateUsers` com `podeGerenciar=false` → formulário oculto
    - Arquivo: `__tests__/CardProduct.test.js`, `__tests__/App.test.js`
    - _Requisitos: 3.7, 3.8, 4.7, 4.8_

- [ ] 11. Checkpoint — Verificar frontend completo
  - Garantir que todos os testes do frontend passem, tirar dúvidas com o usuário se necessário.

- [ ] 12. Integração final — Conectar frontend e backend
  - [ ] 12.1 Instalar `jwt-decode` e `@react-native-async-storage/async-storage` no frontend
    - `npm install jwt-decode @react-native-async-storage/async-storage`
    - Verificar compatibilidade com Expo SDK 55
    - Arquivo: `package.json`
    - _Requisitos: 6.1, 6.2, 6.4_

  - [ ] 12.2 Tratar erro de rede em `GET /products` na tela de lista de produtos
    - Exibir mensagem de erro ao usuário quando a chamada falha com erro de rede ou status diferente de 200
    - Arquivo: `App.js` (ou componente de lista de produtos)
    - _Requisitos: 5.6_

  - [ ]* 12.3 Escrever testes de integração para fluxo completo de autenticação
    - Cadastro → login → acesso a rota protegida → logout
    - Arquivo: `__tests__/App.test.js`
    - _Requisitos: 1.8, 2.3, 2.4, 2.6, 2.7_

- [ ] 13. Checkpoint final — Garantir que todos os testes passem
  - Executar todos os testes do servidor (`cd server && npm test`) e do frontend (`npm test`)
  - Garantir que todos os testes passem, tirar dúvidas com o usuário se necessário.

---

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental a cada fase
- Os testes de propriedade validam invariantes universais com `fast-check` (mínimo 100 iterações)
- Os testes unitários validam exemplos específicos e casos de borda
- O backend usa JavaScript (Node.js/Express); o frontend usa JavaScript (React Native/Expo)
- A navegação é implementada via renderização condicional em `App.js`, sem React Navigation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "5.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "5.2", "5.3", "7.1"] },
    { "id": 4, "tasks": ["5.4", "5.5", "5.6", "7.2", "7.3", "7.4", "7.5", "8.1", "8.2"] },
    { "id": 5, "tasks": ["9.1", "10.1", "10.2", "10.3"] },
    { "id": 6, "tasks": ["9.2", "9.3", "9.4", "10.4"] },
    { "id": 7, "tasks": ["10.5", "10.6", "12.1"] },
    { "id": 8, "tasks": ["12.2", "12.3"] }
  ]
}
```
