const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const autenticar = require('../middlewares/autenticar');

// Rota para listar veículos com paginação
router.get('/', veiculoController.listarVeiculos);

// Rota para cadastrar um veículo
router.post('/cadastro', autenticar.usuario, veiculoController.cadastrarVeiculo); // Altere a rota aqui

// Rota para atualizar um veículo
router.put('/:id', autenticar.usuario, veiculoController.atualizarVeiculo);

// Rota para deletar um veículo
router.delete('/:id', autenticar.usuario, veiculoController.deletarVeiculo);

module.exports = router;
