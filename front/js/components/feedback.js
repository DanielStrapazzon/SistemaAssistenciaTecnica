function ensureToastContainer() {
  let container = document.querySelector("#app-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "app-toast-container";
    container.className = "toast-stack";
    document.body.appendChild(container);
  }

  return container;
}

function notify(message, type = "info") {
  const container = ensureToastContainer();
  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill"
  };

  const toast = document.createElement("div");
  toast.className = `app-toast app-toast-${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type] || icons.info}"></i>
    <span>${message}</span>
    <button type="button" aria-label="Fechar"><i class="bi bi-x"></i></button>
  `;

  toast.querySelector("button").addEventListener("click", () => toast.remove());
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("toast-leaving");
    window.setTimeout(() => toast.remove(), 180);
  }, 3600);
}

function confirmAction({
  title = "Confirmar acao",
  message = "Deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false
} = {}) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <div class="confirm-icon ${danger ? "confirm-icon-danger" : ""}">
          <i class="bi ${danger ? "bi-trash3" : "bi-question-circle"}"></i>
        </div>
        <div>
          <h2>${title}</h2>
          <p>${message}</p>
        </div>
        <div class="confirm-actions">
          <button type="button" class="btn btn-outline-secondary" data-action="cancel">${cancelText}</button>
          <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"}" data-action="confirm">${confirmText}</button>
        </div>
      </div>
    `;

    function close(result) {
      overlay.remove();
      resolve(result);
    }

    overlay.addEventListener("click", event => {
      if (event.target === overlay) close(false);
    });

    overlay.querySelector("[data-action='cancel']").addEventListener("click", () => close(false));
    overlay.querySelector("[data-action='confirm']").addEventListener("click", () => close(true));

    document.body.appendChild(overlay);
    overlay.querySelector("[data-action='confirm']").focus();
  });
}

window.alert = function(message) {
  notify(String(message || "Atencao"), "warning");
};
