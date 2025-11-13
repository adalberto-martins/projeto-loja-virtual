/* -------------------------------
   CARRINHO DE COMPRAS
---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const clearCart = document.getElementById("clearCart");
  const cartModal = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.nome}</span>
        <span>R$ ${item.preco.toFixed(2)}</span>
        <button class="btn secondary remove-item" data-index="${index}">x</button>
      `;
      cartItemsContainer.appendChild(div);
      total += item.preco;
    });

    cartTotalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    saveCart();
  }

  // Eventos principais
  openCart.addEventListener("click", () => cartModal.classList.add("active"));
  closeCart.addEventListener("click", () => cartModal.classList.remove("active"));
  clearCart.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderCart();
    }
  });

  // Botão "Adicionar" dos produtos
  document.querySelectorAll(".card .btn-buy").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".card");
      const nome = card.querySelector("h4")?.textContent || "Produto";
      const preco = parseFloat(
        card.querySelector(".price").textContent.replace("R$", "").replace(",", ".")
      );

      cart.push({ nome, preco });
      renderCart();
    });
  });

  renderCart();
});

/* -------------------------------
   PIX - MODAL + QR CODE
---------------------------------- */

// Configurações do PIX
const chavePix = "SUA_CHAVE_PIX_AQUI";
const nomeTitular = "Seu Nome";
const nomeLoja = "Loja Chic";


// Criar modal PIX automaticamente caso não exista




/* -------------------------------
   Funções auxiliares do PIX
---------------------------------- */

function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}

function gerarPayloadPix(chave, nome, cidade, valor) {
  const valorFormatado = valor.toFixed(2);

  const payload =
    "000201" +
    "010212" +
    "26580014BR.GOV.BCB.PIX01" +
    chave.length.toString().padStart(2, "0") +
    chave +
    "52040000" +
    "5303986" +
    "540" + valorFormatado.replace('.', '') +
    "5802BR" +
    "59" + nome.length.toString().padStart(2, "0") + nome +
    "60" + cidade.length.toString().padStart(2, "0") + cidade +
    "6304";

  const crc = crc16(payload);
  return payload + crc;
}

function gerarQRLocal(text, callback) {
  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, text, { width: 260 }, function () {
    callback(canvas.toDataURL());
  });
}

/* -------------------------------
   Função principal do PIX
---------------------------------- */
function openPixModalFromCart(totalValor) {
  const modal = document.getElementById("pixModal");
  const qrImg = document.getElementById("pixQR");
  const codeEl = document.getElementById("pixCode");
  const infoText = document.querySelector(".pix-info p");

  if (!modal) {
    console.error("Modal PIX não encontrado!");
    return;
  }

  function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}


  const payload = gerarPayloadPix(chavePix, nomeTitular, "SAOPAULO", totalValor);
  codeEl.textContent = payload;

  gerarQRLocal(payload, (imgBase64) => {
    qrImg.src = imgBase64;
  });

  if (totalValor > 0) {
    infoText.textContent = "Após efetuar o pagamento do seu pedido, envie o comprovante.";
  } else {
    infoText.textContent = "Use o QR Code abaixo para efetuar um pagamento direto via Pix.";
  }

  modal.classList.add("open");
}


/* -------------------------------
   PIX: Botão flutuante
---------------------------------- */
function openPixFromButton() {
  openPixModalFromCart(0);
}

// Liga botão "Finalizar com PIX" do carrinho
document.addEventListener("DOMContentLoaded", () => {
  const checkoutPixBtn = document.getElementById("checkoutPixBtn");

  if (checkoutPixBtn) {
    checkoutPixBtn.addEventListener("click", () => {
      const totalEl = document.getElementById("cartTotal");
      let total = parseFloat(
        totalEl.textContent.replace(/[^\d,.-]/g, "").replace(",", ".")
      );
      openPixModalFromCart(total);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("pixModal");

    // GARANTE que o botão X sempre fecha
    const closeX = modal.querySelector(".close-pix");
    closeX.onclick = () => modal.classList.remove("open");

    // GARANTE que o botão FECHAR funciona
    const closeBtn = document.getElementById("closePixMsg");
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove("open");
    }

    // Fechar ao clicar fora
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
    });
});

// === Carregar produtos do painel (localStorage) e injetar na grid ===
function loadAdminProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem('produtos')) || [];
    if (!stored.length) return;
    const grid = document.querySelector('.grid');
    if (!grid) return;
    // For each product, create card element
    stored.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.imagem || 'img/prod-placeholder.jpg'}" alt="${p.nome}">
        <h4>${p.nome}</h4>
        <div class="meta">
          <span class="tag">${p.categoria || ''}</span>
          <span class="price">R$ ${Number(p.preco).toFixed(2)}</span>
        </div>
        <div class="buy">
          <button class="btn" onclick="openWhatsApp(${p.nome})">WhatsApp</button>
          <button class="btn btn-buy">Adicionar</button>
          <button class="btn secondary" onclick="openPixFromButton('${p.nome},${Number(p.preco).toFixed(2).replace('.',',')}')">Pagar com Pix</button>
        </div>
      `;
      grid.appendChild(card);
    });
    // Re-attach buy button listeners
    attachBuyButtons();
  } catch (err) {
    console.error('Erro ao carregar produtos do painel:', err);
  }
}

// helper to attach buy listeners (used after dynamic injection)
function attachBuyButtons(){
  document.querySelectorAll('.card .btn-buy').forEach(btn => {
    // avoid attaching multiple listeners
    if (btn.dataset.bound === '1') return;
    btn.addEventListener('click', e => {
      const card = e.target.closest('.card');
      const nome = card.querySelector('h4')?.textContent || 'Produto';
      const precoText = card.querySelector('.price')?.textContent || 'R$ 0';
      const preco = parseFloat(precoText.replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
      // use same cart logic as main script expects
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ nome, preco });
      localStorage.setItem('cart', JSON.stringify(cart));
      // if cart modal exists, re-render by calling renderCart if present
      if (typeof renderCart === 'function') renderCart();
      // mark bound
    });
    btn.dataset.bound = '1';
  });
}

// call loader on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadAdminProducts();
});

