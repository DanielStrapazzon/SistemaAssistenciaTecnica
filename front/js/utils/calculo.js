// ================= TEMPO POR EXPEDIENTE =================
function calcularTempoHoras(inicioStr, fimStr, expediente) {
  const inicio = moment(inicioStr);
  const fim = moment(fimStr);

  if (!fim.isAfter(inicio)) return 0;
  if (!expediente) return 0;

  let totalMin = 0;
  let atual = inicio.clone();

  while (atual.isBefore(fim)) {
    const diaSemana = atual.day();
    const periodos = expediente[diaSemana] || expediente[String(diaSemana)] || [];

    for (const periodo of periodos) {
      const [hIni, mIni] = periodo.inicio.split(":").map(Number);
      const [hFim, mFim] = periodo.fim.split(":").map(Number);
      totalMin += calcularPeriodo(atual, fim, hIni, mIni, hFim, mFim);
    }

    atual.add(1, "day").startOf("day");
  }

  return totalMin / 60;
}

function calcularPeriodo(atual, fim, hIni, mIni, hFim, mFim) {
  const inicioPeriodo = atual.clone().hour(hIni).minute(mIni).second(0);
  const fimPeriodo = atual.clone().hour(hFim).minute(mFim).second(0);

  const ini = moment.max(atual, inicioPeriodo);
  const f = moment.min(fim, fimPeriodo);

  return f.isAfter(ini) ? f.diff(ini, "minutes") : 0;
}

function calcularValor(tipo, tempoHoras) {
  if (!tipo) return 0;

  if (tipo.tipo_cobranca === "hora") {
    return tempoHoras * parseFloat(tipo.valor);
  }

  return parseFloat(tipo.valor);
}