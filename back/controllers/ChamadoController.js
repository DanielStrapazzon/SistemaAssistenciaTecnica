import Chamado from "../models/Chamado.js";

//Regras de Negócios

async function listar (req, res) {
  const dados = await Chamado.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const idchamado = req.params.id;
  const dados = await Chamado.findByPk(idchamado);
  return res.json(dados);
}

async function excluir (req, res) {
  const idchamado = req.params.id;
  const dados = await Chamado.destroy({ where: { idchamado: idchamado } });
  return res.json(dados);
}

async function inserir (req, res) {
  const cliente = req.body.cliente;
  const descricao = req.body.descricao;
  const data_abertura = req.body.data_abertura;
  const data_conclusao = req.body.data_conclusao;
  const idtiposervico = req.body.idtiposervico;
  const tempo_horas = req.body.tempo_horas;
  const valor_total = req.body.valor_total;
  const status = req.body.status;

  const dados = await Chamado.create({ 
    cliente: cliente,
    descricao: descricao,
    data_abertura: data_abertura,
    data_conclusao: data_conclusao,
    idtiposervico: idtiposervico,
    tempo_horas: tempo_horas,
    valor_total: valor_total,
    status: status
  });

  return res.json(dados);
}

async function alterar(req, res) {
  const idchamado = req.params.id;
  const cliente = req.body.cliente;
  const descricao = req.body.descricao;
  const data_abertura = req.body.data_abertura;
  const data_conclusao = req.body.data_conclusao;
  const idtiposervico = req.body.idtiposervico;
  const tempo_horas = req.body.tempo_horas;
  const valor_total = req.body.valor_total;
  const status = req.body.status;

  const dados = await Chamado.update({ 
    cliente: cliente,
    descricao: descricao,
    data_abertura: data_abertura,
    data_conclusao: data_conclusao,
    idtiposervico: idtiposervico,
    tempo_horas: tempo_horas,
    valor_total: valor_total,
    status: status
  }, 
  {
    where: { idchamado: idchamado }
  });

  return res.json(dados);
}

export default { listar, selecionar, excluir, inserir, alterar };