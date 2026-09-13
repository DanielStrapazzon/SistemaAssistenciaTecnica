document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    if (!email || !senha) {
      alert("Preencha e-mail e senha para continuar.");
      return;
    }

    // TODO: conectar com a rota de autenticação real da API
    // (ex: fetch("/api/login", { method: "POST", body: JSON.stringify({ email, senha }) }))
    console.log("Tentativa de login:", { email });
  });
});