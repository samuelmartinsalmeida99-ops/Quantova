const CATEGORIAS_DESPESA = {
  "Alimentação": "🍔",
  "Transporte": "🚗",
  "Compras": "🛍️",
  "Lazer": "🎮",
  "Saúde": "💊",
  "Moradia": "🏠",
  "Educação": "🎓",
  "Utilidades": "⚡",
  "Outros": "📦"
};

const CATEGORIAS_RECEITA = {
  "Salário": "💰",
  "Freelance": "💻",
  "Investimentos": "📈",
  "Outros": "📦"
};

function preencherCategorias(tipo) {
  const select = document.getElementById("categoria");
  const cats = tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  if (!select) return;

  select.innerHTML = "";

  Object.entries(cats).forEach(function ([nome, emoji]) {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = emoji + " " + nome;
    select.appendChild(opt);
  });
}

function setTipo(tipo) {
  const tipoInput = document.getElementById("tipo");
  const btnDespesa = document.getElementById("btnDespesa");
  const btnReceita = document.getElementById("btnReceita");

  if (tipoInput) tipoInput.value = tipo;

  if (btnDespesa) btnDespesa.classList.toggle("active", tipo === "despesa");
  if (btnReceita) btnReceita.classList.toggle("active", tipo === "receita");

  preencherCategorias(tipo);
}

function abrirProximoPasso(secaoAtual, proximaSecao) {
  const atual = document.querySelector(secaoAtual);
  const proxima = document.querySelector(proximaSecao);

  if (atual) atual.classList.add("fold-up");
  if (proxima) proxima.classList.remove("folded");
}

document.addEventListener("DOMContentLoaded", function () {
  const dataInput = document.getElementById("data");
  const btnDespesa = document.getElementById("btnDespesa");
  const btnReceita = document.getElementById("btnReceita");
  const form = document.getElementById("formAdd");

  if (dataInput) {
    dataInput.value = new Date().toISOString().split("T")[0];
  }

  preencherCategorias("despesa");

  if (btnDespesa) {
    btnDespesa.addEventListener("click", function () {
      setTipo("despesa");
    });
  }

  if (btnReceita) {
    btnReceita.addEventListener("click", function () {
      setTipo("receita");
    });
  }

  const nextTipo = document.querySelector(".next-tipo");
  const nextValor = document.querySelector(".next-valor");
  const nextDescricao = document.querySelector(".next-descricao");
  const nextData = document.querySelector(".next-data");

  if (nextTipo) {
    nextTipo.addEventListener("click", function () {
      const tipo = document.getElementById("tipo").value;

      if (!tipo) {
        alert("Seleciona despesa ou receita.");
        return;
      }

      abrirProximoPasso(".tipo-section", ".valor-section");
    });
  }

  if (nextValor) {
    nextValor.addEventListener("click", function () {
      const valor = parseFloat(document.getElementById("valor").value);

      if (!valor || valor <= 0) {
        alert("Insere um valor válido.");
        return;
      }

      abrirProximoPasso(".valor-section", ".descricao-section");
    });
  }

  if (nextDescricao) {
    nextDescricao.addEventListener("click", function () {
      abrirProximoPasso(".descricao-section", ".data-section");
    });
  }

  if (nextData) {
    nextData.addEventListener("click", function () {
      const data = document.getElementById("data").value;

      if (!data) {
        alert("Seleciona uma data.");
        return;
      }

      abrirProximoPasso(".data-section", ".categoria-section");
    });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const valor = parseFloat(document.getElementById("valor").value);
      const categoria = document.getElementById("categoria").value;
      const tipo = document.getElementById("tipo").value;
      const data = document.getElementById("data").value;
      const descricao = document.getElementById("descricao").value || "";

      if (!valor || valor <= 0) {
        alert("Insere um valor válido.");
        return;
      }

      if (!categoria) {
        alert("Seleciona uma categoria.");
        return;
      }

      if (!data) {
        alert("Seleciona uma data.");
        return;
      }

      const categoriaSection = document.querySelector(".categoria-section");
      const success = document.querySelector(".success");

      if (categoriaSection) categoriaSection.classList.add("fold-up");
      if (success) success.style.marginTop = "0px";

      setTimeout(async function () {
        await adicionarTransacao({
          valor,
          categoria,
          tipo,
          data,
          descricao
        });

        window.location.href = "index.html";
      }, 1200);
    });
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(function (e) {
      console.log("SW erro:", e);
    });
  }
});