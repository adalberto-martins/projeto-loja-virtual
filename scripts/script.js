// Front-end script V8 - usa API se disponível, com fallback para data/produtos.json
document.getElementById('ano').textContent = new Date().getFullYear();

function openWhatsApp(msg){
  const phone = '5511999999999'; // substitua pelo seu telefone (com DDI e DDD)
  const text = encodeURIComponent(msg);
  window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
}

function openPixModal(title, amount){
  const modal = document.getElementById('modal');
  const container = modal.querySelector('.card-modal');
  const chavePix = 'seuemail@dominio.com'; // substitua pela sua chave Pix
  const valor = amount.toFixed(2);
  const payload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}520400005303986540${valor}5802BR5920Loja Chic6009SaoPaulo62070503***6304ABCD`;
  const qrURL = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(payload)}`;
  container.innerHTML = `
    <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px'>
      <h3>Pagamento via Pix</h3>
      <button class='close' onclick='closeModal()'>✕</button>
    </div>
    <p style='color:var(--muted)'>Escaneie o QR Code abaixo ou copie o código Pix para pagamento:</p>
    <div class='qr-container'><img src='${qrURL}' alt='QR Code Pix'></div>
    <div class='pix-code'>${payload}</div>
    <div style='display:flex;gap:8px;margin-top:12px'>
      <button class='btn secondary' onclick='clearCart()'>Limpar Carrinho</button>
      <button class='btn copy-btn' onclick='copyPixCode()'>Copiar código</button>
    </div>`;
  modal.classList.add('open');
  // limpar carrinho automaticamente após 30s por padrão
  setTimeout(()=>{ clearCart(); }, 30000);
}

function copyPixCode(){ navigator.clipboard.writeText(document.querySelector('.pix-code').textContent).then(()=>alert('Código Pix copiado!')); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }

