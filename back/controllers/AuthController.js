import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const NOME_COOKIE = "sessao";
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000;

function opcoesCookie() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: DURACAO_SESSAO_MS,
    path: "/",
  };
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe e-mail e senha." });
    }

    const usuario = await Usuario.findOne({ where: { email: String(email).trim().toLowerCase() } });

    const mensagemErroGenerica = "E-mail ou senha inválidos.";

    if (!usuario) {
      return res.status(401).json({ erro: mensagemErroGenerica });
    }

    if (usuario.status !== 1) {
      return res.status(403).json({ erro: "Este usuário está inativo. Fale com o administrador." });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ erro: mensagemErroGenerica });
    }

    const token = jwt.sign(
      {
        idusuario: usuario.idusuario,
        idempresa: usuario.idempresa,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie(NOME_COOKIE, token, opcoesCookie());

    return res.json({
      idusuario: usuario.idusuario,
      idempresa: usuario.idempresa,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    });
  } catch (error) {
    console.error("ERRO LOGIN:", error);
    return res.status(500).json({ erro: "Erro ao processar o login." });
  }
}

async function logout(req, res) {
  res.clearCookie(NOME_COOKIE, { path: "/" });
  return res.json({ mensagem: "Sessão encerrada." });
}

async function me(req, res) {
  return res.json(req.usuario);
}

export default { login, logout, me };