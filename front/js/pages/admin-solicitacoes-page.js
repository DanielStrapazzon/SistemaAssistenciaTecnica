document.addEventListener("DOMContentLoaded", () => {
  carregarSolicitacoes();
});

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

  container.innerHTML = pendentes.map(s => `
    <div class="quick-action" style="cursor:default;">
      <span class="action-icon"><i class="bi bi-person-plus"></i></span>
      <span>
        <h2>${escapeHtml(s.nome)}</h2>
        <p>
          ${escapeHtml(s.email)}
          ${s.empresa ? " · " + escapeHtml(s.empresa) : ""}
          ${s.motivo ? "<br>" + escapeHtml(s.motivo) : ""}
        </p>
      </span>
      <span class="d-flex gap-2">
        <button class="btn btn-success btn-sm" data-acao="aprovar" data-id="${s.idsolicitacao}">
          <i class="bi bi-check2"></i> Aprovar
        </button>
        <button class="btn btn-outline-danger btn-sm" data-acao="rejeitar" data-id="${s.idsolicitacao}">
          <i class="bi bi-x"></i> Rejeitar
        </button>
      </span>
    </div>
  `).join("");

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
  const confirmado = window.confirm
    ? window.confirm("Aprovar esta solicitação e criar o usuário?")
    : true;

  if (!confirmado) return;

  botao.disabled = true;

  try {
    const resposta = await fetch(`/api/solicitacao-acesso/${id}/aprovar`, {
      method: "POST",
      credentials: "same-origin",
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

    if (typeof notify === "function") notify("Usuário aprovado com sucesso.", "success");
    carregarSolicitacoes();
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