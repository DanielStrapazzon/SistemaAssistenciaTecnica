const API_HORARIO = `${API_BASE}/horario-expediente`;

async function getHorarioExpediente() {
  const res = await fetch(API_HORARIO);

  if (!res.ok) {
    throw new Error("Erro ao buscar horário de expediente");
  }

  return await res.json();
}

async function salvarHorarioExpediente(dias) {
  const res = await fetch(API_HORARIO, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dias }),
  });

  const dados = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(dados.erro || "Erro ao salvar horário de expediente");
  }

  return dados;
}