async function gerarRelatorio() {
  const inicio = document.querySelector("#inicio").value;
  const fim = document.querySelector("#fim").value;

  const tabela = document.querySelector("#tabela-relatorio");
  const totalEl = document.querySelector("#total");

  tabela.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">
        Carregando...
      </td>
    </tr>
  `;

  try {
    const dados = await getRelatorio(inicio, fim);

    tabela.innerHTML = "";

    if (!dados.length) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            Nenhum registro encontrado
          </td>
        </tr>
      `;
      totalEl.innerText = "Total: R$ 0.00";
      return;
    }

    let total = 0;

    dados.forEach(c => {
      const valor = parseFloat(c.valor_total || 0);
      total += valor;

      tabela.innerHTML += `
        <tr>
          <td>${c.cliente}</td>
          <td>${c.tipo_servico}</td>
          <td>${parseFloat(c.tempo_horas || 0).toFixed(2)}</td>
          <td class="text-success fw-semibold">
            R$ ${valor.toFixed(2)}
          </td>
        </tr>
      `;
    });

    totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;

  } catch (error) {
    console.error(error);

    tabela.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger">
          Erro ao carregar relatório
        </td>
      </tr>
    `;
  }
}