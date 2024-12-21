# Sistema de Gerenciamento de Concessionária (API REST)

Este é um projeto de uma API REST para gerenciar usuários e veículos de uma concessionária. A API permite o cadastro de usuários (admin e comuns), login, e manipulação de dados de veículos (cadastro, atualização, exclusão e listagem). A aplicação foi construída com **Node.js** e **Express**.

## Tecnologias Usadas

- **Node.js**: JavaScript no servidor.
- **Express**: Framework para criar a API REST.
- **JWT (JSON Web Token)**: Para autenticação de usuários e controle de permissões.
- **Bcrypt.js**: Para criptografar as senhas de usuários.
- **FS (File System)**: Para simular o banco de dados com arquivos JSON.

## Funcionalidades

### Usuários

- Cadastro de usuários (`POST /usuarios/cadastro`).
- Login de usuários (`POST /usuarios/login`).
- Alteração de dados pessoais (`PUT /usuarios`).
- Exclusão de usuários (`DELETE /usuarios/:id`).

### Veículos

- Listagem de veículos com paginação (`GET /veiculos`).
- Cadastro de veículos (`POST /veiculos/cadastro`).
- Atualização de dados de veículos (`PUT /veiculos/:id`).
- Exclusão de veículos (`DELETE /veiculos/:id`).

## Instalação

### 1. Clone o repositório:

```bash
git clone <url-do-repositorio>
```
