if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(function(e) { console.log("SW erro:", e); });
}

const CATEGORIAS = {
  "Alimentacao": "🍔", "Transporte": "🚗", "Compras": "🛍️",
  "Lazer": "🎮", "Saude": "💊", "Moradia": "🏠",
  "Educacao": "🎓", "Utilidades": "⚡", "Salario": "💰",
  "Freelance": "💻", "Investimentos": "📈", "Outros": "📦"
};

let todasTransacoes = [];
let filtroCategoria = "todas";

function getMoeda() { return window._moeda || "€"; }

async function carregarHistorico() {
  todasTransacoes = await getTodasTransacoes();
  renderHistorico();
}

function renderHistorico() {
  const lista = document.getElementById("listaHistorico");
  lista.innerHTML = "";
  const dados = todasTransacoes
    .filter(function(d) { return filtroCategoria === "todas" || d.categoria === filtroCategoria; })
    .sort(function(a, b) { return new Date(b.data) - new Date(a.data); });

  if (!dados.length) {
    lista.innerHTML = "<p style='color:#94a3b8;text-align:center;padding:20px;'>Sem transações.</p>";
    return;
  }

  const m = getMoeda();
  dados.forEach(function(d) {
    const dataFormatada = new Date(d.data).toLocaleDateString("pt-PT");
    const icone = CATEGORIAS[d.categoria] || "📦";
    const isReceita = d.tipo === "receita";
    const item = document.createElement("div");
    item.className = "hist-card";
    item.innerHTML = `
      <div class="hist-left">
        <div class="hist-icon">${icone}</div>
        <div class="hist-info">
          <span class="hist-cat">${d.categoria}${d.descricao ? " · " + d.descricao : ""}</span>
          <span class="hist-date">${dataFormatada}</span>
        </div>
      </div>
      <div class="hist-right">
        <span class="hist-valor" style="color:${isReceita ? '#22c55e' : '#ef4444'}">
          ${isReceita ? "+" : "-"}${m}${d.valor.toFixed(2)}
        </span>
        <button class="delete-btn" onclick="apagar(${d.id})">🗑</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

async function apagar(id) {
  if (!confirm("Apagar esta transação?")) return;
  await apagarTransacao(id);
  await carregarHistorico();
}

function filtrar(cat) {
  filtroCategoria = cat;
  document.querySelectorAll(".filtro-btn").forEach(function(b) { b.classList.remove("active"); });
  event.target.classList.add("active");
  renderHistorico();
}

window.addEventListener("load", carregarHistorico);