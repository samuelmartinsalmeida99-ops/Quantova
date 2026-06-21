const MIGRAR = {
  "Alimentacao": "Alimentação",
  "Saude": "Saúde",
  "Educacao": "Educação",
  "Salario": "Salário"
};

const CATEGORIAS = {
  "Alimentação": "🍔", "Transporte": "🚗", "Compras": "🛍️",
  "Lazer": "🎮", "Saúde": "💊", "Moradia": "🏠",
  "Educação": "🎓", "Utilidades": "⚡", "Salário": "💰",
  "Freelance": "💻", "Investimentos": "📈", "Outros": "📦"
};
const CORES = {
  "Alimentação": "#f97316", "Transporte": "#3b82f6", "Compras": "#ec4899",
  "Lazer": "#22c55e", "Saúde": "#e11d48", "Moradia": "#8b5cf6",
  "Educação": "#0ea5e9", "Utilidades": "#06b6d4", "Salário": "#10b981",
  "Freelance": "#6366f1", "Investimentos": "#0284c7", "Outros": "#a855f7"
};

let chart;
let dataAtual = new Date();

function getMoeda() { return window._moeda || "€"; }
function getDiasNoMes(ano, mes) { return new Date(ano, mes + 1, 0).getDate(); }
function normalizarCategoria(cat) { return MIGRAR[cat] || cat; }

async function carregar() {
  const data = await getTodasTransacoes();
  let totalDespesas = 0, totalReceitas = 0;
  let categoriasDespesas = {}, categoriasReceitas = {};
  const diasNoMes = getDiasNoMes(dataAtual.getFullYear(), dataAtual.getMonth());

  data.forEach(function(d) {
    const dData = new Date(d.data);
    if (dData.getMonth() !== dataAtual.getMonth() || dData.getFullYear() !== dataAtual.getFullYear()) return;
    const cat = normalizarCategoria(d.categoria);
    if (d.tipo === "receita") {
      totalReceitas += d.valor;
      if (!categoriasReceitas[cat]) categoriasReceitas[cat] = 0;
      categoriasReceitas[cat] += d.valor;
    } else {
      totalDespesas += d.valor;
      if (!categoriasDespesas[cat]) categoriasDespesas[cat] = 0;
      categoriasDespesas[cat] += d.valor;
    }
  });

  const saldo = totalReceitas - totalDespesas;
  const m = getMoeda();
  document.getElementById("total").textContent = m + totalDespesas.toFixed(2);
  document.getElementById("receitas").textContent = m + totalReceitas.toFixed(2);
  document.getElementById("saldo").textContent = m + saldo.toFixed(2);
  document.getElementById("saldo").style.color = saldo >= 0 ? "#22c55e" : "#ef4444";
  document.getElementById("count").textContent = Object.keys(categoriasDespesas).length;
  const topCat = Object.keys(categoriasDespesas).sort(function(a, b) { return categoriasDespesas[b] - categoriasDespesas[a]; })[0];
  document.getElementById("media").textContent = topCat ? (CATEGORIAS[topCat] || "📦") + " " + topCat : "—";
  atualizarGrafico(categoriasDespesas, totalDespesas);
  renderLista(categoriasDespesas, totalDespesas, "lista", null);
  renderLista(categoriasReceitas, totalReceitas, "listaReceitas", "#22c55e");
  atualizarData();
}

function atualizarGrafico(categoriasDespesas, totalDespesas) {
  const ctx = document.getElementById("chartCanvas");
  if (chart) chart.destroy();

  const categorias = Object.keys(categoriasDespesas);

  if (!categorias.length) {
    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Sem dados"],
        datasets: [{ data: [1], backgroundColor: ["#e2e8f0"], borderWidth: 0 }]
      },
      options: {
        cutout: "70%",
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
    return;
  }

  const m = getMoeda();
  const valores = categorias.map(function(c) { return categoriasDespesas[c]; });
  const cores = categorias.map(function(c) { return CORES[c] || "#a855f7"; });

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categorias,
      datasets: [{ data: valores, backgroundColor: cores, borderWidth: 2, borderColor: "#ffffff" }]
    },
    options: {
      cutout: "68%",
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#64748b", font: { size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const valor = context.parsed;
              const percent = totalDespesas ? ((valor / totalDespesas) * 100).toFixed(1) : 0;
              return " " + m + valor.toFixed(2) + "  (" + percent + "%)";
            }
          }
        }
      }
    },
    plugins: [{
      id: "centro",
      beforeDraw: function(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const cx = (chartArea.left + chartArea.right) / 2;
        const cy = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(m + totalDespesas.toFixed(2), cx, cy - 10);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px sans-serif";
        ctx.fillText("despesas", cx, cy + 10);
        ctx.restore();
      }
    }]
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