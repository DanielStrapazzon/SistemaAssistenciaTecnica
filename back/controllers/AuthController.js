import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Usuario from "../models/Usuario.js";
import { enviarCodigoRedefinicao } from "../utils/email.js";

const NOME_COOKIE = "sessao";
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000;
const DURACAO_CODIGO_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS_CODIGO = 5;

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

async function esqueciSenha(req, res) {
  const mensagemPadrao = { mensagem: "Se este e-mail estiver cadastrado, você receberá um código em instantes." };

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: "Informe o e-mail." });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });

    if (!usuario || usuario.status !== 1) {
      return res.json(mensagemPadrao);
    }

    const codigo = String(crypto.randomInt(100000, 999999));
    const reset_codigo_hash = await bcrypt.hash(codigo, 10);

    usuario.reset_codigo_hash = reset_codigo_hash;
    usuario.reset_expira_em = new Date(Date.now() + DURACAO_CODIGO_MS);
    usuario.reset_tentativas = 0;
    await usuario.save();

    await enviarCodigoRedefinicao(usuario.email, codigo);

    return res.json(mensagemPadrao);
  } catch (error) {
    console.error("ERRO AO SOLICITAR REDEFINICAO:", error);
    return res.json(mensagemPadrao);
  }
}

async function redefinirSenha(req, res) {
  try {
    const { email, codigo, novaSenha } = req.body;

    if (!email || !codigo || !novaSenha) {
      return res.status(400).json({ erro: "Preencha e-mail, código e nova senha." });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ erro: "A nova senha deve ter pelo menos 8 caracteres." });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });

    const erroGenerico = "Código inválido ou expirado. Solicite um novo código.";

    if (!usuario || !usuario.reset_codigo_hash || !usuario.reset_expira_em) {
      return res.status(400).json({ erro: erroGenerico });
    }

    if (new Date() > new Date(usuario.reset_expira_em)) {
      return res.status(400).json({ erro: erroGenerico });
    }

    if (usuario.reset_tentativas >= MAX_TENTATIVAS_CODIGO) {
      return res.status(429).json({ erro: "Muitas tentativas com este código. Solicite um novo." });
    }

    const codigoConfere = await bcrypt.compare(String(codigo), usuario.reset_codigo_hash);

    if (!codigoConfere) {
      usuario.reset_tentativas += 1;
      await usuario.save();
      return res.status(400).json({ erro: erroGenerico });
    }

    usuario.senha_hash = await bcrypt.hash(novaSenha, 10);
    usuario.reset_codigo_hash = null;
    usuario.reset_expira_em = null;
    usuario.reset_tentativas = 0;
    await usuario.save();

    return res.json({ mensagem: "Senha redefinida com sucesso. Você já pode entrar com a nova senha." });
  } catch (error) {
    console.error("ERRO AO REDEFINIR SENHA:", error);
    return res.status(500).json({ erro: "Não foi possível redefinir a senha." });
  }
}

export default { login, logout, me, esqueciSenha, redefinirSenha };