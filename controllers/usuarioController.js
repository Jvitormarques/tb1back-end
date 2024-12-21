const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = './db/usuarios.json';

// Carregar os usuários do arquivo JSON
const usuariosDb = JSON.parse(fs.readFileSync(path, 'utf8'));

// Função para salvar os usuários no arquivo JSON
const salvarUsuarios = () => {
    fs.writeFileSync(path, JSON.stringify(usuariosDb, null, 2));
};

// Cadastrar Usuário
exports.cadastrarUsuario = (req, res) => {
    const { nome, usuario, senha } = req.body;

    if (usuariosDb.find(u => u.usuario === usuario)) {
        return res.status(400).json({ mensagem: 'Usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(senha, 8);

    const novoUsuario = {
        id: usuariosDb.length + 1,
        nome,
        usuario,
        senha: hashedPassword,
        tipo: 'usuario',
    };

    usuariosDb.push(novoUsuario);
    salvarUsuarios();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
};

// Criar Administrador
exports.criarAdministrador = (req, res) => {
    const { nome, usuario, senha } = req.body;

    if (usuariosDb.find(u => u.usuario === usuario)) {
        return res.status(400).json({ mensagem: 'Usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(senha, 8);

    const novoAdmin = {
        id: usuariosDb.length + 1,
        nome,
        usuario,
        senha: hashedPassword,
        tipo: 'admin',
    };

    usuariosDb.push(novoAdmin);
    salvarUsuarios();

    res.status(201).json({ mensagem: 'Administrador criado com sucesso' });
};

// Login de Usuário
exports.loginUsuario = (req, res) => {
    const { usuario, senha } = req.body;

    const usuarioExistente = usuariosDb.find(u => u.usuario === usuario);

    if (!usuarioExistente || !bcrypt.compareSync(senha, usuarioExistente.senha)) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuarioExistente.id, tipo: usuarioExistente.tipo }, 'segredo', { expiresIn: '1h' });

    res.json({ token });
};

// Alterar Dados do Usuário
exports.alterarDados = (req, res) => {
    const { id } = req.user;
    const { nome, usuario } = req.body;

    const usuarioExistente = usuariosDb.find(u => u.id === id);

    if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    usuarioExistente.nome = nome || usuarioExistente.nome;
    usuarioExistente.usuario = usuario || usuarioExistente.usuario;

    salvarUsuarios();

    res.json({ mensagem: 'Dados alterados com sucesso' });
};

// Excluir Usuário
exports.excluirUsuario = (req, res) => {
    const { id } = req.params;

    const index = usuariosDb.findIndex(u => u.id === parseInt(id) && u.tipo !== 'admin');
    
    if (index === -1) {
        return res.status(400).json({ mensagem: 'Usuário não encontrado ou tentativa de excluir um admin' });
    }

    usuariosDb.splice(index, 1);
    salvarUsuarios();

    res.json({ mensagem: 'Usuário excluído com sucesso' });
};
