const CATEGORIAS = { Alimentacao: "🍽️", Transporte: "🚗", Compras: "🛍️", Lazer: "🎮", Saude: "🩺", Moradia: "🏠", Educacao: "🎓", Utilidades: "⚡", Salario: "💼", Freelance: "💻", Investimentos: "📈", Outros: "📦" };
const CORES = { Alimentacao: "#f28b62", Transporte: "#6ba8f3", Compras: "#df83b2", Lazer: "#78bd98", Saude: "#e27a85", Moradia: "#9b8be9", Educacao: "#65b7ce", Utilidades: "#56b5b0", Salario: "#67b897", Freelance: "#798fe2", Investimentos: "#5aa5b9", Outros: "#a38bc5" };
const NOMES_CATEGORIA = { Alimentacao: "Alimentação", Saude: "Saúde", Educacao: "Educação", Utilidades: "Contas e utilidades", Salario: "Salário" };
let chart;
let dataAtual = new Date();
function formatarMoeda(valor) { const moeda = window._moeda || "EUR"; return new Intl.NumberFormat("pt-PT", { style: "currency", currency: moeda, maximumFractionDigits: 2 }).format(valor || 0); }
function dataLocal(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }

async function carregar() {
  const data = await getTodasTransacoes();
  let totalDespesas = 0, totalReceitas = 0;
  const categoriasDespesas = {}, categoriasReceitas = {};
  data.forEach((d) => {
    const partes = String(d.data).split("-").map(Number);
    if (partes[0] !== dataAtual.getFullYear() || partes[1] !== dataAtual.getMonth() + 1) return;
    const valor = Number(d.valor) || 0;
    if (d.tipo === "receita") { totalReceitas += valor; categoriasReceitas[d.categoria] = (categoriasReceitas[d.categoria] || 0) + valor; }
    else { totalDespesas += valor; categoriasDespesas[d.categoria] = (categoriasDespesas[d.categoria] || 0) + valor; }
  });
  const saldo = totalReceitas - totalDespesas;
  document.getElementById("total").textContent = `-${formatarMoeda(totalDespesas)}`;
  document.getElementById("total").classList.add("expense-total");
  document.getElementById("receitas").textContent = `+${formatarMoeda(totalReceitas)}`;
  document.getElementById("receitas").classList.add("income-total");
  document.getElementById("saldo").textContent = formatarMoeda(saldo);
  document.getElementById("saldo").classList.toggle("negative", saldo < 0);
  document.getElementById("saldoNota").textContent = saldo < 0 ? "Gastaste mais do que recebeste" : "Saldo positivo";
  const categoriaPrincipal = Object.entries(categoriasDespesas).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("topCategoria").textContent = categoriaPrincipal ? (NOMES_CATEGORIA[categoriaPrincipal[0]] || categoriaPrincipal[0]) : "—";
  document.getElementById("topCategoriaNota").textContent = categoriaPrincipal ? `${formatarMoeda(categoriaPrincipal[1])} · ${Math.round(categoriaPrincipal[1] / totalDespesas * 100)}% das despesas` : "Ainda sem despesas neste mês";
  renderLista(categoriasDespesas, totalDespesas, "lista", false);
  renderLista(categoriasReceitas, totalReceitas, "listaReceitas", true);
  atualizarData();
}

function renderLista(categorias, total, elId, receita) {
  const lista = document.getElementById(elId);
  lista.innerHTML = "";
  if (!receita) { renderDistribuicaoDespesas(categorias, total, lista); return; }
  if (!Object.keys(categorias).length) { lista.innerHTML = `<div class="empty-state"><span>${receita ? "↙" : "◌"}</span><p>${receita ? "Ainda não há receitas neste mês." : "Ainda não há despesas neste mês."}</p></div>`; return; }
  Object.keys(categorias).sort((a, b) => categorias[b] - categorias[a]).forEach((cat) => {
    const valor = categorias[cat], percent = total ? (valor / total) * 100 : 0;
    const div = document.createElement("div"); div.className = "category-row";
    div.innerHTML = `<span class="category-icon" style="--category-color:${CORES[cat] || "#a38bc5"}">${CATEGORIAS[cat] || "📦"}</span><div class="category-main"><div class="category-top"><span>${NOMES_CATEGORIA[cat] || cat}</span><strong>${formatarMoeda(valor)}</strong></div><div class="category-track"><i style="width:${percent}%;--category-color:${receita ? "#64b995" : (CORES[cat] || "#a38bc5")}"></i></div></div><span class="category-percent">${Math.round(percent)}%</span>`;
    lista.appendChild(div);
  });
}

