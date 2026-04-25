// ================= TEMPO POR EXPEDIENTE =================
function calcularTempoHoras(inicioStr, fimStr) {
  const inicio = moment(inicioStr);
  const fim = moment(fimStr);

  if (!fim.isAfter(inicio)) return 0;

  let totalMin = 0;
  let atual = inicio.clone();

  while (atual.isBefore(fim)) {

    const diaSemana = atual.day(); // 0=Dom, 6=Sáb

    // 🔴 DOMINGO → ignora
    if (diaSemana === 0) {
      atual.add(1, "day").startOf("day");
      continue;
    }

    // 🔵 SÁBADO → 08:00 às 12:00
    if (diaSemana === 6) {
      totalMin += calcularPeriodo(atual, fim, 8, 0, 12, 0);
    } 
    // 🟢 SEG–SEX → manhã + tarde
    else {
      totalMin += calcularPeriodo(atual, fim, 8, 0, 12, 0);
      totalMin += calcularPeriodo(atual, fim, 13, 30, 17, 30);
    }

    atual.add(1, "day").startOf("day");
  }

  return totalMin / 60; // retorna em horas
}

// ================= INTERVALO =================
function calcularPeriodo(atual, fim, hIni, mIni, hFim, mFim) {
  const inicioPeriodo = atual.clone().hour(hIni).minute(mIni).second(0);
  const fimPeriodo = atual.clone().hour(hFim).minute(mFim).second(0);

  const ini = moment.max(atual, inicioPeriodo);
  const f = moment.min(fim, fimPeriodo);

  return f.isAfter(ini) ? f.diff(ini, "minutes") : 0;
}

// ================= VALOR =================
function calcularValor(tipo, tempoHoras) {
  if (!tipo) return 0;

  if (tipo.tipo_cobranca === "hora") {
    return tempoHoras * parseFloat(tipo.valor);
  }

  return parseFloat(tipo.valor);
}