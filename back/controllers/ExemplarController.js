import Exemplar from "../models/Exemplar.js";
import Obra from "../models/Obra.js";

//Regras de Negócios
// MVC -> Model, View, Controller

async function listar (req, res) {
  const dados = await Exemplar.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const idexemplar = req.params.id;
  const dados = await Exemplar.findByPk(idexemplar);
  return res.json(dados);
}

async function excluir (req, res) {
  const idexemplar = req.params.id;
  const dados = await Exemplar.destroy({ where: { idexemplar: idexemplar } });
  return res.json(dados);
}

async function inserir (req, res) {
  const idobra = req.body.idobra;
  const status = req.body.status;

  //Verificar se a obra existe antes de criar o exemplar
  const obra = await Obra.findByPk(idobra);
  if (!obra) {
    return res.status(400).json({ erro: "Obra não encontrada" });
  } 

  const dados = await Exemplar.create({ 
    idobra: idobra,
    status: status 
  });

  return res.json(dados);
}

export default { listar, selecionar, excluir, inserir  };
