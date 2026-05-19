# Documento de Requisitos

## Introdução

Esta feature adiciona autenticação com controle de acesso baseado em perfil (RBAC) ao aplicativo mobile React Native (Expo) com backend Node.js e Firebase. O sistema define três níveis de acesso: **Administrador** (gerencia usuários), **Usuário Comum** (autenticado, gerencia seus próprios produtos) e **Visitante** (não autenticado, somente leitura de produtos). O backend já possui infraestrutura parcial: rotas de autenticação com JWT/bcrypt (`/auth`), middleware `autenticar` e `autorizar` em `protect.js`, e coleções Firestore separadas para `auth_users`, `users` e `products`. Esta feature conecta essa infraestrutura ao frontend e aplica as regras de acesso em todas as rotas.

---

## Glossário

- **App**: O aplicativo React Native (Expo) executado no dispositivo do usuário.
- **API**: O servidor Node.js/Express em `server/`, acessível em `http://localhost:3000`.
- **Auth_Service**: O módulo de autenticação da API, responsável por registro e login (`/auth`).
- **Auth_Guard**: O middleware `autenticar` em `protect.js`, responsável por validar tokens JWT.
- **Role_Guard**: O middleware `autorizar` em `protect.js`, responsável por verificar o perfil do usuário.
- **Auth_Context**: O contexto React no App que armazena o estado de autenticação e o perfil do usuário logado.
- **Token**: O JSON Web Token (JWT) emitido pelo Auth_Service após login bem-sucedido.
- **Perfil**: O tipo de acesso do usuário. Valores válidos: `admin` ou `usuario`.
- **Visitante**: Usuário que acessa o App sem estar autenticado (sem Token válido).
- **Usuário Comum**: Usuário autenticado com `perfil = "usuario"`.
- **Administrador**: Usuário autenticado com `perfil = "admin"`.
- **Produto_Próprio**: Produto cujo campo `userId` corresponde ao `id` do usuário autenticado que o criou.

---

## Requisitos

### Requisito 1: Cadastro de Usuário com Perfil

**User Story:** Como visitante, quero me cadastrar no sistema informando meu nome, email, senha e tipo de perfil, para que eu possa acessar as funcionalidades correspondentes ao meu nível de acesso.

#### Critérios de Aceitação

1. WHEN o visitante submete o formulário de cadastro com nome não vazio (máximo 100 caracteres), email em formato válido, senha com no mínimo 8 caracteres e perfil igual a `"admin"` ou `"usuario"`, THE Auth_Service SHALL criar um registro na coleção `auth_users` do Firestore com a senha criptografada via bcrypt e retornar HTTP 201.
2. WHEN o visitante submete o formulário de cadastro com um email já existente na coleção `auth_users`, THE Auth_Service SHALL retornar HTTP 409 com a mensagem `"Email já cadastrado"`.
3. WHEN o visitante submete o formulário de cadastro com o campo `perfil` ausente ou com valor diferente de `"admin"` ou `"usuario"`, THE Auth_Service SHALL retornar HTTP 400 com a mensagem `"Perfil inválido. Use 'admin' ou 'usuario'"`.
4. WHEN o visitante submete o formulário de cadastro com nome vazio, email em formato inválido ou senha com menos de 8 caracteres, THE Auth_Service SHALL retornar HTTP 400 com mensagem descrevendo o campo inválido.
5. THE App SHALL exibir uma tela de cadastro com campos para nome, email, senha e um seletor de perfil com as opções `"admin"` e `"usuario"`.
6. WHEN o usuário submete o formulário de cadastro no App com nome, email, senha ou perfil em branco ou inválidos, THE App SHALL exibir mensagens de erro inline em cada campo inválido sem realizar chamada à API.
7. WHEN a API retorna HTTP 409, THE App SHALL exibir a mensagem `"Email já cadastrado"` na tela de cadastro sem navegar para outra tela.
8. WHEN o cadastro é concluído com sucesso, THE App SHALL navegar automaticamente para a tela de login.

---

### Requisito 2: Autenticação e Emissão de Token

**User Story:** Como usuário cadastrado, quero fazer login com meu email e senha, para que o sistema reconheça meu perfil e me conceda acesso às funcionalidades correspondentes.

#### Critérios de Aceitação

