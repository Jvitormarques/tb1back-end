const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticar = require('../middlewares/autenticar');

// Rota para cadastro de usuário
router.post('/cadastro', usuarioController.cadastrarUsuario);

// Rota para login do usuário
router.post('/login', usuarioController.loginUsuario);

// Rota para criação de administrador (somente para admins)
router.post('/criar-admin', autenticar.admin, usuarioController.criarAdministrador);

// Rota para alteração dos dados do usuário (somente para o próprio usuário ou admin)
router.put('/alterar-dados', autenticar.usuario, usuarioController.alterarDados);

// Rota para excluir usuário (somente admins podem excluir usuários não admin)
router.delete('/excluir/:id', autenticar.admin, usuarioController.excluirUsuario);

module.exports = router;
