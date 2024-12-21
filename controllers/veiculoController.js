const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de dados dos veículos
const veiculosFilePath = path.join(__dirname, '../db/veiculos.json');

// Função para ler os dados dos veículos
const lerVeiculos = () => {
  try {
    const veiculosData = fs.readFileSync(veiculosFilePath, 'utf8');
    return JSON.parse(veiculosData);
  } catch (err) {
    console.error('Erro ao ler os dados dos veículos:', err);
    return [];
  }
};

// Função para salvar os dados dos veículos
const salvarVeiculos = (veiculos) => {
  try {
    fs.writeFileSync(veiculosFilePath, JSON.stringify(veiculos, null, 2));
  } catch (err) {
    console.error('Erro ao salvar os dados dos veículos:', err);
  }
};

// Rota para listar veículos com paginação
exports.listarVeiculos = (req, res) => {
  let { limite = 5, pagina = 1 } = req.query;

  // Garantir que o limite seja um valor válido
  const limitesPermitidos = [5, 10, 30];
  limite = limitesPermitidos.includes(parseInt(limite)) ? parseInt(limite) : 5;
  pagina = parseInt(pagina);

  // Ler veículos do arquivo
  const veiculosDb = lerVeiculos();

  // Paginação
  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  // Subconjunto de veículos paginados
  const veiculos = veiculosDb.slice(inicio, fim);

  // Resposta com total de veículos e dados paginados
  res.json({
    veiculos,
    pagina,
    limite,
    total: veiculosDb.length,
    totalPaginas: Math.ceil(veiculosDb.length / limite),
  });
};

// Rota para cadastrar um veículo
exports.cadastrarVeiculo = (req, res) => {
  const { modelo, marca, ano, preco } = req.body;

  // Validação para garantir que todos os campos obrigatórios estejam presentes
  if (!modelo || !marca || !ano || !preco) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  // Ler veículos do arquivo
  const veiculosDb = lerVeiculos();

  // Criar um novo veículo
  const novoVeiculo = {
    id: veiculosDb.length + 1,
    modelo,
    marca,
    ano,
    preco,
  };

  // Adicionar o novo veículo ao banco de dados
  veiculosDb.push(novoVeiculo);
  salvarVeiculos(veiculosDb);

  res.status(201).json({ mensagem: 'Veículo cadastrado com sucesso', veiculo: novoVeiculo });
};

// Rota para atualizar um veículo
exports.atualizarVeiculo = (req, res) => {
  const { id } = req.params;
  const { modelo, marca, ano, preco } = req.body;

  // Ler veículos do arquivo
  const veiculosDb = lerVeiculos();

  // Encontrar o veículo a ser atualizado
  const veiculoExistente = veiculosDb.find(v => v.id === parseInt(id));

  if (!veiculoExistente) {
    return res.status(404).json({ mensagem: 'Veículo não encontrado' });
  }

  // Atualizar os campos do veículo
  veiculoExistente.modelo = modelo || veiculoExistente.modelo;
  veiculoExistente.marca = marca || veiculoExistente.marca;
  veiculoExistente.ano = ano || veiculoExistente.ano;
  veiculoExistente.preco = preco || veiculoExistente.preco;

  // Salvar as alterações no arquivo
  salvarVeiculos(veiculosDb);

  res.json({ mensagem: 'Veículo atualizado com sucesso' });
};

// Rota para deletar um veículo
exports.deletarVeiculo = (req, res) => {
  const { id } = req.params;

  // Ler veículos do arquivo
  const veiculosDb = lerVeiculos();

  // Encontrar o índice do veículo a ser deletado
  const index = veiculosDb.findIndex(v => v.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Veículo não encontrado' });
  }

  // Deletar o veículo
  veiculosDb.splice(index, 1);
  salvarVeiculos(veiculosDb);

  res.json({ mensagem: 'Veículo excluído com sucesso' });
};
