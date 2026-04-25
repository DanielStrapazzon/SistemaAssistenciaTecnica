import Usuario from "../models/Usuario.js";

//Regras de Negócios
// MVC -> Model, View, Controller

async function listar (req, res) {
  const dados = await Usuario.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const idusuario = req.params.id;
  const dados = await Usuario.findByPk(idusuario);
  return res.json(dados);
}

async function excluir (req, res) {
  const idusuario = req.params.id;
  const dados = await Usuario.destroy({ where: { idusuario: idusuario } });
  return res.json(dados);
}

async function inserir (req, res) {
  const nome = req.body.nome;
  const matricula = req.body.matricula;
  const email = req.body.email;
  const perfil = req.body.perfil;
  const status = req.body.status;

  const dados = await Usuario.create({ 
    nome: nome, 
    matricula: matricula, 
    email: email, 
    perfil: perfil, 
    status: status 
  });

  return res.json(dados);
}

async function alterar(req, res) {
    const idusuario = req.params.id;
    const nome = req.body.nome;
    const matricula = req.body.matricula;
    const email = req.body.email;
    const perfil = req.body.perfil;
    const status = req.body.status;

    const dados = await Usuario.update({ nome: nome, email: email, matricula: matricula, perfil: perfil, status: status }, {
        where: { idusuario: idusuario }
    });
    return res.json(dados);
}

export default { listar, selecionar, excluir, inserir, alterar };
