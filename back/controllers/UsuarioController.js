import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

const SEM_SENHA = { exclude: ["senha_hash"] };

async function listar(req, res) {
  const dados = await Usuario.findAll({ attributes: SEM_SENHA });
  return res.json(dados);
}

async function selecionar(req, res) {
  const idusuario = req.params.id;
  const dados = await Usuario.findByPk(idusuario, { attributes: SEM_SENHA });
  return res.json(dados);
}

async function excluir(req, res) {
  const idusuario = req.params.id;
  const dados = await Usuario.destroy({ where: { idusuario: idusuario } });
  return res.json(dados);
}

async function inserir(req, res) {
  try {
    const { nome, matricula, email, perfil, status, senha } = req.body;

    if (!senha || senha.length < 8) {
      return res.status(400).json({ erro: "A senha deve ter pelo menos 8 caracteres." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const dados = await Usuario.create({
      nome,
      matricula,
      email: String(email).trim().toLowerCase(),
      perfil,
      status,
      senha_hash,
    });

    const { senha_hash: _omitido, ...usuarioSemSenha } = dados.toJSON();
    return res.json(usuarioSemSenha);
  } catch (error) {
    console.error("ERRO AO CRIAR USUARIO:", error);
    return res.status(500).json({ erro: "Não foi possível criar o usuário." });
  }
}

async function alterar(req, res) {
  try {
    const idusuario = req.params.id;
    const { nome, matricula, email, perfil, status, senha } = req.body;

    const camposParaAtualizar = { nome, matricula, email, perfil, status };

    if (senha) {
      if (senha.length < 8) {
        return res.status(400).json({ erro: "A senha deve ter pelo menos 8 caracteres." });
      }
      camposParaAtualizar.senha_hash = await bcrypt.hash(senha, 10);
    }

    const dados = await Usuario.update(camposParaAtualizar, {
      where: { idusuario: idusuario }
    });

    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR USUARIO:", error);
    return res.status(500).json({ erro: "Não foi possível atualizar o usuário." });
  }
}

export default { listar, selecionar, excluir, inserir, alterar };