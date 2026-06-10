# Flui Admin

Painel administrativo da Flui (plataforma de pontos de recarga de carro elétrico). O projeto também tem a API que o app mobile usa (o app fica em outro repositório).

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind v4
- better-sqlite3 (SQLite)

## Como rodar

Precisa do Node 20+.

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. O banco é criado em `data/flui.sqlite` na primeira vez. Pra resetar, apaga o arquivo.

## Usuários de teste

- `admin` / `admin` (admin, precisa trocar a senha no primeiro login)
- `ana` / `ana123` (motorista)
- `carlos` / `carlos123` (motorista)
- `mariana` / `mariana123` (motorista)

## Pastas

```
app/
  api/           rotas da API
  components/    componentes
  login/         tela de login
  trocar-senha/  tela de troca de senha
  pontos/        listagem, cadastro e edição
  avaliacoes/    listagem de avaliações
lib/
  api.ts         função pra chamar a API com token
  auth.ts        helpers de auth no servidor
  db.ts          inicialização do SQLite
data/            banco (fora do git)
```

## Banco

São 4 tabelas:

- **usuarios**: id, usuario, senha_hash, precisa_trocar_senha, tipo, nome_completo, email, veiculo_modelo, veiculo_placa
- **tokens**: token, usuario_id, criado_em
- **pontos**: id, nome, endereco, cidade, uf, conector, potencia, preco, latitude, longitude, disponivel
- **avaliacoes**: id, ponto_id, motorista, nota, comentario

O schema e os dados iniciais ficam em `lib/db.ts`.

## API

Todas as rotas pedem o header `Authorization: Bearer <token>`, menos `POST /api/login`. Sem token ou token inválido responde 401.

### Auth

- `POST /api/login` body `{ usuario, senha }`. Retorna `{ token, usuario }`.
- `POST /api/logout` apaga o token do banco.
- `POST /api/trocar-senha` body `{ senha_nova }`. Atualiza a senha.
- `GET /api/me` retorna os dados do usuário do token.
- `PUT /api/me` atualiza perfil (`nome_completo`, `email`, `veiculo_modelo`, `veiculo_placa`). Body parcial, mantém os campos que não vierem.

### Pontos

- `GET /api/pontos` lista todos.
- `POST /api/pontos` body com todos os campos. `disponivel` é opcional (default true).
- `GET /api/pontos/[id]` busca um.
- `PUT /api/pontos/[id]` atualiza. `disponivel` opcional (mantém o que tá no banco se não vier).
- `DELETE /api/pontos/[id]` apaga (avaliações vinculadas vão junto por cascade).

### Avaliações

- `GET /api/avaliacoes` lista, com JOIN trazendo `ponto_nome`. Aceita `?ponto_id=<id>` pra filtrar.
- `POST /api/avaliacoes` body `{ ponto_id, nota, comentario }`. `nota` é inteiro de 1 a 5. O campo `motorista` é preenchido com o usuário do token.

## Arquitetura

O Next serve as páginas do painel e a API. O painel e o app mobile consomem a mesma API.

Autenticação por token:

1. Login devolve um token aleatório que fica salvo em `tokens`.
2. Cliente guarda no `localStorage` e manda em `Authorization: Bearer ...`.
3. O helper `usuarioDoToken` (em `lib/auth.ts`) faz JOIN entre `tokens` e `usuarios` pra saber quem é.
4. Logout apaga o token do banco.

A senha é hasheada com SHA-256.

No painel:

- `AuthGuard` no `layout.tsx` redireciona pra `/login` se não tiver token.
- `Header` esconde nas telas de login e troca de senha.
- `lib/api.ts` tem o `fetch` com token. Se vier 401, limpa o token e manda pra `/login`.
