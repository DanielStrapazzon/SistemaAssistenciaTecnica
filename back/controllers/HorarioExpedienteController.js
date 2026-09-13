import HorarioExpediente from "../models/HorarioExpediente.js";
import banco from "../Banco.js";
import { validarDias } from "../utils/horarioExpediente.js";

async function listar(req, res) {
  try {
    const linhas = await HorarioExpediente.findAll({
      where: { idempresa: req.usuario.idempresa },
      order: [["dia_semana", "ASC"], ["hora_inicio", "ASC"]],
    });

    const porDia = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (const linha of linhas) {
      porDia[linha.dia_semana].push({
        inicio: linha.hora_inicio.slice(0, 5),
        fim: linha.hora_fim.slice(0, 5),
      });
    }

    return res.json(porDia);
  } catch (error) {
    console.error("ERRO AO LISTAR HORARIO EXPEDIENTE:", error);
    return res.status(500).json({ erro: "Não foi possível carregar o horário de expediente." });
  }
}

async function salvar(req, res) {
  try {
    const { dias } = req.body;

    const erroValidacao = validarDias(dias);
    if (erroValidacao) {
      return res.status(400).json({ erro: erroValidacao });
    }

    const transacao = await banco.transaction();

    try {
      await HorarioExpediente.destroy({
        where: { idempresa: req.usuario.idempresa },
        transaction: transacao,
      });

      const novasLinhas = [];

      for (const chave of Object.keys(dias)) {
        const dia = Number(chave);
        for (const periodo of dias[chave]) {
          novasLinhas.push({
            idempresa: req.usuario.idempresa,
            dia_semana: dia,
            hora_inicio: periodo.inicio,
            hora_fim: periodo.fim,
          });
        }
      }

      if (novasLinhas.length > 0) {
        await HorarioExpediente.bulkCreate(novasLinhas, { transaction: transacao });
      }

      await transacao.commit();
      return res.json({ mensagem: "Horário de expediente atualizado com sucesso." });
    } catch (erroTransacao) {
      await transacao.rollback();
      throw erroTransacao;
    }
  } catch (error) {
    console.error("ERRO AO SALVAR HORARIO EXPEDIENTE:", error);
    return res.status(500).json({ erro: "Não foi possível salvar o horário de expediente." });
  }
}

export default { listar, salvar };