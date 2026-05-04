window._moeda = localStorage.getItem("moeda") || "€";

function abrirDefinicoes() {
  document.getElementById("modalDefinicoes").style.display = "flex";
  document.getElementById("selectMoeda").value = window._moeda;
}

function fecharDefinicoes() {
  document.getElementById("modalDefinicoes").style.display = "none";
}

document.getElementById("modalDefinicoes").addEventListener("click", function(e) {
  if (e.target === this) fecharDefinicoes();
});

function guardarMoeda() {
  window._moeda = document.getElementById("selectMoeda").value;
  localStorage.setItem("moeda", window._moeda);
  const msg = document.getElementById("moedaMsg");
  msg.style.display = "block";
  setTimeout(function() { msg.style.display = "none"; }, 2000);
  fecharDefinicoes();
  if (typeof carregar === "function") carregar();
  if (typeof carregarHistorico === "function") carregarHistorico();
}

function apagarTudo() {
  if (!confirm("Tens a CERTEZA que queres apagar TODOS os dados?\nEsta acao nao pode ser desfeita!")) return;
  if (!confirm("Ultima confirmacao — apagar tudo mesmo?")) return;
  apagarTodasTransacoes().then(function() {
    alert("Todos os dados foram apagados.");
    fecharDefinicoes();
    if (typeof carregar === "function") carregar();
    if (typeof carregarHistorico === "function") carregarHistorico();
  });
}
