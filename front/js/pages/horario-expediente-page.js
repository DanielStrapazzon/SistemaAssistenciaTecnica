const DIAS = [
  { numero: 1, nome: "Segunda-feira" },
  { numero: 2, nome: "Terça-feira" },
  { numero: 3, nome: "Quarta-feira" },
  { numero: 4, nome: "Quinta-feira" },
  { numero: 5, nome: "Sexta-feira" },
  { numero: 6, nome: "Sábado" },
  { numero: 0, nome: "Domingo" },
];

let ehAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  carregar();

  document.addEventListener("usuario-autenticado", (event) => {
    ehAdmin = event.detail?.perfil === 1;
    atualizarPermissao();
  });

  document.querySelector("#btn-salvar").addEventListener("click", salvar);
});

async function carregar() {
  const container = document.querySelector("#dias-container");

  try {
    const expediente = await getHorarioExpediente();
    renderizarDias(expediente);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-danger">Não foi possível carregar o horário de expediente.</p>`;
  }
}

function renderizarDias(expediente) {
  const container = document.querySelector("#dias-container");

  container.innerHTML = DIAS.map(dia => {
    const periodos = expediente[dia.numero] || expediente[String(dia.numero)] || [];
    const aberto = periodos.length > 0;

    return `
      <div class="dia-linha" data-dia="${dia.numero}">
        <div class="dia-nome">${dia.nome}</div>
        <div class="dia-conteudo">
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" data-campo="aberto" id="aberto-${dia.numero}" ${aberto ? "checked" : ""}>
            <label class="form-check-label" for="aberto-${dia.numero}">Atende neste dia</label>
          </div>
          <div class="periodos-container" data-campo="periodos" style="${aberto ? "" : "display:none;"}">
            ${periodos.length > 0 ? periodos.map(p => linhaPeriodo(p.inicio, p.fim)).join("") : linhaPeriodo("08:00", "12:00")}
          </div>
          <button type="button" class="btn btn-link btn-add-periodo p-0" data-acao="add-periodo" style="${aberto ? "" : "display:none;"}">
            <i class="bi bi-plus-circle"></i> Adicionar período
          </button>
        </div>
      </div>
    `;
  }).join("");

  ligarEventos(container);
  atualizarPermissao();
}

function linhaPeriodo(inicio, fim) {
  return `
    <div class="periodo-linha">
      <input type="time" class="form-control form-control-sm" data-campo="inicio" value="${inicio}">
      <span class="text-muted">até</span>
      <input type="time" class="form-control form-control-sm" data-campo="fim" value="${fim}">
      <button type="button" class="btn-remover-periodo" data-acao="remover-periodo" title="Remover período">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `;
}

function ligarEventos(container) {
  container.querySelectorAll("[data-campo='aberto']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const linha = checkbox.closest(".dia-linha");
      const periodosContainer = linha.querySelector("[data-campo='periodos']");
      const btnAdd = linha.querySelector("[data-acao='add-periodo']");

      if (checkbox.checked) {
        periodosContainer.style.display = "";
        btnAdd.style.display = "";
        if (periodosContainer.children.length === 0) {
          periodosContainer.insertAdjacentHTML("beforeend", linhaPeriodo("08:00", "12:00"));
          ligarEventosPeriodo(periodosContainer.lastElementChild);
        }
      } else {
        periodosContainer.style.display = "none";
        btnAdd.style.display = "none";
      }
    });
  });

  container.querySelectorAll("[data-acao='add-periodo']").forEach(botao => {
    botao.addEventListener("click", () => {
      const linha = botao.closest(".dia-linha");
      const periodosContainer = linha.querySelector("[data-campo='periodos']");
      periodosContainer.insertAdjacentHTML("beforeend", linhaPeriodo("13:30", "17:30"));
      ligarEventosPeriodo(periodosContainer.lastElementChild);
    });
  });

  container.querySelectorAll(".periodo-linha").forEach(ligarEventosPeriodo);
}

function ligarEventosPeriodo(linhaPeriodoEl) {
  const btnRemover = linhaPeriodoEl.querySelector("[data-acao='remover-periodo']");
  if (!btnRemover) return;

  btnRemover.addEventListener("click", () => {
    const periodosContainer = linhaPeriodoEl.parentElement;
    linhaPeriodoEl.remove();

    if (periodosContainer.children.length === 0) {
      const diaLinha = periodosContainer.closest(".dia-linha");
      diaLinha.querySelector("[data-campo='aberto']").checked = false;
      periodosContainer.style.display = "none";
      diaLinha.querySelector("[data-acao='add-periodo']").style.display = "none";
    }
  });
}

function atualizarPermissao() {
  const btnSalvar = document.querySelector("#btn-salvar");
  const acessoNegado = document.querySelector("#acesso-negado");
  const container = document.querySelector("#dias-container");

  if (!ehAdmin) {
    if (btnSalvar) btnSalvar.style.display = "none";
    if (acessoNegado) acessoNegado.style.display = "block";
    container.querySelectorAll("input, button").forEach(el => el.disabled = true);
  } else {
    if (btnSalvar) btnSalvar.style.display = "";
    if (acessoNegado) acessoNegado.style.display = "none";
  }
}

function coletarDias() {
  const dias = {};

  document.querySelectorAll(".dia-linha").forEach(linha => {
    const numeroDia = linha.dataset.dia;
    const aberto = linha.querySelector("[data-campo='aberto']").checked;

    if (!aberto) {
      dias[numeroDia] = [];
      return;
    }

    const periodos = [];
    linha.querySelectorAll(".periodo-linha").forEach(periodoEl => {
      const inicio = periodoEl.querySelector("[data-campo='inicio']").value;
      const fim = periodoEl.querySelector("[data-campo='fim']").value;
      if (inicio && fim) periodos.push({ inicio, fim });
    });

    dias[numeroDia] = periodos;
  });

  return dias;
}

async function salvar() {
  const botao = document.querySelector("#btn-salvar");
  const dias = coletarDias();

  botao.disabled = true;
  botao.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Salvando...`;

  try {
    await salvarHorarioExpediente(dias);
    notify("Horário de expediente atualizado com sucesso.", "success");
  } catch (error) {
    console.error(error);
    notify(error.message || "Erro ao salvar horário de expediente.", "error");
  } finally {
    botao.disabled = false;
    botao.innerHTML = `<i class="bi bi-check2-circle"></i> Salvar horário de expediente`;
  }
}