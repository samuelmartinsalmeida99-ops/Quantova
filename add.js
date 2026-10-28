const CATEGORIAS_DESPESA = ["Alimentacao", "Transporte", "Compras", "Lazer", "Saude", "Moradia", "Educacao", "Utilidades", "Outros"];
const CATEGORIAS_RECEITA = ["Salario", "Freelance", "Investimentos", "Outros"];
const ICONES = { Alimentacao:"🍽️", Transporte:"🚗", Compras:"🛍️", Lazer:"🎮", Saude:"🩺", Moradia:"🏠", Educacao:"🎓", Utilidades:"⚡", Salario:"💼", Freelance:"💻", Investimentos:"📈", Outros:"📦" };
const NOMES = { Alimentacao:"Alimentação", Saude:"Saúde", Educacao:"Educação", Utilidades:"Contas e utilidades", Salario:"Salário" };
const simbolos = { EUR:"€", USD:"$", GBP:"£", BRL:"R$" };
const params = new URLSearchParams(window.location.search);
const editarId = params.get("editar");
function hojeLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function preencherCategorias(tipo, selecionada) {
  const select = document.getElementById("categoria"), cats = tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  select.innerHTML = "";
  cats.forEach((nome) => { const opt = document.createElement("option"); opt.value = nome; opt.textContent = `${ICONES[nome]} ${NOMES[nome] || nome}`; select.appendChild(opt); });
  if (selecionada && cats.includes(selecionada)) select.value = selecionada;
}
function setTipo(tipo, selecionada) {
  document.getElementById("tipo").value = tipo;
  const despesa = tipo === "despesa";
  const botaoDespesa = document.getElementById("btnDespesa"), botaoReceita = document.getElementById("btnReceita");
  botaoDespesa.classList.toggle("active", despesa); botaoDespesa.classList.toggle("expense-active", despesa); botaoDespesa.setAttribute("aria-pressed", String(despesa));
  botaoReceita.classList.toggle("active", !despesa); botaoReceita.classList.toggle("income-active", !despesa); botaoReceita.setAttribute("aria-pressed", String(!despesa));
  const sinal = document.getElementById("amountSign");
  sinal.textContent = despesa ? "−" : "+";
  sinal.classList.toggle("expense-sign", despesa); sinal.classList.toggle("income-sign", !despesa);
  preencherCategorias(tipo, selecionada);
}
async function inicializarFormulario() {
  document.getElementById("data").value = hojeLocal();
  setTipo("despesa");
  document.getElementById("currencyPrefix").textContent = simbolos[window._moeda || "EUR"] || "€";
  if (editarId) {
    const registo = (await getTodasTransacoes()).find((item) => String(item.id) === editarId);
    if (!registo) { window.location.href = "historico.html"; return; }
    document.getElementById("formTitle").textContent = "Editar transação";
    document.getElementById("submitButton").textContent = "Guardar alterações";
    document.getElementById("valor").value = registo.valor;
    document.getElementById("descricao").value = registo.descricao || "";
    document.getElementById("data").value = registo.data;
    setTipo(registo.tipo, registo.categoria);
  }
}
document.getElementById("formAdd").addEventListener("submit", async (e) => {
  e.preventDefault();
  const valor = Number(document.getElementById("valor").value), categoria = document.getElementById("categoria").value;
  const tipo = document.getElementById("tipo").value, data = document.getElementById("data").value;
  const descricao = document.getElementById("descricao").value.trim();
  const erro = document.getElementById("formError");
  if (!Number.isFinite(valor) || valor <= 0 || !categoria || !data) { erro.textContent = "Confirma o valor, a data e a categoria."; erro.hidden = false; return; }
  try {
    const dados = { valor, categoria, tipo, data, descricao };
    if (editarId) { dados.id = Number(editarId); await atualizarTransacao(dados); }
    else await adicionarTransacao(dados);
    window.location.href = "historico.html";
  } catch (_) { erro.textContent = "Não foi possível guardar. Tenta novamente."; erro.hidden = false; }
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
window.addEventListener("load", inicializarFormulario);
