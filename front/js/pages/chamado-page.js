document.addEventListener("DOMContentLoaded", () => {
  init();
  configurarEventos();
});

let tipos = [];

async function init() {
  try {
    tipos = await getTipos();

    const select = document.querySelector("#idtipo");
    select.innerHTML = `<option value="">Selecione...</option>`;

    tipos.forEach(tipo => {
      select.innerHTML += `
        <option value="${tipo.idtiposervico}">
          ${tipo.descricao}
        </option>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar tipos", error);
    notify("Nao foi possivel carregar os tipos de servico.", "error");
  }
}

function configurarEventos() {
  const form = document.querySelector("form");

  document.querySelector("#data_conclusao").addEventListener("change", calcular);
  document.querySelector("#idtipo").addEventListener("change", calcular);
  document.querySelector("#data_abertura").addEventListener("change", calcular);

  form.addEventListener("submit", salvarChamado);
}

function calcular() {
  const idtipo = document.querySelector("#idtipo").value;
  const inicio = document.querySelector("#data_abertura").value;
  const fim = document.querySelector("#data_conclusao").value;

  if (!idtipo || !inicio || !fim) {
    document.querySelector("#tempo").value = "";
    document.querySelector("#valor").value = "";
    atualizarPreview(0, 0);
    return;
  }

  const tipo = tipos.find(item => item.idtiposervico == idtipo);

  if (!tipo) return;

  const tempo = calcularTempoHoras(inicio, fim);
  const valor = calcularValor(tipo, tempo);

  document.querySelector("#tempo").value = tempo.toFixed(2);
  document.querySelector("#valor").value = valor.toFixed(2);
  atualizarPreview(tempo, valor);
}

function atualizarPreview(tempo, valor) {
  const tempoPreview = document.querySelector("#tempo-preview");
  const valorPreview = document.querySelector("#valor-preview");

  if (tempoPreview) tempoPreview.innerText = `${tempo.toFixed(2)}h`;
  if (valorPreview) valorPreview.innerText = `R$ ${valor.toFixed(2)}`;
}

function setSalvando(salvando) {
  const botao = document.querySelector("#btn-salvar-chamado");

  if (!botao) return;

  botao.disabled = salvando;
  botao.innerHTML = salvando
    ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Salvando...`
    : `<i class="bi bi-check2-circle me-2"></i>Cadastrar chamado`;
}

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

  if (!chamado.cliente || !chamado.descricao || !chamado.idtiposervico) {
    notify("Preencha cliente, descricao e tipo de servico.", "warning");
    return;
  }

  try {
    setSalvando(true);
    await criarChamado(chamado);

    notify("Chamado cadastrado com sucesso.", "success");

    setTimeout(() => {
      window.location.href = "index.html?v=6";
    }, 900);
  } catch (error) {
    console.error(error);
    notify("Erro ao cadastrar chamado.", "error");
    setSalvando(false);
  }
}
