const API_TIPO = `${API_BASE}/tipo-servico`;

async function getTipos() {
  const res = await fetch(API_TIPO);

  if (!res.ok) {
    throw new Error("Erro ao buscar tipos");
  }

  return await res.json();
}

async function criarTipo(dados) {
  const res = await fetch(API_TIPO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  if (!res.ok) {
    throw new Error("Erro ao criar tipo");
  }
}

async function deletarTipo(id) {
  const res = await fetch(`${API_TIPO}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir tipo");
  }
}