import Chamado from "../models/Chamado.js";

import { QueryTypes } from "sequelize";
import banco from "../Banco.js";

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

async function relatorio(req, res) {
  try {
    let { inicio, fim } = req.query;

    let where = "";
    let replacements = {};

    if (inicio && fim) {
      inicio = inicio + " 00:00:00";
      fim = fim + " 23:59:59";

      where = "WHERE c.data_abertura BETWEEN :inicio AND :fim";
      replacements = { inicio, fim };
    }

    const dados = await banco.query(`
      SELECT 
        c.idchamado,
        c.cliente,
        c.descricao,
        c.data_abertura,
        c.data_conclusao,
        c.tempo_horas,
        c.valor_total,
        t.descricao AS tipo_servico
      FROM chamado c
      JOIN tipo_servico t 
        ON t.idtiposervico = c.idtiposervico
      ${where}
      ORDER BY c.data_abertura DESC
    `, { replacements });

    return res.json(dados[0]);

  } catch (error) {
    console.error("ERRO RELATORIO:", error);
    return res.status(500).json({ erro: error.message });
  }
}

export default { listar, selecionar, excluir, inserir, alterar, relatorio };