function renderDistribuicaoDespesas(categorias, total, container) {
  const entradas = Object.keys(categorias).sort((a, b) => categorias[b] - categorias[a]);
  if (!entradas.length) { container.innerHTML = `<div class="empty-state"><span>◌</span><p>Ainda não há despesas neste mês.</p></div>`; return; }
  let acumulado = 0;
  const segmentos = entradas.map((cat) => {
    const inicio = acumulado, percentagem = total ? categorias[cat] / total * 100 : 0;
    acumulado += percentagem;
    return `${CORES[cat] || "#a38bc5"} ${inicio.toFixed(2)}% ${acumulado.toFixed(2)}%`;
  }).join(", ");
  const donut = document.createElement("div"); donut.className = "expense-donut";
  donut.innerHTML = `<div class="donut-ring" style="background:conic-gradient(${segmentos})"><div class="donut-center"><span>Total de despesas</span><strong>${formatarMoeda(total)}</strong><small>${entradas.length} ${entradas.length === 1 ? "categoria" : "categorias"}</small></div></div><div class="donut-legend"></div>`;
  const legend = donut.querySelector(".donut-legend");
  entradas.forEach((cat) => {
    const linha = document.createElement("div"); linha.className = "legend-row";
    const bullet = document.createElement("i"); bullet.style.background = CORES[cat] || "#a38bc5";
    const nome = document.createElement("span"); nome.className = "legend-name"; nome.textContent = NOMES_CATEGORIA[cat] || cat;
    const percentagem = total ? Math.round(categorias[cat] / total * 100) : 0;
    const percent = document.createElement("span"); percent.className = "legend-percent"; percent.textContent = `${percentagem}%`;
    const valor = document.createElement("strong"); valor.textContent = formatarMoeda(categorias[cat]);
    linha.append(bullet, nome, percent, valor); legend.appendChild(linha);
  });
  container.replaceChildren(donut);
}

function atualizarData() {
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const selecionado = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, "0")}`;
  document.getElementById("dataAtual").textContent = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(dataAtual);
  document.getElementById("nextMonth").disabled = selecionado >= mesAtual;
}
function mesAnterior() { fecharSeletorMes(); dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1); carregar(); }
function mesSeguinte() { if (!document.getElementById("nextMonth").disabled) { fecharSeletorMes(); dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1); carregar(); } }
let anoSeletorMes = dataAtual.getFullYear();
const nomesMeses = Array.from({ length: 12 }, (_, mes) => new Intl.DateTimeFormat("pt-PT", { month: "long" }).format(new Date(2024, mes, 1)));
function abrirSeletorMes() {
  const popover = document.getElementById("monthPopover");
  if (!popover.hidden) { fecharSeletorMes(); return; }
  anoSeletorMes = dataAtual.getFullYear();
  popover.hidden = false;
  document.getElementById("monthPickerButton").setAttribute("aria-expanded", "true");
  renderizarMeses();
}
function fecharSeletorMes() { document.getElementById("monthPopover").hidden = true; document.getElementById("monthPickerButton").setAttribute("aria-expanded", "false"); }
function renderizarMeses() {
  const agora = new Date(), grade = document.getElementById("monthGrid");
  document.getElementById("yearLabel").textContent = anoSeletorMes;
  document.getElementById("yearPrevious").disabled = anoSeletorMes <= 1970;
  document.getElementById("yearNext").disabled = anoSeletorMes >= agora.getFullYear();
  grade.replaceChildren();
  nomesMeses.forEach((nome, indice) => {
    const botao = document.createElement("button"); botao.type = "button"; botao.className = "month-option"; botao.textContent = nome;
    if (anoSeletorMes === dataAtual.getFullYear() && indice === dataAtual.getMonth()) botao.classList.add("selected");
    botao.disabled = anoSeletorMes > agora.getFullYear() || (anoSeletorMes === agora.getFullYear() && indice > agora.getMonth());
    botao.addEventListener("click", () => { dataAtual = new Date(anoSeletorMes, indice, 1); fecharSeletorMes(); carregar(); });
    grade.appendChild(botao);
  });
}
document.getElementById("yearPrevious").addEventListener("click", () => { if (anoSeletorMes > 1970) { anoSeletorMes--; renderizarMeses(); } });
document.getElementById("yearNext").addEventListener("click", () => { if (anoSeletorMes < new Date().getFullYear()) { anoSeletorMes++; renderizarMeses(); } });
document.addEventListener("click", (event) => { if (!event.target.closest(".month-switch")) fecharSeletorMes(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") fecharSeletorMes(); });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => { });
window.addEventListener("load", carregar);
