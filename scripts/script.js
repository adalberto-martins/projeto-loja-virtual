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
(function ensurePixModal(){
  if (document.getElementById("pixModal")) return;

  const div = document.createElement("div");
  div.id = "pixModal";
  div.classList.add("pix-modal");

  div.innerHTML = `
    <div class="pix-card">
      <button class="close-pix btn secondary" onclick="document.getElementById('pixModal').classList.remove('open')">✕</button>
      <h3>Pagamento via Pix</h3>
      <p style="color:var(--muted)">Aguarde, gerando código Pix...</p>

      <div class="qr">
        <img id="pixQR" src="" alt="QR Code Pix" width="220" height="220">
      </div>

      <div class="pix-code" id="pixCode"></div>

      <div class="pix-actions">
        <button class="btn copy-pix" id="copyPixBtn">Copiar PIX</button>
      </div>

      <div id="pixInfo" class="pix-info">
        <p>Após efetuar o pagamento, envie o comprovante.</p>
        <a href="https://wa.me/5511999999999" target="_blank" class="btn" id="btnComprovante">Enviar Comprovante</a>
        <button class="btn secondary" id="closePixMsg">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(div);

  div.addEventListener("click", (e) => {
    if (e.target === div) div.classList.remove("open");
  });

  document.getElementById("closePixMsg").onclick = () => {
    div.classList.remove("open");
  };
})();

/* -------------------------------
   Funções auxiliares do PIX
---------------------------------- */

function gerarPayloadPix(chave, nome, cidade, valor) {
  return `00020126580014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2,'0')}${chave}520400005303986540${valor.toFixed(2).replace('.','')}5802BR5925${nomeLoja}6009${cidade}6304ABCD`;
}

function gerarQRURL(payload) {
  return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(payload)}`;
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

  const payload = gerarPayloadPix(chavePix, nomeTitular, "SAOPAULO", totalValor);
  const qr = gerarQRURL(payload);

  qrImg.src = qr;
  codeEl.textContent = payload;

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

