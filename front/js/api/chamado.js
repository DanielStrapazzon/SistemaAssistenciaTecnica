const API_CHAMADO = `${API_BASE}/chamado`;

// =========================
// LISTAR CHAMADOS
// =========================
async function getChamados() {
  const res = await fetch(API_CHAMADO);
  return await res.json();
}

// =========================
// CRIAR CHAMADO
// =========================
async function criarChamado(dados) {
  const res = await fetch(API_CHAMADO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  return await res.json();
}

// =========================
// RELATÓRIO
// =========================
async function getRelatorio(inicio, fim) {
  let url = `${API_CHAMADO}/relatorio`;

  if (inicio && fim) {
    url += `?inicio=${inicio}&fim=${fim}`;
  }

  const res = await fetch(url);
  return await res.json();
}

// =========================
// EXPORTAR (IMPORTANTE)
// =========================
window.getChamados = getChamados;
window.criarChamado = criarChamado;
window.getRelatorio = getRelatorio;