const CATEGORIAS = {
  "Alimentacao": "🍔", "Transporte": "🚗", "Compras": "🛍️",
  "Lazer": "🎮", "Saude": "💊", "Moradia": "🏠",
  "Educacao": "🎓", "Utilidades": "⚡", "Salario": "💰",
  "Freelance": "💻", "Investimentos": "📈", "Outros": "📦"
};
const CORES = {
  "Alimentacao": "#f97316", "Transporte": "#3b82f6", "Compras": "#ec4899",
  "Lazer": "#22c55e", "Saude": "#e11d48", "Moradia": "#8b5cf6",
  "Educacao": "#0ea5e9", "Utilidades": "#06b6d4", "Salario": "#10b981",
  "Freelance": "#6366f1", "Investimentos": "#0284c7", "Outros": "#a855f7"
};

let chart;
let dataAtual = new Date();

function getMoeda() { return window._moeda || "€"; }
function getDiasNoMes(ano, mes) { return new Date(ano, mes + 1, 0).getDate(); }

async function carregar() {
  const data = await getTodasTransacoes();
  let totalDespesas = 0, totalReceitas = 0;
  let categoriasDespesas = {}, categoriasReceitas = {};
  const diasNoMes = getDiasNoMes(dataAtual.getFullYear(), dataAtual.getMonth());
  let dias = Array(diasNoMes).fill(0);

  data.forEach(function(d) {
    const dData = new Date(d.data);
    if (dData.getMonth() !== dataAtual.getMonth() || dData.getFullYear() !== dataAtual.getFullYear()) return;
    if (d.tipo === "receita") {
      totalReceitas += d.valor;
      if (!categoriasReceitas[d.categoria]) categoriasReceitas[d.categoria] = 0;
      categoriasReceitas[d.categoria] += d.valor;
    } else {
      totalDespesas += d.valor;
      if (!categoriasDespesas[d.categoria]) categoriasDespesas[d.categoria] = 0;
      categoriasDespesas[d.categoria] += d.valor;
      dias[dData.getDate() - 1] += d.valor;
    }
  });

  const saldo = totalReceitas - totalDespesas;
  const m = getMoeda();
  document.getElementById("total").textContent = m + totalDespesas.toFixed(2);
  document.getElementById("receitas").textContent = m + totalReceitas.toFixed(2);
  document.getElementById("saldo").textContent = m + saldo.toFixed(2);
  document.getElementById("saldo").style.color = saldo >= 0 ? "#22c55e" : "#ef4444";
  document.getElementById("count").textContent = Object.keys(categoriasDespesas).length;
  document.getElementById("media").textContent = totalDespesas ? m + (totalDespesas / diasNoMes).toFixed(2) : m + "0";
  atualizarGrafico(dias, diasNoMes);
  renderLista(categoriasDespesas, totalDespesas, "lista", null);
  renderLista(categoriasReceitas, totalReceitas, "listaReceitas", "#22c55e");
  atualizarData();
}

function atualizarGrafico(dados, diasNoMes) {
  const ctx = document.getElementById("chartCanvas");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Array.from({ length: diasNoMes }, function(_, i) { return i + 1; }),
      datasets: [{ data: dados, backgroundColor: "#6366f1", borderRadius: 6, maxBarThickness: 20 }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
        y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#94a3b8" } }
      }
    }
  });
}

function renderLista(categorias, total, elId, cor) {
  const lista = document.getElementById(elId);
  if (!lista) return;
  lista.innerHTML = "";
  if (!Object.keys(categorias).length) {
    lista.innerHTML = "<p style='color:#94a3b8;text-align:center;padding:20px;'>Sem registos este mês.</p>";
    return;
  }
  const m = getMoeda();
  Object.keys(categorias).sort(function(a, b) { return categorias[b] - categorias[a]; }).forEach(function(cat) {
    const valor = categorias[cat];
    let percent = total ? (valor / total) * 100 : 0;
    if (percent > 0 && percent < 5) percent = 5;
    const corBarra = cor || CORES[cat] || "#a855f7";
    const div = document.createElement("div");
    div.className = "categoria-item";
    div.innerHTML = `
      <div class="categoria-header">
        <div class="cat-left">
          <div class="cat-icon">${CATEGORIAS[cat] || "📦"}</div>
          <span>${cat}</span>
        </div>
        <div class="cat-right">${m}${valor.toFixed(2)} <span class="percent">${percent.toFixed(0)}%</span></div>
      </div>
      <div class="barra"><div class="barra-fill" style="width:${percent}%;background:${corBarra};"></div></div>
    `;
    lista.appendChild(div);
  });
}

function atualizarData() {
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const el = document.getElementById("dataAtual");
  if (el) el.textContent = meses[dataAtual.getMonth()] + " " + dataAtual.getFullYear();
}

function mesAnterior() { dataAtual.setMonth(dataAtual.getMonth() - 1); carregar(); }
function mesSeguinte() { dataAtual.setMonth(dataAtual.getMonth() + 1); carregar(); }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(function(e) { console.log("SW erro:", e); });
}

window.addEventListener("load", carregar);