document.getElementById('ano').textContent = new Date().getFullYear();


function openWhatsApp(msg){
const phone = '5511999999999'; // substitua pelo número real (formato internacional sem +)
const text = encodeURIComponent(msg);
const url = `https://wa.me/${phone}?text=${text}`;
window.open(url,'_blank');
}


function closeModal(){
const modal = document.getElementById('modal');
modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeNav = document.getElementById('closeNav') || mobileNav.querySelector('.close');

  function openMenu() {
    mobileNav.style.display = 'flex';
    mobileNav.getBoundingClientRect();
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    // garantir que o browser aplique o estilo inicial antes de abrir (force reflow)
    mobileNav.getBoundingClientRect();
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    setTimeout(() => {mobileNav.style.display = 'none';}, 300);
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  closeNav && closeNav.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // fechar ao clicar fora (verifica se menu está aberto)
  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('open')) return;
    if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  });

  // fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });
});

// === Scroll suave e destaque dinâmico ===
document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  const sections = document.querySelectorAll("section[id]");

  // Rolagem suave ao clicar
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // ajusta para não cobrir o header
          behavior: "smooth"
        });
      }
      // Fechar menu mobile se estiver aberto
      const mobileNav = document.getElementById("mobileNav");
      if (mobileNav.classList.contains("open")) {
        mobileNav.classList.remove("open");
        document.getElementById("hamburger").classList.remove("open");
      }
    });
  });

  // Atualiza o destaque do menu conforme rolagem
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionTop = current.offsetTop - 100;
      const sectionHeight = current.offsetHeight;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector("nav a.active")
          ?.classList.remove("active");
        document
          .querySelector(`nav a[href*=${sectionId}]`)
          ?.classList.add("active");
      }
    });
  });
});

// === Carrinho de Compras (localStorage) ===
document.addEventListener("DOMContentLoaded", () => {
  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const clearCart = document.getElementById("clearCart");
  const cartModal = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

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

    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
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

  // Simulação de botão "comprar" nos cards
  document.querySelectorAll(".card .btn-buy").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".card");
      const nome = card.querySelector("h4")?.textContent || "Produto";
      const preco = parseFloat(card.querySelector(".price").textContent.replace("R$", "").replace(",", "."));
      cart.push({ nome, preco });
      renderCart();
    });
  });

  renderCart(); // render inicial
});

/* ===== PIX CHECKOUT (front-end) ===== */
// Substitua estes dados pelos reais:
const chavePix = 'SUA_CHAVE_PIX_AQUI';        // ex: 'seuemail@dominio.com' ou '+5511999999999'
const nomeTitular = 'Seu Nome ou Razao Social';
const nomeLoja = 'Loja Chic';

// cria modal PIX dinamicamente (se ainda não existir)
(function ensurePixModal(){
  if(document.getElementById('pixModal')) return;
  const div = document.createElement('div');
  div.id = 'pixModal';
  div.innerHTML = `
    <div class="pix-card">
      <button class="close-pix btn secondary" style="float:right">✕</button>
      <h3>Pagamento via Pix</h3>
      <p style="color:var(--muted)">Escaneie o QR ou copie o código Pix abaixo.</p>
      <div class="qr"><img id="pixQR" src="" alt="QR Code Pix" width="220" height="220"></div>
      <div class="pix-code" id="pixCode"></div>
      <div class="pix-actions">
        <button class="btn copy-pix" id="copyPixBtn">Copiar PIX</button>
        <a id="pixCopyLink" class="btn secondary" href="#" target="_blank" style="display:none">Abrir no App</a>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // fechar
  div.querySelector('.close-pix').addEventListener('click', ()=>{ div.classList.remove('open'); });
  div.addEventListener('click', (e)=>{ if(e.target === div) div.classList.remove('open'); });
})();

// converte total numérico para string no formato com duas casas e sem separador de milhar (usado no payload)
// usamos vírgula para exibição, ponto no payload (dependendo do gerador)
function formatMoneyBR(value){
  return Number(value).toFixed(2).replace('.', ',');
}

// monta payload PIX (formato simplificado - para testes)
// Obs: payload abaixo é ilustrativo — para produção usar biblioteca/validador de EMV/BRCode adequado
function gerarPayloadPix(chave, nome, merchantCity, valor){
  // valor: número com 2 casas (ex: 129.90)
  // Montagem simples (pode não cobrir todos os campos de checksum EMV) — suficiente para leitura por apps populares
  const v = Number(valor).toFixed(2).toString().replace('.', '');
  const payload = `00020126580014BR.GOV.BCB.PIX01${String(chave).length.toString().padStart(2,'0')}${chave}520400005303986540${String(Number(valor).toFixed(2)).replace('.','')}5802BR5925${nomeLoja}6009${merchantCity}6304ABCD`;
  // Observação: se quiser um BRCode totalmente válido com CRC correto, use uma lib no backend ou generator JS completo.
  return payload;
}

// Gera QR via Chart Google (rápido). Se quiser serviço próprio, troque a URL.
function gerarQRURL(payload){
  return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(payload)}`;
}

// função principal: abre modal PIX com valor do carrinho

// ligar ao botão do modal do carrinho
document.addEventListener('DOMContentLoaded', function(){
  const checkoutPixBtn = document.getElementById('checkoutPixBtn');
  const cartTotalEl = document.getElementById('cartTotal');

  if(checkoutPixBtn){
    checkoutPixBtn.addEventListener('click', () => {
      // obter total do carrinho (suporte ao seu formato, tente buscar ID/cartTotal)
      // se seu código armazena total em variável 'total', use-a; aqui pegamos do texto do elemento:
      let totalText = cartTotalEl ? cartTotalEl.textContent : null;
      let total = 0;
      if(totalText){
        // espera algo como "Total: R$ 129,90" ou "R$ 129,90"
        total = parseFloat(totalText.replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
      } else {
        // fallback: calcule a partir do array `cart` se existir
        if(typeof cart !== 'undefined' && Array.isArray(cart)){
          total = cart.reduce((s,it)=> s + (it.preco || 0) * (it.qtd || 1), 0);
        }
      }
      if(total <= 0) { alert('Carrinho vazio.'); return; }
      openPixModalFromCart(total);
    });
  }
});

// fechar mensagem do PIX
document.getElementById('closePixMsg')?.addEventListener('click', () => {
  document.getElementById('pixModal')?.classList.remove('open');
});





function openPixFromButton(){ openPixModalFromCart(0);} 
