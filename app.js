require('dotenv').config(); 
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const usuarioRoutes = require('./routes/usuarioRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const fs = require('fs');
const { salvarUsuarios } = require('./db/usuarios');
const { salvarVeiculos } = require('./db/veiculos');

// Middleware para tratamento de JSON
app.use(express.json());

// Rota para exibir a documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para criação do usuário administrador
app.get('/install', (req, res) => {
  const usuarioAdmin = {
    id: "1",
    nome: "Administrador",
    usuario: "admin",
    senha: "admin123",
    role: "admin"
  };

  // Verificar se o arquivo de usuários existe
  const usuariosDb = require('./db/usuarios.json');

  // Verificar se já existe um administrador
  const adminExistente = usuariosDb.some(usuario => usuario.role === 'admin');

  if (!adminExistente) {
    // Adicionar o usuário administrador ao banco de dados
    usuariosDb.push(usuarioAdmin);
    fs.writeFileSync('./db/usuarios.json', JSON.stringify(usuariosDb, null, 2));
    return res.status(201).json({ message: 'Usuário administrador criado com sucesso.' });
  }

  return res.status(400).json({ message: 'Usuário administrador já existe.' });
});

// Usar as rotas para usuários e veículos
app.use('/usuarios', usuarioRoutes);
app.use('/veiculos', veiculoRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const jwt = require('jsonwebtoken');

// Usando a variável de ambiente JWT_SECRET
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log(token);
