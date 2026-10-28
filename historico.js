const CATEGORIAS = { Alimentacao:"🍽️", Transporte:"🚗", Compras:"🛍️", Lazer:"🎮", Saude:"🩺", Moradia:"🏠", Educacao:"🎓", Utilidades:"⚡", Salario:"💼", Freelance:"💻", Investimentos:"📈", Outros:"📦" };
const NOMES_CATEGORIA = { Alimentacao:"Alimentação", Saude:"Saúde", Educacao:"Educação", Utilidades:"Contas e utilidades", Salario:"Salário" };
let todasTransacoes = [];
const moedaSimbolo = { EUR:"€", USD:"$", GBP:"£", BRL:"R$" };
function fmt(valor) { return new Intl.NumberFormat("pt-PT", { style:"currency", currency:window._moeda || "EUR" }).format(Number(valor) || 0); }
function formatarData(data) { const [ano, mes, dia] = data.split("-").map(Number); return new Intl.DateTimeFormat("pt-PT", { day:"numeric", month:"short", year:"numeric" }).format(new Date(ano, mes-1, dia)); }
function montarFiltros() {
  const select = document.getElementById("filtroCategoria");
  Object.keys(CATEGORIAS).forEach((nome) => { const op = document.createElement("option"); op.value = nome; op.textContent = `${CATEGORIAS[nome]} ${NOMES_CATEGORIA[nome] || nome}`; select.appendChild(op); });
}
async function carregarHistorico() { todasTransacoes = await getTodasTransacoes(); renderHistorico(); }
function renderHistorico() {
  const pesquisa = document.getElementById("pesquisa").value.trim().toLocaleLowerCase("pt-PT");
  const tipo = document.getElementById("filtroTipo").value, categoria = document.getElementById("filtroCategoria").value;
  const inicio = document.getElementById("dataInicio").value, fim = document.getElementById("dataFim").value;
  const dados = todasTransacoes.filter((d) => {
    const texto = `${d.categoria} ${d.descricao || ""}`.toLocaleLowerCase("pt-PT");
    return (!pesquisa || texto.includes(pesquisa)) && (tipo === "todos" || d.tipo === tipo) && (categoria === "todas" || d.categoria === categoria) && (!inicio || d.data >= inicio) && (!fim || d.data <= fim);
  }).sort((a, b) => b.data.localeCompare(a.data) || Number(b.id) - Number(a.id));
  const lista = document.getElementById("listaHistorico"); lista.innerHTML = "";
  const despesas = dados.filter((d) => d.tipo !== "receita").reduce((n, d) => n + Number(d.valor), 0);
  const receitas = dados.filter((d) => d.tipo === "receita").reduce((n, d) => n + Number(d.valor), 0);
  document.getElementById("resultadoCount").textContent = `${dados.length} ${dados.length === 1 ? "transação" : "transações"}`;
  document.getElementById("resultadoTotal").textContent = `Saldo filtrado ${fmt(receitas - despesas)}`;
  if (!dados.length) { lista.innerHTML = `<div class="empty-state history-empty"><span>⌕</span><p>${todasTransacoes.length ? "Não encontrámos transações com estes filtros." : "Ainda não tens transações. Regista a primeira para começares."}</p>${todasTransacoes.length ? "" : '<a class="button button-primary" href="./add.html">＋ Nova transação</a>'}</div>`; return; }
  dados.forEach((d) => {
    const receita = d.tipo === "receita", article = document.createElement("article"); article.className = "transaction-row";
    const icon = document.createElement("span"); icon.className = "transaction-icon"; icon.textContent = CATEGORIAS[d.categoria] || "📦";
    const detail = document.createElement("div"); detail.className = "transaction-detail";
    const title = document.createElement("strong"); title.textContent = d.descricao || d.categoria;
    const meta = document.createElement("span"); meta.textContent = `${NOMES_CATEGORIA[d.categoria] || d.categoria} · ${formatarData(d.data)}`;
    detail.append(title, meta);
    const amount = document.createElement("strong"); amount.className = `transaction-amount ${receita ? "income-text" : "expense-text"}`; amount.textContent = `${receita ? "+" : "−"}${fmt(d.valor)}`;
    const actions = document.createElement("div"); actions.className = "transaction-actions";
    const edit = document.createElement("a"); edit.className = "row-action"; edit.href = `./add.html?editar=${encodeURIComponent(d.id)}`; edit.title = "Editar transação"; edit.setAttribute("aria-label", "Editar transação"); edit.textContent = "✎";
    const del = document.createElement("button"); del.className = "row-action delete-action"; del.title = "Apagar transação"; del.setAttribute("aria-label", "Apagar transação"); del.textContent = "×"; del.addEventListener("click", () => apagar(d.id));
    actions.append(edit, del); article.append(icon, detail, amount, actions); lista.appendChild(article);
  });
}
async function apagar(id) { if (!confirm("Apagar esta transação? Esta ação não pode ser desfeita.")) return; await apagarTransacao(Number(id)); await carregarHistorico(); }
function limparFiltros() { document.getElementById("pesquisa").value = ""; document.getElementById("filtroTipo").value = "todos"; document.getElementById("filtroCategoria").value = "todas"; document.getElementById("dataInicio").value = ""; document.getElementById("dataFim").value = ""; renderHistorico(); }
document.getElementById("pesquisa").addEventListener("input", renderHistorico);
["filtroTipo", "filtroCategoria", "dataInicio", "dataFim"].forEach((id) => document.getElementById(id).addEventListener("change", renderHistorico));
document.getElementById("limparFiltros").addEventListener("click", limparFiltros);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
window.addEventListener("load", () => { montarFiltros(); carregarHistorico(); });
