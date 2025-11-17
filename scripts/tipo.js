function loadTipoProdutos(tipo) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  let filtrados = [];

  if (tipo === "novidades") {
    filtrados = produtos.filter(p => p.novidade === true);
  }
  else if (tipo === "promocoes") {
    filtrados = produtos.filter(p => p.promocao === true);
  }

  const grid = document.querySelector(".grid");

  if (!filtrados.length) {
    grid.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  filtrados.forEach(p => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="meta">
          <h4>${p.nome}</h4>
          <div class="tag">${p.categoria}</div>
          <div class="price">R$ ${Number(p.preco).toFixed(2)}</div>
      </div>

      <div class="buy">
          <button class="btn" onclick="openWhatsApp('${p.nome}')">WhatsApp</button>
          <button class="btn btn-buy">Adicionar</button>
          <button class="btn secondary" onclick="openPixFromButton('${p.nome}', ${Number(p.preco)})">Pagar com Pix</button>
      </div>
    `;

    grid.appendChild(card);
  });

  attachBuyButtons();
}
