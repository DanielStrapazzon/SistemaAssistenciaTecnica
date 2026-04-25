document.addEventListener("DOMContentLoaded", () => {
  init();
  configurarEventos();
});

let tipos = [];

// ================= INIT =================
async function init() {
  try {
    tipos = await getTipos();

    const select = document.querySelector("#idtipo");

    select.innerHTML = `<option value="">Selecione...</option>`;

    tipos.forEach(t => {
      select.innerHTML += `
        <option value="${t.idtiposervico}">
          ${t.descricao}
        </option>
      `;
    });

  } catch (error) {
    console.error("Erro ao carregar tipos", error);
  }
}

// ================= EVENTOS =================
function configurarEventos() {
  const form = document.querySelector("form");

  document.querySelector("#data_conclusao")
    .addEventListener("change", calcular);

  document.querySelector("#idtipo")
    .addEventListener("change", calcular);

  document.querySelector("#data_abertura")
    .addEventListener("change", calcular);

  form.addEventListener("submit", salvarChamado);
}

// ================= CALCULO =================
function calcular() {
  const idtipo = document.querySelector("#idtipo").value;
  const inicio = document.querySelector("#data_abertura").value;
  const fim = document.querySelector("#data_conclusao").value;

  if (!idtipo || !inicio || !fim) return;

  const tipo = tipos.find(t => t.idtiposervico == idtipo);

  if (!tipo) return;

  const tempo = calcularTempoHoras(inicio, fim);
  const valor = calcularValor(tipo, tempo);

  document.querySelector("#tempo").value = tempo.toFixed(2);
  document.querySelector("#valor").value = valor.toFixed(2);
}

// ================= SALVAR =================
async function salvarChamado(e) {
  e.preventDefault();

  const chamado = {
    cliente: document.querySelector("#cliente").value.trim(),
    descricao: document.querySelector("#descricao").value.trim(),
    idtiposervico: parseInt(document.querySelector("#idtipo").value),
    data_abertura: document.querySelector("#data_abertura").value,
    data_conclusao: document.querySelector("#data_conclusao").value,
    tempo_horas: parseFloat(document.querySelector("#tempo").value) || 0,
    valor_total: parseFloat(document.querySelector("#valor").value) || 0
  };

  // validação
  if (!chamado.cliente || !chamado.descricao || !chamado.idtiposervico) {
    alert("Preencha todos os campos obrigatórios");
    return;
  }

  try {
    await criarChamado(chamado);

    alert("Chamado cadastrado com sucesso");

    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Erro ao cadastrar chamado");
  }
}