1. WHEN o usuário submete o formulário de login com email e senha corretos, THE Auth_Service SHALL retornar HTTP 200 com um Token JWT contendo os campos `id`, `nome` e `perfil` no payload.
2. WHEN o usuário submete o formulário de login com email inexistente ou senha incorreta, THE Auth_Service SHALL retornar HTTP 401 com a mensagem `"Usuário ou senha inválidos"`.
3. WHEN o login é realizado com sucesso, THE Auth_Context SHALL armazenar o Token e os dados do usuário (`id`, `nome`, `perfil`) no estado global do App.
4. WHEN o login é realizado com sucesso e o `perfil` do usuário é `"admin"`, THE App SHALL navegar para a tela de lista de usuários. WHEN o `perfil` é `"usuario"`, THE App SHALL navegar para a tela de lista de produtos.
5. WHEN a API retorna um status diferente de HTTP 200 durante o login, THE App SHALL exibir a mensagem de erro retornada pela API na tela de login sem navegar para outra tela.
6. WHEN o usuário aciona o elemento de UI de logout, THE Auth_Context SHALL remover o Token e os dados do usuário do estado global.
7. WHEN o Auth_Context remove o Token e os dados do usuário do estado global, THE App SHALL navegar para a tela de login.
8. WHILE o Token armazenado está expirado e WHEN o usuário tenta realizar uma requisição a uma rota protegida, THE App SHALL remover o Token do estado, exibir a mensagem `"Sessão expirada. Faça login novamente"` e navegar para a tela de login.

---

### Requisito 3: Controle de Acesso do Administrador

**User Story:** Como Administrador, quero ser o único perfil capaz de criar, editar e excluir usuários, para que o gerenciamento de contas seja centralizado e seguro.

#### Critérios de Aceitação

1. WHEN uma requisição autenticada com `perfil = "admin"` é recebida na rota `POST /users`, THE Role_Guard SHALL permitir o acesso e THE API SHALL retornar HTTP 201.
2. WHEN uma requisição autenticada com `perfil = "admin"` é recebida na rota `PUT /users/:id`, THE Role_Guard SHALL permitir o acesso e THE API SHALL retornar HTTP 200.
3. WHEN uma requisição autenticada com `perfil = "admin"` é recebida na rota `DELETE /users/:id`, THE Role_Guard SHALL permitir o acesso e THE API SHALL retornar HTTP 200.
4. WHEN uma requisição autenticada com `perfil = "usuario"` é recebida nas rotas `POST /users`, `PUT /users/:id` ou `DELETE /users/:id`, THE Role_Guard SHALL retornar HTTP 403 com a mensagem `"Acesso negado"`.
5. IF uma requisição é recebida nas rotas `POST /users`, `PUT /users/:id` ou `DELETE /users/:id` sem o header `Authorization`, THEN THE Auth_Guard SHALL retornar HTTP 401 com a mensagem `"Token não informado"`.
6. IF uma requisição é recebida nas rotas `POST /users`, `PUT /users/:id` ou `DELETE /users/:id` com um Token inválido ou expirado, THEN THE Auth_Guard SHALL retornar HTTP 401 com a mensagem `"Token inválido ou expirado"`.
7. WHILE o usuário autenticado possui `perfil = "admin"`, THE App SHALL exibir os botões de editar e excluir em cada card de usuário na lista de usuários.
8. WHILE o usuário autenticado possui `perfil = "usuario"`, THE App SHALL ocultar os botões de editar e excluir nos cards de usuário e ocultar o formulário de criação de usuário.
9. THE App SHALL incluir o Token no header `Authorization: Bearer <token>` em todas as requisições para as rotas `POST /users`, `PUT /users/:id` e `DELETE /users/:id`.

---

### Requisito 4: Controle de Acesso do Usuário Comum sobre Produtos

**User Story:** Como Usuário Comum, quero poder cadastrar meus próprios produtos e editá-los ou excluí-los, mas sem poder modificar produtos de outros usuários, para que cada usuário gerencie apenas seu próprio catálogo.

#### Critérios de Aceitação

