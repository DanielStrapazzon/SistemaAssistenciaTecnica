document.addEventListener("DOMContentLoaded", () => {
  carregarTipos();
});

async function carregarTipos() {
  const tabela = document.querySelector("#tabela-tiposervico");

  if (!tabela) {
    console.error("Tabela nao encontrada");
    return;
  }

  tabela.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-muted py-4">
        Carregando servicos...
      </td>
    </tr>
  `;

  try {
    const tipos = await getTipos();

    tabela.innerHTML = "";

    if (!tipos.length) {
      tabela.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            Nenhum tipo cadastrado
          </td>
        </tr>
      `;
      return;
    }

    tipos.forEach(tipo => {
      tabela.innerHTML += `
        <tr>
          <td>${tipo.idtiposervico}</td>
          <td class="fw-semibold">${tipo.descricao}</td>
          <td><span class="badge-soft">${tipo.tipo_cobranca}</span></td>
          <td class="fw-semibold">R$ ${parseFloat(tipo.valor).toFixed(2)}</td>
          <td class="text-center">
            <button class="btn btn-outline-danger btn-sm"
              onclick="excluirTipo(${tipo.idtiposervico})">
              <i class="bi bi-trash3 me-1"></i>Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
    notify("Erro ao carregar tipos de servico.", "error");

    tabela.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Erro ao carregar dados
        </td>
      </tr>
    `;
  }
}

async function salvarTipo() {
  const descricao = document.querySelector("#descricao").value.trim();
  const tipo_cobranca = document.querySelector("#tipo_cobranca").value;
  const valor = document.querySelector("#valor").value;

  if (!descricao || !valor) {
    notify("Preencha descricao e valor.", "warning");
    return;
  }

  try {
    await criarTipo({
      descricao,
      tipo_cobranca,
      valor: parseFloat(valor)
    });

    const modalEl = document.getElementById("modalTipo");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    document.querySelector("#descricao").value = "";
    document.querySelector("#valor").value = "";

    notify("Tipo de servico salvo com sucesso.", "success");
    carregarTipos();
  } catch (error) {
    console.error(error);
    notify("Erro ao salvar tipo de servico.", "error");
  }
}

window.excluirTipo = async function(id) {
  const confirmado = await confirmAction({
    title: "Excluir tipo de servico",
    message: "Esta acao remove o tipo selecionado da tabela de servicos.",
    confirmText: "Excluir",
    danger: true
  });

  if (!confirmado) return;

  try {
    await fetch(`${API_BASE}/tipo-servico/${id}`, {
      method: "DELETE"
    });

    notify("Tipo de servico excluido.", "success");
    carregarTipos();
  } catch (error) {
    console.error(error);
    notify("Erro ao excluir tipo de servico.", "error");
  }
}
