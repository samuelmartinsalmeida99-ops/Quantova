const CATEGORIAS_DESPESA = {
  "Alimentacao": "🍔",
  "Transporte": "🚗",
  "Compras": "🛍️",
  "Lazer": "🎮",
  "Saude": "💊",
  "Moradia": "🏠",
  "Educacao": "🎓",
  "Utilidades": "⚡",
  "Outros": "📦"
};

const CATEGORIAS_RECEITA = {
  "Salario": "💰",
  "Freelance": "💻",
  "Investimentos": "📈",
  "Outros": "📦"
};

function preencherCategorias(tipo) {
  const select = document.getElementById("categoria");
  const cats = tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  select.innerHTML = "";
  Object.entries(cats).forEach(function([nome, emoji]) {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = emoji + " " + nome;
    select.appendChild(opt);
  });
}

function setTipo(tipo) {
  document.getElementById("tipo").value = tipo;
  document.getElementById("btnDespesa").classList.toggle("active", tipo === "despesa");
  document.getElementById("btnReceita").classList.toggle("active", tipo === "receita");
  preencherCategorias(tipo);
}

document.getElementById("data").value = new Date().toISOString().split("T")[0];
preencherCategorias("despesa");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(function(e) { console.log("SW erro:", e); });
}

document.getElementById("formAdd").addEventListener("submit", async function(e) {
  e.preventDefault();
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  const descricao = document.getElementById("descricao").value || "";

  if (!valor || valor <= 0) { alert("Insere um valor válido."); return; }
  if (!categoria) { alert("Seleciona uma categoria."); return; }

  await adicionarTransacao({ valor, categoria, tipo, data, descricao });
  window.location.href = "index.html";
});