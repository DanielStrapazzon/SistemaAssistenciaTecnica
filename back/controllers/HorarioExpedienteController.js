import HorarioExpediente from "../models/HorarioExpediente.js";
import banco from "../Banco.js";

const DIAS_VALIDOS = [0, 1, 2, 3, 4, 5, 6];
const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

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

function validarDias(dias) {
  if (!dias || typeof dias !== "object") {
    return "Formato inválido.";
  }

  for (const chave of Object.keys(dias)) {
    const dia = Number(chave);

    if (!DIAS_VALIDOS.includes(dia)) {
      return `Dia da semana inválido: ${chave}.`;
    }

    const periodos = dias[chave];

    if (!Array.isArray(periodos)) {
      return `Os períodos do dia ${chave} precisam ser uma lista.`;
    }

    for (const periodo of periodos) {
      if (!periodo || !REGEX_HORA.test(periodo.inicio) || !REGEX_HORA.test(periodo.fim)) {
        return `Horário inválido no dia ${chave}. Use o formato HH:MM.`;
      }

      if (periodo.inicio >= periodo.fim) {
        return `No dia ${chave}, o horário de início (${periodo.inicio}) precisa ser antes do de fim (${periodo.fim}).`;
      }
    }

    const ordenados = [...periodos].sort((a, b) => a.inicio.localeCompare(b.inicio));

    for (let i = 1; i < ordenados.length; i++) {
      if (ordenados[i].inicio < ordenados[i - 1].fim) {
        return `No dia ${chave}, os períodos "${ordenados[i - 1].inicio}–${ordenados[i - 1].fim}" e "${ordenados[i].inicio}–${ordenados[i].fim}" se sobrepõem.`;
      }
    }
  }

  return null;
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