function loadCategoryProducts(categoria) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  const filtrados = produtos.filter(p => 
  p.categoria?.toLowerCase().includes(categoria.toLowerCase())
);


  const grid = document.querySelector(".grid");

  if (!filtrados.length) {
    grid.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
    return;
  }

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <h4>${p.nome}</h4>
      <div class="meta">
        <span class="tag">${p.categoria}</span>
        <span class="price">R$ ${Number(p.preco).toFixed(2).replace(".",",")}</span>
      </div>
      <div class="buy">
        <button class="btn" onclick="openWhatsApp('${p.nome}')">WhatsApp</button>
        <button class="btn btn-buy">Adicionar</button>
        <button class="btn secondary" onclick="openPixFromButton('${p.nome}',${Number(p.preco)})">Pagar com Pix</button>
      </div>
    `;

    grid.appendChild(card);
  });

  attachBuyButtons();
}
