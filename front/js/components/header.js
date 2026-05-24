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

      <div class="ms-md-auto">
        <ul class="nav nav-pills">
          ${menu}
        </ul>
      </div>
    </nav>
  `;
}

document.addEventListener("DOMContentLoaded", renderAppHeader);
