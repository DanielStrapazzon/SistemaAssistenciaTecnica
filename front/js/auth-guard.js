(async function protegerPagina() {
  try {
    const resposta = await fetch("/api/me", { credentials: "same-origin" });

    if (!resposta.ok) {
      window.location.href = "login.html";
      return;
    }

    const usuario = await resposta.json();
    window.__usuarioLogado = usuario;
    document.dispatchEvent(new CustomEvent("usuario-autenticado", { detail: usuario }));
  } catch (error) {
    console.error("Falha ao verificar sessão:", error);
    window.location.href = "login.html";
  }
})();