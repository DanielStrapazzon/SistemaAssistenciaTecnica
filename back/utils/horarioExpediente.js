const DIAS_VALIDOS = [0, 1, 2, 3, 4, 5, 6];
const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validarDias(dias) {
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

export function horarioComercialPadrao() {
  return {
    0: [],
    1: [{ inicio: "08:00", fim: "12:00" }, { inicio: "13:30", fim: "17:30" }],
    2: [{ inicio: "08:00", fim: "12:00" }, { inicio: "13:30", fim: "17:30" }],
    3: [{ inicio: "08:00", fim: "12:00" }, { inicio: "13:30", fim: "17:30" }],
    4: [{ inicio: "08:00", fim: "12:00" }, { inicio: "13:30", fim: "17:30" }],
    5: [{ inicio: "08:00", fim: "12:00" }, { inicio: "13:30", fim: "17:30" }],
    6: [{ inicio: "08:00", fim: "12:00" }],
  };
}