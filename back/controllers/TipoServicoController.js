import TipoServico from "../models/TipoServico.js";

async function listar(req, res) {
  try {
    const dados = await TipoServico.findAll({
      where: { idempresa: req.usuario.idempresa }
    });
    return res.json(dados);
  } catch (error) {
    console.error("ERRO NO TIPOSERVICO:", error);
    return res.status(500).json({ erro: error.message });
  }
}

async function selecionar(req, res) {
  try {
    const idtiposervico = req.params.id;
    const dados = await TipoServico.findOne({
      where: { idtiposervico, idempresa: req.usuario.idempresa }
    });

    if (!dados) {
      return res.status(404).json({ erro: "Tipo de serviço não encontrado." });
    }

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO SELECIONAR TIPOSERVICO:", error);
    return res.status(500).json({ erro: "Erro ao buscar o tipo de serviço." });
  }
}

async function excluir(req, res) {
  try {
    const idtiposervico = req.params.id;
    const dados = await TipoServico.destroy({
      where: { idtiposervico, idempresa: req.usuario.idempresa }
    });
    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO EXCLUIR TIPOSERVICO:", error);
    return res.status(500).json({ erro: "Erro ao excluir o tipo de serviço." });
  }
}

async function inserir(req, res) {
  try {
    const { descricao, tipo_cobranca, valor } = req.body;

    const dados = await TipoServico.create({
      descricao,
      tipo_cobranca,
      valor,
      idempresa: req.usuario.idempresa,
    });

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO CRIAR TIPOSERVICO:", error);
    return res.status(500).json({ erro: "Erro ao criar o tipo de serviço." });
  }
}

async function alterar(req, res) {
  try {
    const idtiposervico = req.params.id;
    const { descricao, tipo_cobranca, valor } = req.body;

    const dados = await TipoServico.update(
      { descricao, tipo_cobranca, valor },
      { where: { idtiposervico, idempresa: req.usuario.idempresa } }
    );

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO ALTERAR TIPOSERVICO:", error);
    return res.status(500).json({ erro: "Erro ao alterar o tipo de serviço." });
  }
}

export default { listar, selecionar, excluir, inserir, alterar };