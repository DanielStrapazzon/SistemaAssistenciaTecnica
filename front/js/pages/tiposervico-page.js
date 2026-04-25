document.addEventListener("DOMContentLoaded", () => {
  console.log("TIPO SERVICO PAGE CARREGOU");
  carregarTipos();
});

async function carregarTipos() {
  const tabela = document.querySelector("#tabela-tiposervico");

  if (!tabela) {
    console.error("Tabela não encontrada");
    return;
  }

  try {
    const tipos = await getTipos();

    tabela.innerHTML = "";

    if (!tipos.length) {
      tabela.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">
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
          <td>${tipo.descricao}</td>
          <td>${tipo.tipo_cobranca}</td>
          <td>R$ ${parseFloat(tipo.valor).toFixed(2)}</td>
          <td class="text-center">
            <button class="btn btn-danger btn-sm"
              onclick="excluirTipo(${tipo.idtiposervico})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error(error);

    tabela.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
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
    alert("Preencha todos os campos");
    return;
  }

  try {
    await criarTipo({
      descricao,
      tipo_cobranca,
      valor: parseFloat(valor)
    });

    // fechar modal corretamente
    const modalEl = document.getElementById("modalTipo");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    // limpar campos
    document.querySelector("#descricao").value = "";
    document.querySelector("#valor").value = "";

    // recarregar tabela
    carregarTipos();

  } catch (error) {
    console.error(error);
    alert("Erro ao salvar");
  }
}

window.excluirTipo = async function(id) {
  if (!confirm("Deseja excluir este tipo de serviço?")) return;

  try {
    await fetch(`${API_BASE}/tipo-servico/${id}`, {
      method: "DELETE"
    });

    carregarTipos(); // recarrega a tabela

  } catch (error) {
    console.error(error);
    alert("Erro ao excluir");
  }
}