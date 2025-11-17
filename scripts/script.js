/* ==========================================================
   SCRIPT REVISADO E CORRIGIDO - CARRINHO + PIX + PRODUTOS 
   ========================================================== */

   /* -------- UTILITÁRIOS GLOBAIS -------- */

// abrir WhatsApp
function openWhatsApp(msg = "Olá, tenho interesse no produto") {
  const telefone = "5511999999999"; // coloque seu número aqui
  const texto = encodeURIComponent(msg);
  window.open(`https://wa.me/${telefone}?text=${texto}`, "_blank");
}

// abrir Pix individual do card
function openPixFromButton(nome = "", preco = 0) {
  openPixModalFromCart(Number(preco) || 0);
}

/* ==============================================================
   ANO AUTOMÁTICO NO RODAPÉ
============================================================== */
document.getElementById("ano").textContent = new Date().getFullYear();




/* -------------------------------
   CARRINHO — GLOBAL
---------------------------------- */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItemsContainer || !cartTotalEl) return;

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


/* -------------------------------
   EVENTOS DO CARRINHO
---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const clearCart = document.getElementById("clearCart");
  const cartModal = document.getElementById("cartModal");

  if (openCart) openCart.onclick = () => cartModal.classList.add("active");
  if (closeCart) closeCart.onclick = () => cartModal.classList.remove("active");

  if (clearCart) {
    clearCart.onclick = () => {
      cart = [];
      renderCart();
    };
  }

  document.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderCart();
    }
  });

  renderCart();
});


/* -------------------------------
   BOTÕES “ADICIONAR AO CARRINHO”
---------------------------------- */

function attachBuyButtons() {
  document.querySelectorAll(".card .btn-buy").forEach(btn => {

    if (btn.dataset.bound === "1") return;

    btn.addEventListener("click", e => {
      const card = e.target.closest(".card");

      const nome = card.querySelector("h4")?.textContent.trim() || "Produto";
      const preco = Number(
        card.querySelector(".price").textContent
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".")
      ) || 0;

      cart.push({ nome, preco });
      saveCart();
      renderCart();
    });

    btn.dataset.bound = "1";
  });
}


// =========================
// CARREGAR PRODUTOS DO ADMIN
// =========================
function loadAdminProducts() {
  try {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    if (!produtos.length) return;

    const grid = document.querySelector(".grid");
    if (!grid) return;

    // Limita 4 produtos em destaque
    const destaques = produtos.slice(0, 4);

    destaques.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.imagem || "img/prod-placeholder.jpg"}" alt="${p.nome}">
        <h4>${p.nome}</h4>
        <div class="meta">
          <span class="tag">${p.categoria || ""}</span>
          <span class="price">R$ ${Number(p.preco).toFixed(2)}</span>
        </div>
        <div class="buy">
          <button class="btn" onclick="openWhatsApp('${p.nome}')">WhatsApp</button>
          <button class="btn btn-buy">Adicionar</button>
          <button class="btn secondary" onclick="openPixFromButton('${p.nome}', ${Number(p.preco)})">Pagar com Pix</button>
        </div>
      `;

      grid.appendChild(card);
    });

    // atualizar botões
    attachBuyButtons();

  } catch (err) {
    console.error("Erro ao carregar produtos do admin:", err);
  }
}



/* -------------------------------
   PIX — MANTIDO INTACTO
---------------------------------- */

const chavePix = "SUA_CHAVE_PIX_AQUI";
const nomeTitular = "Seu Nome";
const nomeLoja = "Loja Chic";

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
    "540" + valorFormatado.replace(".", "") +
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

function openPixModalFromCart(total) {
  const modal = document.getElementById("pixModal");
  const qrImg = document.getElementById("pixQR");
  const codeEl = document.getElementById("pixCode");
  const infoText = document.querySelector(".pix-info p");

  if (!modal) return;

  const payload = gerarPayloadPix(chavePix, nomeTitular, "SAOPAULO", total);
  codeEl.textContent = payload;

  gerarQRLocal(payload, base64 => {
    qrImg.src = base64;
  });

  infoText.textContent =
    total > 0
      ? "Após efetuar o pagamento do seu pedido, envie o comprovante."
      : "Use o QR Code abaixo para efetuar um pagamento via Pix.";

  modal.classList.add("open");
}


/* -------------------------------
   PIX — FINALIZAR COMPRA
---------------------------------- */

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


/* -------------------------------
   FECHAR MODAL PIX
---------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pixModal");
  if (!modal) return;

  const closeX = modal.querySelector(".close-pix");
  const closeBtn = document.getElementById("closePixMsg");

  if (closeX) closeX.onclick = () => modal.classList.remove("open");
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove("open");

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("open");
  });
});



