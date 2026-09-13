let empresasCache = [];

document.addEventListener("DOMContentLoaded", () => {
  inicializar();
});

async function inicializar() {
  await carregarEmpresas();
  await carregarSolicitacoes();
}

async function carregarEmpresas() {
  try {
    const resposta = await fetch("/api/empresa", { credentials: "same-origin" });
    if (resposta.ok) {
      empresasCache = await resposta.json();
    }
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
  }
}

async function carregarSolicitacoes() {
  const listaPendentes = document.querySelector("#lista-pendentes");
  const listaHistorico = document.querySelector("#lista-historico");

  try {
    const resposta = await fetch("/api/solicitacao-acesso", { credentials: "same-origin" });

    if (resposta.status === 403) {
      document.querySelector("#acesso-negado").style.display = "block";
      listaPendentes.innerHTML = "";
      listaHistorico.innerHTML = "";
      return;
    }

    if (!resposta.ok) {
      listaPendentes.innerHTML = `<p class="text-danger">Não foi possível carregar as solicitações.</p>`;
      return;
    }

    const solicitacoes = await resposta.json();

    const pendentes = solicitacoes.filter(s => s.status === "pendente");
    const historico = solicitacoes.filter(s => s.status !== "pendente");

    renderizarPendentes(pendentes);
    renderizarHistorico(historico);
  } catch (error) {
    console.error(error);
    listaPendentes.innerHTML = `<p class="text-danger">Erro ao conectar com o servidor.</p>`;
  }
}

function renderizarPendentes(pendentes) {
  const container = document.querySelector("#lista-pendentes");

  if (pendentes.length === 0) {
    container.innerHTML = `<p class="text-muted mb-0">Nenhum pedido pendente no momento.</p>`;
    return;
  }

  const opcoesEmpresas = empresasCache.map(e =>
    `<option value="${e.idempresa}">${escapeHtml(e.nome)}</option>`
  ).join("");

  container.innerHTML = pendentes.map(s => `
    <div class="quick-action" style="cursor:default; flex-wrap: wrap;">
      <span class="action-icon"><i class="bi bi-person-plus"></i></span>
      <span style="flex: 1 1 260px;">
        <h2>${escapeHtml(s.nome)}</h2>
        <p>
          ${escapeHtml(s.email)}
          ${s.empresa ? " · sugeriu: " + escapeHtml(s.empresa) : ""}
          ${s.motivo ? "<br>" + escapeHtml(s.motivo) : ""}
        </p>
      </span>

      <span class="d-flex flex-column gap-2" style="min-width: 240px;" data-linha="${s.idsolicitacao}">
        <select class="form-select form-select-sm" data-campo="empresa-select">
          <option value="__nova__">+ Criar empresa nova</option>
          ${opcoesEmpresas}
        </select>
        <input
          type="text"
          class="form-control form-control-sm"
          data-campo="empresa-nova-nome"
          placeholder="Nome da nova empresa"
          value="${escapeHtml(s.empresa || "")}"
        >
        <span class="d-flex gap-2">
          <button class="btn btn-success btn-sm flex-fill" data-acao="aprovar" data-id="${s.idsolicitacao}">
            <i class="bi bi-check2"></i> Aprovar
          </button>
          <button class="btn btn-outline-danger btn-sm flex-fill" data-acao="rejeitar" data-id="${s.idsolicitacao}">
            <i class="bi bi-x"></i> Rejeitar
          </button>
        </span>
      </span>
    </div>
  `).join("");

  container.querySelectorAll("[data-campo='empresa-select']").forEach(select => {
    const linha = select.closest("[data-linha]");
    const inputNovaEmpresa = linha.querySelector("[data-campo='empresa-nova-nome']");

    function atualizarVisibilidade() {
      inputNovaEmpresa.style.display = select.value === "__nova__" ? "block" : "none";
    }

    select.addEventListener("change", atualizarVisibilidade);
    atualizarVisibilidade();
  });

  container.querySelectorAll("[data-acao='aprovar']").forEach(btn => {
    btn.addEventListener("click", () => aprovar(btn.dataset.id, btn));
  });
  container.querySelectorAll("[data-acao='rejeitar']").forEach(btn => {
    btn.addEventListener("click", () => rejeitar(btn.dataset.id, btn));
  });
}

function renderizarHistorico(historico) {
  const container = document.querySelector("#lista-historico");

  if (historico.length === 0) {
    container.innerHTML = `<p class="text-muted mb-0">Nenhum histórico ainda.</p>`;
    return;
  }

  container.innerHTML = historico.map(s => `
    <div class="quick-action" style="cursor:default;">
      <span class="action-icon"><i class="bi ${s.status === 'aprovada' ? 'bi-check-circle' : 'bi-x-circle'}"></i></span>
      <span>
        <h2>${escapeHtml(s.nome)}</h2>
        <p>${escapeHtml(s.email)} · <span class="badge-soft">${s.status}</span></p>
      </span>
    </div>
  `).join("");
}

async function aprovar(id, botao) {
  const linha = document.querySelector(`[data-linha="${id}"]`);
  const select = linha.querySelector("[data-campo='empresa-select']");
  const inputNovaEmpresa = linha.querySelector("[data-campo='empresa-nova-nome']");

  const corpo = select.value === "__nova__"
    ? { novaEmpresa: inputNovaEmpresa.value.trim() }
    : { idempresa: select.value };

  if (select.value === "__nova__" && !corpo.novaEmpresa) {
    if (typeof notify === "function") notify("Informe o nome da nova empresa.", "warning");
    return;
  }

  const confirmado = window.confirm
    ? window.confirm("Aprovar esta solicitação e criar o usuário?")
    : true;

  if (!confirmado) return;

  botao.disabled = true;

  try {
    const resposta = await fetch(`/api/solicitacao-acesso/${id}/aprovar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(corpo),
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      if (typeof notify === "function") notify(dados.erro || "Erro ao aprovar.", "error");
      botao.disabled = false;
      return;
    }

    document.querySelector("#senha-gerada-email").textContent = dados.email;
    document.querySelector("#senha-gerada-valor").textContent = dados.senhaTemporaria;
    document.querySelector("#senha-gerada-aviso").style.display = "block";
    document.querySelector("#senha-gerada-aviso").scrollIntoView({ behavior: "smooth" });

    if (typeof notify === "function") notify(`Usuário aprovado na empresa "${dados.empresa}".`, "success");
    inicializar();
  } catch (error) {
    console.error(error);
    if (typeof notify === "function") notify("Erro ao conectar com o servidor.", "error");
    botao.disabled = false;
  }
}

async function rejeitar(id, botao) {
  const confirmado = window.confirm
    ? window.confirm("Rejeitar esta solicitação?")
    : true;

  if (!confirmado) return;

  botao.disabled = true;

  try {
    const resposta = await fetch(`/api/solicitacao-acesso/${id}/rejeitar`, {
      method: "POST",
      credentials: "same-origin",
    });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      if (typeof notify === "function") notify(dados.erro || "Erro ao rejeitar.", "error");
      botao.disabled = false;
      return;
    }

    if (typeof notify === "function") notify("Solicitação rejeitada.", "info");
    carregarSolicitacoes();
  } catch (error) {
    console.error(error);
    if (typeof notify === "function") notify("Erro ao conectar com o servidor.", "error");
    botao.disabled = false;
  }
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}