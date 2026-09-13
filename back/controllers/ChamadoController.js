import Chamado from "../models/Chamado.js";
import TipoServico from "../models/TipoServico.js";

import { QueryTypes } from "sequelize";
import banco from "../Banco.js";

async function listar(req, res) {
  const dados = await Chamado.findAll({
    where: { idempresa: req.usuario.idempresa }
  });
  return res.json(dados);
}

async function selecionar(req, res) {
  const idchamado = req.params.id;
  const dados = await Chamado.findOne({
    where: { idchamado, idempresa: req.usuario.idempresa }
  });

  if (!dados) {
    return res.status(404).json({ erro: "Chamado não encontrado." });
  }

  return res.json(dados);
}

async function excluir(req, res) {
  const idchamado = req.params.id;
  const dados = await Chamado.destroy({
    where: { idchamado, idempresa: req.usuario.idempresa }
  });
  return res.json(dados);
}

async function inserir(req, res) {
  try {
    const { cliente, descricao, data_abertura, data_conclusao, idtiposervico, tempo_horas, valor_total, status } = req.body;

    const tipoValido = await TipoServico.findOne({
      where: { idtiposervico, idempresa: req.usuario.idempresa }
    });

    if (!tipoValido) {
      return res.status(400).json({ erro: "Tipo de serviço inválido." });
    }

    const dados = await Chamado.create({
      cliente,
      descricao,
      data_abertura,
      data_conclusao,
      idtiposervico,
      tempo_horas,
      valor_total,
      status,
      idempresa: req.usuario.idempresa,
    });

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO CRIAR CHAMADO:", error);
    return res.status(500).json({ erro: "Erro ao criar o chamado." });
  }
}

async function alterar(req, res) {
  try {
    const idchamado = req.params.id;
    const { cliente, descricao, data_abertura, data_conclusao, idtiposervico, tempo_horas, valor_total, status } = req.body;

    if (idtiposervico) {
      const tipoValido = await TipoServico.findOne({
        where: { idtiposervico, idempresa: req.usuario.idempresa }
      });

      if (!tipoValido) {
        return res.status(400).json({ erro: "Tipo de serviço inválido." });
      }
    }

    const dados = await Chamado.update(
      { cliente, descricao, data_abertura, data_conclusao, idtiposervico, tempo_horas, valor_total, status },
      { where: { idchamado, idempresa: req.usuario.idempresa } }
    );

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO ALTERAR CHAMADO:", error);
    return res.status(500).json({ erro: "Erro ao alterar o chamado." });
  }
}

async function relatorio(req, res) {
  try {
    let { inicio, fim } = req.query;

    let filtroData = "";
    const replacements = { idempresa: req.usuario.idempresa };

    if (inicio && fim) {
      filtroData = "AND c.data_abertura BETWEEN :inicio AND :fim";
      replacements.inicio = inicio + " 00:00:00";
      replacements.fim = fim + " 23:59:59";
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
      WHERE c.idempresa = :idempresa
      ${filtroData}
      ORDER BY c.data_abertura DESC
    `, { replacements });

    return res.json(dados[0]);

  } catch (error) {
    console.error("ERRO RELATORIO:", error);
    return res.status(500).json({ erro: error.message });
  }
}

export default { listar, selecionar, excluir, inserir, alterar, relatorio };