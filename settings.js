const MOEDAS_VALIDAS = ["EUR", "USD", "GBP", "BRL"];
const CATEGORIAS_VALIDAS = ["Alimentacao", "Transporte", "Compras", "Lazer", "Saude", "Moradia", "Educacao", "Utilidades", "Salario", "Freelance", "Investimentos", "Outros"];
function moedaGuardada() { const antiga = localStorage.getItem("moeda") || "EUR"; const antigas = { [String.fromCharCode(0x00e2, 0x201a, 0x00ac)]:"EUR", [String.fromCharCode(0x00c2, 0x00a3)]:"GBP" }; return ({ "€":"EUR", "$":"USD", "£":"GBP", "R$":"BRL", ...antigas })[antiga] || (MOEDAS_VALIDAS.includes(antiga) ? antiga : "EUR"); }
window._moeda = moedaGuardada();
function abrirDefinicoes() { const modal = document.getElementById("modalDefinicoes"); modal.hidden = false; modal.classList.add("visible"); document.getElementById("selectMoeda").value = window._moeda; }
function fecharDefinicoes() { const modal = document.getElementById("modalDefinicoes"); modal.classList.remove("visible"); modal.hidden = true; }
document.getElementById("modalDefinicoes").addEventListener("click", function(e) { if (e.target === this) fecharDefinicoes(); });
document.addEventListener("keydown", function(e) { if (e.key === "Escape") fecharDefinicoes(); });
function guardarMoeda() { window._moeda = document.getElementById("selectMoeda").value; localStorage.setItem("moeda", window._moeda); fecharDefinicoes(); if (typeof carregar === "function") carregar(); if (typeof carregarHistorico === "function") carregarHistorico(); }
function csvEscapar(valor) { return `"${String(valor ?? "").replaceAll('"', '""')}"`; }
async function exportarCSV() {
  const transacoes = await getTodasTransacoes();
  const linhas = [["id", "tipo", "valor", "categoria", "data", "descricao"], ...transacoes.map((t) => [t.id, t.tipo, Number(t.valor).toFixed(2), t.categoria, t.data, t.descricao || ""])];
  const conteudo = "\uFEFF" + linhas.map((l) => l.map(csvEscapar).join(";")).join("\r\n");
  descarregar(conteudo, "text/csv;charset=utf-8", `quantova-transacoes-${new Date().toISOString().slice(0,10)}.csv`);
}
async function exportarDados() {
  const backup = { app:"Quantova", version:1, exportedAt:new Date().toISOString(), currency:window._moeda, transactions:await getTodasTransacoes() };
  descarregar(JSON.stringify(backup, null, 2), "application/json", `quantova-backup-${new Date().toISOString().slice(0,10)}.json`);
}
function descarregar(conteudo, tipo, nome) {
  const url = URL.createObjectURL(new Blob([conteudo], { type:tipo })), a = document.createElement("a");
  a.href = url; a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function importarDados(input) {
  const ficheiro = input.files && input.files[0]; if (!ficheiro) return;
  try {
    const dados = JSON.parse(await ficheiro.text());
    if (dados.app !== "Quantova" || !Array.isArray(dados.transactions)) throw new Error("Ficheiro inválido.");
    const ids = new Set();
    const registos = dados.transactions.map((t) => {
      const id = Number(t.id), partesData = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(t.data || "");
      const dataLocal = partesData ? new Date(Number(partesData[1]), Number(partesData[2]) - 1, Number(partesData[3])) : null;
      const dataValida = Boolean(partesData && dataLocal.getFullYear() === Number(partesData[1]) && dataLocal.getMonth() + 1 === Number(partesData[2]) && dataLocal.getDate() === Number(partesData[3]));
      if (!Number.isSafeInteger(id) || id < 1 || ids.has(id) || !Number.isFinite(Number(t.valor)) || Number(t.valor) <= 0 || !["despesa", "receita"].includes(t.tipo) || !dataValida || !CATEGORIAS_VALIDAS.includes(t.categoria)) throw new Error("Uma ou mais transações estão inválidas.");
      ids.add(id);
      return { id:id, valor:Number(t.valor), tipo:t.tipo, data:t.data, categoria:t.categoria, descricao:String(t.descricao || "") };
    });
    if (!confirm(`A cópia contém ${registos.length} transações. A importação substituirá os dados atuais. Queres continuar?`)) { input.value = ""; return; }
    await substituirTodasTransacoes(registos);
    if (dados.currency && MOEDAS_VALIDAS.includes(dados.currency)) { window._moeda = dados.currency; localStorage.setItem("moeda", dados.currency); }
    fecharDefinicoes(); if (typeof carregar === "function") await carregar(); if (typeof carregarHistorico === "function") await carregarHistorico();
    alert("Cópia importada com sucesso.");
  } catch (e) { alert(`Não foi possível importar a cópia: ${e.message}`); }
  input.value = "";
}
function apagarTudo() {
  if (!confirm("Apagar permanentemente todas as transações deste dispositivo?")) return;
  apagarTodasTransacoes().then(function() { fecharDefinicoes(); if (typeof carregar === "function") carregar(); if (typeof carregarHistorico === "function") carregarHistorico(); });
}