1. WHEN uma requisição autenticada com Token válido é recebida na rota `POST /products`, THE Auth_Guard SHALL permitir o acesso, e THE API SHALL associar o produto ao `id` do usuário autenticado, armazenando o campo `userId` no documento do produto no Firestore, retornando HTTP 201.
2. WHEN uma requisição autenticada com Token válido é recebida na rota `PUT /products/:id` ou `DELETE /products/:id`, THE API SHALL verificar se o `userId` do produto corresponde ao `id` do usuário autenticado no Token.
3. WHEN o `userId` do produto não corresponde ao `id` do usuário autenticado, THE API SHALL retornar HTTP 403 com a mensagem `"Você não tem permissão para modificar este produto"`.
4. WHEN o `userId` do produto corresponde ao `id` do usuário autenticado e a rota é `PUT /products/:id`, THE API SHALL executar a atualização e retornar HTTP 200.
5. WHEN o `userId` do produto corresponde ao `id` do usuário autenticado e a rota é `DELETE /products/:id`, THE API SHALL executar a exclusão e retornar HTTP 200.
6. WHEN uma requisição autenticada é recebida na rota `PUT /products/:id` ou `DELETE /products/:id` e o produto não existe no Firestore, THE API SHALL retornar HTTP 404 com a mensagem `"Produto não encontrado"`.
7. WHILE o usuário autenticado visualiza a lista de produtos, THE App SHALL exibir os botões de editar e excluir somente nos cards de Produto_Próprio do usuário.
8. WHILE o usuário autenticado visualiza a lista de produtos, THE App SHALL ocultar os botões de editar e excluir nos cards de produtos pertencentes a outros usuários.
9. IF uma requisição é recebida nas rotas `POST /products`, `PUT /products/:id` ou `DELETE /products/:id` sem Token válido, THEN THE Auth_Guard SHALL retornar HTTP 401 com a mensagem `"Token não informado"` ou `"Token inválido ou expirado"`.

---

### Requisito 5: Acesso do Visitante (Somente Leitura)

**User Story:** Como visitante, quero poder visualizar a lista de produtos sem precisar me autenticar, para que eu possa explorar o catálogo antes de decidir criar uma conta.

#### Critérios de Aceitação

1. WHEN uma requisição é recebida na rota `GET /products` sem Token, THE API SHALL retornar HTTP 200 com a lista completa de produtos.
2. WHEN uma requisição é recebida na rota `GET /users` sem Token válido, THE Auth_Guard SHALL retornar HTTP 401 com a mensagem `"Token não informado"`.
3. WHILE o usuário não está autenticado, THE App SHALL exibir a lista de produtos sem os botões de editar, excluir ou criar produto.
4. WHILE o usuário não está autenticado, THE App SHALL exibir um botão ou link `"Entrar"` na tela de lista de produtos que navega para a tela de login.
5. WHILE o usuário não está autenticado, THE App SHALL ocultar completamente a aba ou seção de gerenciamento de usuários.
6. WHEN a chamada `GET /products` falha com erro de rede ou status HTTP diferente de 200, THE App SHALL exibir uma mensagem de erro ao usuário na tela de lista de produtos.

---

### Requisito 6: Persistência e Segurança do Token

**User Story:** Como usuário autenticado, quero que minha sessão seja mantida ao fechar e reabrir o aplicativo, para que eu não precise fazer login toda vez.

#### Critérios de Aceitação

1. WHEN o login é realizado com sucesso, THE Auth_Context SHALL persistir o Token no armazenamento local do dispositivo usando `AsyncStorage`.
2. WHEN o App é iniciado e existe um Token válido no `AsyncStorage`, THE Auth_Context SHALL restaurar o estado de autenticação com os dados do usuário sem exigir novo login.
3. WHEN o App é iniciado e não existe Token no `AsyncStorage`, THE Auth_Context SHALL apresentar a tela de login ao usuário.
4. WHEN o App é iniciado e o Token encontrado no `AsyncStorage` está expirado ou é inválido (falha na verificação jwt.verify()), THE Auth_Context SHALL remover o Token do `AsyncStorage` e apresentar a tela de login ao usuário.
5. WHEN a leitura do `AsyncStorage` falha com erro de I/O durante a inicialização do App, THE Auth_Context SHALL tratar o erro, apresentar a tela de login ao usuário e registrar o erro no console.
6. THE Auth_Context SHALL nunca armazenar a senha do usuário no dispositivo.
