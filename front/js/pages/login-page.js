document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const btn = document.querySelector("#btn-entrar");
  const errorBox = document.querySelector("#login-error");

  if (!form) return;

  form.addEventListener("submit", handleLogin);

  async function handleLogin(event) {
    event.preventDefault();
    hideError();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    if (!email || !senha) {
      showError("Preencha e-mail e senha para continuar.");
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 429) {
        showError(dados.erro || "Muitas tentativas. Aguarde alguns minutos.");
        return;
      }

      if (!resposta.ok) {
        showError(dados.erro || "E-mail ou senha inválidos.");
        return;
      }

      if (typeof notify === "function") notify("Login realizado com sucesso.", "success");
      window.location.href = "index.html?v=6";
    } catch (error) {
      console.error(error);
      showError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function setLoading(loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
      ? `<span class="spinner-border spinner-border-sm" role="status"></span> Entrando...`
      : `Entrar <i class="bi bi-arrow-right"></i>`;
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.add("show");
  }

  function hideError() {
    if (!errorBox) return;
    errorBox.textContent = "";
    errorBox.classList.remove("show");
  }
});