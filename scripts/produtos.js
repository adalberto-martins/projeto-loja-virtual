/* =======================================================
   Módulo Central de Produtos
   Armazena, atualiza e carrega produtos via localStorage.
   ======================================================= */

const STORAGE_KEY_PRODUTOS = "produtos";

/* ==============================
      Funções de armazenamento
   ============================== */

// Retorna todos os produtos salvos
function listarProdutos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUTOS)) || [];
}

// Salva lista completa no storage
function salvarListaCompleta(lista) {
  localStorage.setItem(STORAGE_KEY_PRODUTOS, JSON.stringify(lista));
}

// Adiciona produto novo
function salvarProduto(produto) {
  const lista = listarProdutos();
  lista.push(produto);
  salvarListaCompleta(lista);
  return true;
}

// Atualiza um produto pelo índice
function atualizarProduto(index, produtoAtualizado) {
  const lista = listarProdutos();
  if (!lista[index]) return false;
  lista[index] = produtoAtualizado;
  salvarListaCompleta(lista);
  return true;
}

// Remove um produto
function removerProduto(index) {
  const lista = listarProdutos();
  if (!lista[index]) return false;
  lista.splice(index, 1);
  salvarListaCompleta(lista);
  return true;
}

// Obtém um produto pelo índice
function obterProduto(index) {
  const lista = listarProdutos();
  return lista[index] || null;
}

/* ==============================
      Gerador de Card HTML
   ============================== */

function gerarCardHTML(produto) {
  const precoFmt = Number(produto.preco)
    .toFixed(2)
    .replace(".", ",");

  const nomeEsc = escapeHTML(produto.nome || "Produto");

  return `
    <div class="card">
      <img src="${produto.imagem || 'imagens/placeholder.webp'}" alt="${nomeEsc}">
      <h4>${nomeEsc}</h4>
      <div class="meta">
        <span class="tag">${escapeHTML(produto.categoria || "")}</span>
        <span class="price">R$ ${precoFmt}</span>
      </div>
      <div class="buy">
        <button class="btn" onclick="openWhatsApp('Quero comprar ${nomeEsc}')">WhatsApp</button>
        <button class="btn btn-buy">Adicionar</button>
        <button class="btn secondary" onclick="openPixFromButton('${nomeEsc}',${produto.preco})">Pagar com Pix</button>
      </div>
    </div>
  `;
}

// Evita quebra de layout e ataques simples
function escapeHTML(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ==============================
      Filtrar produtos recentes
      Para a seção Novidades
   ============================== */

function produtosRecentes(dias = 30) {
  const hoje = new Date();
  const lista = listarProdutos();

  return lista.filter((p) => {
    if (!p.criado_em) return false;
    const data = new Date(p.criado_em);
    const diffDias = (hoje - data) / (1000 * 60 * 60 * 24);
    return diffDias <= dias;
  });
}

/* ==============================
      Carregar produtos no grid
   ============================== */

function renderizarProdutosNaGrid(selector = ".grid") {
  const container = document.querySelector(selector);
  if (!container) return;

  const produtos = listarProdutos();
  container.innerHTML = "";

  produtos.forEach((p) => {
    container.insertAdjacentHTML("beforeend", gerarCardHTML(p));
  });

  // Reativa botões de compra após inserir cards
  if (typeof attachBuyButtons === "function") {
    attachBuyButtons();
  }
}

function renderizarNovidades(selector = "#novidadesGrid") {
  const container = document.querySelector(selector);
  if (!container) return;

  const recentes = produtosRecentes();
  container.innerHTML = "";

  recentes.forEach((p) => {
    container.insertAdjacentHTML("beforeend", gerarCardHTML(p));
  });

  if (typeof attachBuyButtons === "function") {
    attachBuyButtons();
  }
}

/* =======================================================
   FIM DO MÓDULO DE PRODUTOS
   ======================================================= */
