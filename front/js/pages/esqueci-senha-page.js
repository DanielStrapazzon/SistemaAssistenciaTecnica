document.addEventListener("DOMContentLoaded", () => {
  const formEmail = document.querySelector("#form-email");
  const formCodigo = document.querySelector("#form-codigo");
  const linkReenviar = document.querySelector("#link-reenviar");

  let emailAtual = "";

  formEmail.addEventListener("submit", async (event) => {
    event.preventDefault();
    esconder("#erro-email");

    emailAtual = document.querySelector("#email").value.trim();

    if (!emailAtual) {
      mostrarErro("#erro-email", "Informe seu e-mail.");
      return;
    }

    await enviarCodigo(emailAtual, true);
  });

  linkReenviar.addEventListener("click", async (event) => {
    event.preventDefault();
    await enviarCodigo(emailAtual, false);
  });

  formCodigo.addEventListener("submit", async (event) => {
    event.preventDefault();
    esconder("#erro-codigo");
    esconder("#sucesso-codigo");

    const codigo = document.querySelector("#codigo").value.trim();
    const novaSenha = document.querySelector("#nova-senha").value;
    const confirmarSenha = document.querySelector("#confirmar-senha").value;

    if (!codigo || codigo.length !== 6) {
      mostrarErro("#erro-codigo", "Digite o código de 6 dígitos que enviamos por e-mail.");
      return;
    }

    if (novaSenha.length < 8) {
      mostrarErro("#erro-codigo", "A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarErro("#erro-codigo", "As senhas não coincidem.");
      return;
    }

    const btn = document.querySelector("#btn-redefinir");
    setCarregando(btn, true, "Redefinir senha", "bi-check2");

    try {
      const resposta = await fetch("/api/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAtual, codigo, novaSenha }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        mostrarErro("#erro-codigo", dados.erro || "Não foi possível redefinir a senha.");
        return;
      }

      mostrarSucesso("#sucesso-codigo", "Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => { window.location.href = "login.html"; }, 1800);
    } catch (error) {
      console.error(error);
      mostrarErro("#erro-codigo", "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(btn, false, "Redefinir senha", "bi-check2");
    }
  });

  async function enviarCodigo(email, primeiraVez) {
    const btn = document.querySelector("#btn-enviar-codigo");
    if (primeiraVez) setCarregando(btn, true, "Enviar código", "bi-arrow-right");

    try {
      const resposta = await fetch("/api/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 429) {
        mostrarErro(primeiraVez ? "#erro-email" : "#erro-codigo", dados.erro || "Muitas tentativas, aguarde um pouco.");
        return;
      }

      document.querySelector("#email-confirmado").textContent = email;
      document.querySelector("#etapa-email").style.display = "none";
      document.querySelector("#etapa-codigo").style.display = "block";

      if (!primeiraVez) {
        mostrarSucesso("#sucesso-codigo", "Se o e-mail existir, um novo código foi enviado.");
      }
    } catch (error) {
      console.error(error);
      mostrarErro(primeiraVez ? "#erro-email" : "#erro-codigo", "Não foi possível conectar ao servidor.");
    } finally {
      if (primeiraVez) setCarregando(btn, false, "Enviar código", "bi-arrow-right");
    }
  }

  function setCarregando(botao, carregando, textoNormal, iconeClasse) {
    botao.disabled = carregando;
    botao.innerHTML = carregando
      ? `<span class="spinner-border spinner-border-sm" role="status"></span> Enviando...`
      : `${textoNormal} <i class="bi ${iconeClasse}"></i>`;
  }

  function mostrarErro(seletor, mensagem) {
    const el = document.querySelector(seletor);
    el.textContent = mensagem;
    el.classList.add("show");
  }

  function mostrarSucesso(seletor, mensagem) {
    const el = document.querySelector(seletor);
    el.textContent = mensagem;
    el.classList.add("show");
  }

  function esconder(seletor) {
    const el = document.querySelector(seletor);
    el.textContent = "";
    el.classList.remove("show");
  }
});