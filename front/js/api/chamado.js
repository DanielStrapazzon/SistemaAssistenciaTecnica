const API_CHAMADO = `${API_BASE}/chamado`;

async function getChamados() {
  const res = await fetch(API_CHAMADO);
  return await res.json();
}

async function criarChamado(dados) {
  await fetch(`${API_BASE}/chamado`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
}