// hamburger
(function(){
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  hamburger.addEventListener('click', ()=>{
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileClose && mobileClose.addEventListener('click', ()=>{ mobileNav.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow=''; });
})();

// sticky header
window.addEventListener('scroll', ()=>{
  const header = document.querySelector('header');
  if(window.scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
});

// global observer
let observer = new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, {threshold: 0.12});

// cart (localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function updateCartDisplay(){
  const cartCount = document.getElementById('cartCount'); if(cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.qtd,0);
  const container = document.getElementById('cartItems'); const totalBox = document.getElementById('cartTotal'); if(!container) return;
  container.innerHTML=''; let total=0;
  if(cart.length===0) container.innerHTML='<p style="color:var(--muted)">Seu carrinho está vazio.</p>'; else {
    cart.forEach((it,idx)=>{ total += it.preco*it.qtd; container.innerHTML += `<div class="cart-item"><img src="${it.imagem}" alt="${it.nome}"><div style="flex:1;margin-left:8px"><div>${it.nome}</div><div style="font-size:12px;color:var(--muted)">R$ ${it.preco.toFixed(2).replace('.',',')} x ${it.qtd}</div></div><button onclick="removeFromCart(${idx})">Remover</button></div>` });
  }
  totalBox && (totalBox.textContent = 'Total: R$ ' + total.toFixed(2).replace('.',','));
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCartFromElement(el){ const prod = { nome: el.dataset.nome, preco: parseFloat(el.dataset.preco), imagem: el.dataset.imagem }; const existing = cart.find(i=>i.nome===prod.nome); if(existing) existing.qtd++; else cart.push({...prod, qtd:1}); updateCartDisplay(); }
function removeFromCart(idx){ cart.splice(idx,1); updateCartDisplay(); }
function clearCart(){ cart = []; updateCartDisplay(); }
function openCart(){ document.getElementById('cartModal').classList.add('open'); }
function closeCart(){ document.getElementById('cartModal').classList.remove('open'); }
function checkoutPix(){ const total = cart.reduce((s,i)=>s+i.preco*i.qtd,0); if(total<=0) return alert('Carrinho vazio'); openPixModal('Compra Loja Chic', total); setTimeout(()=>{ clearCart(); alert('Carrinho esvaziado após checkout automático'); }, 30000); }

// load products: try API, fallback to local JSON
async function fetchProdutos(params={}){
  try{
    const url = new URL('/api/produtos', window.location.origin);
    if(params.q) url.searchParams.set('q', params.q);
    if(params.categoria) url.searchParams.set('categoria', params.categoria);
    const res = await fetch(url);
    if(!res.ok) throw new Error('API indisponível');
    return await res.json();
  }catch(e){
    const res = await fetch('data/produtos.json');
    return await res.json();
  }
}

async function carregarNovidades(){
  try{
    const url = new URL('/api/novidades', window.location.origin);
    url.searchParams.set('days', '30');
    const res = await fetch(url);
    const data = res.ok ? await res.json() : (await (await fetch('data/produtos.json')).json()).filter(p=>true);
    const container = document.getElementById('novidadesContainer'); container.innerHTML='';
    data.slice(0,4).forEach(p=>{ const card = document.createElement('article'); card.className='card reveal'; card.innerHTML = `<img src='${p.imagem}' alt='${p.nome}'><div class='meta'><div><div style='font-weight:700'>${p.nome}</div><div class='tag'>${p.categoria}</div></div><div class='price'>R$ ${p.preco.toFixed(2).replace('.',',')}</div></div><div class='buy'><button class='btn' onclick="openWhatsApp('Tenho interesse em ${p.nome}')">WhatsApp</button><button class='btn secondary' onclick="openPixModal('${p.nome}',${p.preco})">Pagar com Pix</button><button class='btn secondary' data-nome='${p.nome}' data-preco='${p.preco}' data-imagem='${p.imagem}' onclick='addToCartFromElement(this)'>Adicionar ao Carrinho</button></div>`; container.appendChild(card); observer.observe(card); });
  }catch(e){ console.error(e); }
}

async function inicializarFiltros(){
  const filtros = document.querySelectorAll('#filtros .cat');
  const container = document.getElementById('produtosContainer');
  const inputBusca = document.getElementById('searchInput');
  const btnBuscar = document.getElementById('btnBuscar');
  let produtosCache = [];

  async function carregarEFiltrar(categoria='Todos', termo=''){
    try{
      const produtos = await fetchProdutos({q:termo, categoria:categoria});
      produtosCache = produtos;
      container.innerHTML='';
      if(produtos.length===0){ container.innerHTML = '<p style="color:var(--muted)">Nenhum produto encontrado.</p>'; return; }
      produtos.forEach(prod=>{
        const card = document.createElement('article'); card.className='card reveal'; card.innerHTML = `<img src='${prod.imagem}' alt='${prod.nome}'><div class='meta'><div><div style='font-weight:700'>${prod.nome}</div><div class='tag'>${prod.categoria}</div></div><div class='price'>R$ ${prod.preco.toFixed(2).replace('.',',')}</div></div><div class='buy'><button class='btn' onclick="openWhatsApp('Tenho interesse em ${prod.nome}')">WhatsApp</button><button class='btn secondary' onclick="openPixModal('${prod.nome}',${prod.preco})">Pagar com Pix</button><button class='btn secondary' data-nome='${prod.nome}' data-preco='${prod.preco}' data-imagem='${prod.imagem}' onclick='addToCartFromElement(this)'>Adicionar ao Carrinho</button></div>`; container.appendChild(card); observer.observe(card);
      });
    }catch(e){ console.error('Erro ao carregar produtos', e); container.innerHTML = '<p style="color:var(--muted)">Erro ao carregar produtos.</p>'; }
  }

  filtros.forEach(filtro=>{ filtro.addEventListener('click', ()=>{ filtros.forEach(f=>f.classList.remove('active')); filtro.classList.add('active'); carregarEFiltrar(filtro.dataset.cat, inputBusca.value); }); });
  btnBuscar.addEventListener('click', ()=>{ const ativo = document.querySelector('#filtros .cat.active'); const categoriaAtiva = ativo ? ativo.dataset.cat : 'Todos'; carregarEFiltrar(categoriaAtiva, inputBusca.value); });
  inputBusca.addEventListener('keyup', e=>{ if(e.key==='Enter'){ const ativo = document.querySelector('#filtros .cat.active'); const categoriaAtiva = ativo ? ativo.dataset.cat : 'Todos'; carregarEFiltrar(categoriaAtiva, inputBusca.value); } });
  carregarEFiltrar('Todos','');
  carregarNovidades();
}

// init
window.addEventListener('DOMContentLoaded', ()=>{ inicializarFiltros(); carregarNovidades(); updateCartDisplay(); document.getElementById('openCart').addEventListener('click', openCart); });
