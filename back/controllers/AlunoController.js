import Aluno from "../models/Aluno.js";

//Regras de Negócios

async function listar (req, res) {
  const dados = await Aluno.findAll();
  return res.json(dados);
}

async function selecionar (req, res) {
  const matricula = req.params.matricula;
  const dados = await Aluno.findByPk(matricula);
  return res.json(dados);
}

async function excluir (req, res) {
  const matricula = req.params.matricula;
  const dados = await Aluno.destroy({ where: { matricula: matricula } });
  return res.json(dados);
}

async function inserir (req, res) {
  const nome = req.body.nome;
  const email = req.body.email;
  const dados = await Aluno.create({ nome: nome, email: email });
  return res.json(dados);
}

async function alterar (req, res) {
    const { matricula } = req.params;
    const { nome, email } = req.body;  
    try {
        const aluno = await Aluno.findByPk(matricula);
        if (aluno) {
            await aluno.update({ nome: nome, email: email });
            res.json(aluno);
        } else {
            res.status(404).json({ error: 'Aluno não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
}

export default { listar, selecionar, excluir, inserir, alterar };
