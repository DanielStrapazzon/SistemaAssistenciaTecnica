import crypto from "crypto";
import bcrypt from "bcryptjs";
import SolicitacaoAcesso from "../models/SolicitacaoAcesso.js";
import Usuario from "../models/Usuario.js";

function gerarSenhaTemporaria() {
  const palavras = ["brisa", "vento", "lume", "porto", "campo", "verde", "prata", "aurora", "chave", "torre"];
  const a = palavras[Math.floor(Math.random() * palavras.length)];
  const b = palavras[Math.floor(Math.random() * palavras.length)];
  const numero = crypto.randomInt(100, 999);
  return `${a}-${numero}-${b}`;
}

async function criar(req, res) {
  try {
    const { nome, email, empresa, motivo } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: "Informe ao menos nome e e-mail." });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    const jaExiste = await SolicitacaoAcesso.findOne({
      where: { email: emailNormalizado, status: "pendente" }
    });

    if (jaExiste) {
      return res.json({ mensagem: "Já existe uma solicitação pendente para este e-mail. Aguarde a análise." });
    }

    await SolicitacaoAcesso.create({
      nome: String(nome).trim(),
      email: emailNormalizado,
      empresa: empresa ? String(empresa).trim() : null,
      motivo: motivo ? String(motivo).trim() : null,
    });

    return res.json({ mensagem: "Solicitação enviada com sucesso. Você será avisado quando for aprovada." });
  } catch (error) {
    console.error("ERRO AO CRIAR SOLICITACAO:", error);
    return res.status(500).json({ erro: "Não foi possível enviar sua solicitação." });
  }
}

async function listar(req, res) {
  try {
    const dados = await SolicitacaoAcesso.findAll({ order: [["criado_em", "DESC"]] });
    return res.json(dados);
  } catch (error) {
    console.error("ERRO AO LISTAR SOLICITACOES:", error);
    return res.status(500).json({ erro: "Não foi possível carregar as solicitações." });
  }
}

async function aprovar(req, res) {
  try {
    const idsolicitacao = req.params.id;
    const solicitacao = await SolicitacaoAcesso.findByPk(idsolicitacao);

    if (!solicitacao) {
      return res.status(404).json({ erro: "Solicitação não encontrada." });
    }

    if (solicitacao.status !== "pendente") {
      return res.status(400).json({ erro: "Esta solicitação já foi analisada anteriormente." });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email: solicitacao.email } });

    if (usuarioExistente) {
      return res.status(400).json({ erro: "Já existe um usuário cadastrado com este e-mail." });
    }

    const senhaTemporaria = gerarSenhaTemporaria();
    const senha_hash = await bcrypt.hash(senhaTemporaria, 10);

    await Usuario.create({
      nome: solicitacao.nome,
      email: solicitacao.email,
      matricula: `AUTO-${solicitacao.idsolicitacao}`,
      senha_hash,
      perfil: 2,
      status: 1,
    });

    solicitacao.status = "aprovada";
    solicitacao.decidido_em = new Date();
    await solicitacao.save();

    return res.json({
      mensagem: "Usuário criado com sucesso.",
      email: solicitacao.email,
      senhaTemporaria,
    });
  } catch (error) {
    console.error("ERRO AO APROVAR SOLICITACAO:", error);
    return res.status(500).json({ erro: "Não foi possível aprovar esta solicitação." });
  }
}

async function rejeitar(req, res) {
  try {
    const idsolicitacao = req.params.id;
    const solicitacao = await SolicitacaoAcesso.findByPk(idsolicitacao);

    if (!solicitacao) {
      return res.status(404).json({ erro: "Solicitação não encontrada." });
    }

    solicitacao.status = "rejeitada";
    solicitacao.decidido_em = new Date();
    await solicitacao.save();

    return res.json({ mensagem: "Solicitação rejeitada." });
  } catch (error) {
    console.error("ERRO AO REJEITAR SOLICITACAO:", error);
    return res.status(500).json({ erro: "Não foi possível rejeitar esta solicitação." });
  }
}

export default { criar, listar, aprovar, rejeitar };