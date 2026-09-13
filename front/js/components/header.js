const APP_VERSION = "6";

const menuItems = [
  { label: "Painel", href: "index.html", page: "index.html" },
  { label: "Servicos", href: "tiposervico.html", page: "tiposervico.html" },
  { label: "Chamados", href: "chamado.html", page: "chamado.html" },
  { label: "Relatorios", href: "relatorio.html", page: "relatorio.html" }
];

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function renderAppHeader() {
  const header = document.querySelector("#app-header");

  if (!header) return;

  const currentPage = getCurrentPage();

  const menu = menuItems.map(item => {
    const activeClass = item.page === currentPage ? " active" : "";

    return `
      <li class="nav-item">
        <a class="nav-link${activeClass}" href="${item.href}?v=${APP_VERSION}">
          ${item.label}
        </a>
      </li>
    `;
  }).join("");

  header.innerHTML = `
    <nav class="app-navbar navbar navbar-expand-md px-3 py-3">
      <a class="navbar-brand d-flex align-items-center gap-3 m-0" href="index.html?v=${APP_VERSION}">
        <span class="brand-mark"><i class="bi bi-tools"></i></span>
        <span>
          <span class="brand-title d-block">Assistencia Tecnica</span>
          <span class="brand-subtitle d-block">Gestao de chamados</span>
        </span>
      </a>

      <div class="ms-md-auto d-flex align-items-center gap-3">
        <ul class="nav nav-pills">
          ${menu}
        </ul>
        <span id="header-usuario-nome" class="text-muted small d-none d-md-inline"></span>
        <button type="button" id="btn-sair" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </nav>
  `;

  const btnSair = document.querySelector("#btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", async () => {
      try {
        await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
      } finally {
        window.location.href = "login.html";
      }
    });
  }

  document.addEventListener("usuario-autenticado", (event) => {
    const nomeEl = document.querySelector("#header-usuario-nome");
    if (nomeEl && event.detail?.nome) {
      nomeEl.textContent = event.detail.nome;
    }

    if (event.detail?.perfil === 1) {
      const menuLista = document.querySelector(".app-navbar .nav-pills");

      if (menuLista && !menuLista.querySelector("[data-menu='admin']")) {
        const item = document.createElement("li");
        item.className = "nav-item";
        item.innerHTML = `
          <a class="nav-link" data-menu="admin" href="admin-solicitacoes.html">
            Solicitações
          </a>
        `;
        menuLista.appendChild(item);
      }

      if (menuLista && !menuLista.querySelector("[data-menu='expediente']")) {
        const item = document.createElement("li");
        item.className = "nav-item";
        item.innerHTML = `
          <a class="nav-link" data-menu="expediente" href="horario-expediente.html">
            Expediente
          </a>
        `;
        menuLista.appendChild(item);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", renderAppHeader);