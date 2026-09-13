document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#solicitacao-form");
  const btn = document.querySelector("#btn-solicitar");
  const erroBox = document.querySelector("#solicitacao-erro");
  const sucessoBox = document.querySelector("#solicitacao-sucesso");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    esconderMensagens();

    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const empresa = document.querySelector("#empresa").value.trim();
    const motivo = document.querySelector("#motivo").value.trim();

    if (!nome || !email) {
      mostrarErro("Preencha ao menos nome e e-mail.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/solicitacao-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, empresa, motivo }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 429) {
        mostrarErro(dados.erro || "Muitas tentativas. Aguarde um pouco antes de tentar de novo.");
        return;
      }

      if (!resposta.ok) {
        mostrarErro(dados.erro || "Não foi possível enviar sua solicitação.");
        return;
      }

      mostrarSucesso(dados.mensagem || "Solicitação enviada com sucesso.");
      form.reset();
    } catch (error) {
      console.error(error);
      mostrarErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  });

  function setCarregando(carregando) {
    btn.disabled = carregando;
    btn.innerHTML = carregando
      ? `<span class="spinner-border spinner-border-sm" role="status"></span> Enviando...`
      : `Enviar solicitação <i class="bi bi-arrow-right"></i>`;
  }

  function mostrarErro(mensagem) {
    erroBox.textContent = mensagem;
    erroBox.classList.add("show");
  }

  function mostrarSucesso(mensagem) {
    sucessoBox.textContent = mensagem;
    sucessoBox.classList.add("show");
  }

  function esconderMensagens() {
    erroBox.textContent = "";
    erroBox.classList.remove("show");
    sucessoBox.textContent = "";
    sucessoBox.classList.remove("show");
  }
});