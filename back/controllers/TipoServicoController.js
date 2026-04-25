import TipoServico from "../models/TipoServico.js";

//Regras de Negócios

async function listar (req, res) {
  try {
    const dados = await TipoServico.findAll();
    return res.json(dados);
  } catch (error) {
    console.error("ERRO NO TIPOSERVICO:", error);
    return res.status(500).json({
      erro: error.message
    });
  }
}

async function selecionar (req, res) {
  const idtiposervico = req.params.id;
  const dados = await TipoServico.findByPk(idtiposervico);
  return res.json(dados);
}

async function excluir (req, res) {
  const idtiposervico = req.params.id;
  const dados = await TipoServico.destroy({ where: { idtiposervico: idtiposervico } });
  return res.json(dados);
}

async function inserir (req, res) {
  const descricao = req.body.descricao;
  const tipo_cobranca = req.body.tipo_cobranca;
  const valor = req.body.valor;

  const dados = await TipoServico.create({ 
    descricao: descricao,
    tipo_cobranca: tipo_cobranca,
    valor: valor
  });

  return res.json(dados);
}

async function alterar(req, res) {
  const idtiposervico = req.params.id;
  const descricao = req.body.descricao;
  const tipo_cobranca = req.body.tipo_cobranca;
  const valor = req.body.valor;

  const dados = await TipoServico.update({ 
    descricao: descricao, 
    tipo_cobranca: tipo_cobranca, 
    valor: valor 
  }, 
  {
    where: { idtiposervico: idtiposervico }
  });

  return res.json(dados);
}

export default { listar, selecionar, excluir, inserir, alterar };