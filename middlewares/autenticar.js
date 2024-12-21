const jwt = require('jsonwebtoken');
const { usuariosDb } = require('../db/usuarios');  // Lembre-se de ajustar o caminho para o arquivo correto

// Middleware para verificar o token e definir o usuário no request
const autenticar = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, 'segredo');
        req.user = decoded; // Adiciona as informações do usuário no request
        next();
    } catch (e) {
        res.status(401).json({ mensagem: 'Token inválido' });
    }
};

// Middleware para permitir apenas admins
autenticar.admin = (req, res, next) => {
    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ mensagem: 'Acesso negado: somente administradores' });
    }
    next();
};

// Middleware para permitir apenas o próprio usuário ou admin
autenticar.usuario = (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id) && req.user.tipo !== 'admin') {
        return res.status(403).json({ mensagem: 'Acesso negado: você só pode alterar seus próprios dados ou ser um admin' });
    }
    next();
};

module.exports = autenticar;
