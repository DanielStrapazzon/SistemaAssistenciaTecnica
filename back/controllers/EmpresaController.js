import Empresa from "../models/Empresa.js";

async function listar(req, res) {
  try {
    const dados = await Empresa.findAll({ order: [["nome", "ASC"]] });
    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO LISTAR EMPRESAS:", error);
    return res.status(500).json({ erro: "Não foi possível carregar as empresas." });
  }
}

export default { listar };