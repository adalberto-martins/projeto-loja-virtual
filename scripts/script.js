document.getElementById('ano').textContent = new Date().getFullYear();

function openWhatsApp(msg){
  const phone = '5511999999999';
  const text = encodeURIComponent(msg);
  window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
}

function openPixModal(title, amount){
  const modal = document.getElementById('modal');
  const container = modal.querySelector('.card-modal');
  const chavePix = 'seuemail@dominio.com';
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
    <button class='copy-btn' onclick='copyPixCode()'>Copiar código</button>`;
  modal.classList.add('open');
}

function copyPixCode(){navigator.clipboard.writeText(document.querySelector('.pix-code').textContent).then(()=>alert('Código Pix copiado com sucesso!'));}
function closeModal(){document.getElementById('modal').classList.remove('open')}

// MENU HAMBÚRGUER
(function(){const hamburger=document.getElementById('hamburger');const mobileNav=document.getElementById('mobileNav');const mobileClose=document.getElementById('mobileClose');let lastFocused=null;function openMobileNav(){lastFocused=document.activeElement;hamburger.classList.add('open');mobileNav.classList.add('open');document.body.style.overflow='hidden'}function closeMobileNav(){hamburger.classList.remove('open');mobileNav.classList.remove('open');document.body.style.overflow='';if(lastFocused) lastFocused.focus()}hamburger.addEventListener('click',()=>{if(mobileNav.classList.contains('open')) closeMobileNav(); else openMobileNav()});mobileClose.addEventListener('click',closeMobileNav);mobileNav.addEventListener('click',e=>{if(e.target.tagName.toLowerCase()==='a' || e.target===mobileNav) closeMobileNav()});})();

// HEADER SCROLL
window.addEventListener('scroll',()=>{const header=document.querySelector('header');window.scrollY>60?header.classList.add('scrolled'):header.classList.remove('scrolled');});

// OBSERVER GLOBAL
let observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:0.1});

// FILTROS + BUSCA
async function inicializarFiltros(){
  const filtros=document.querySelectorAll('#filtros .cat');
  const container=document.getElementById('produtosContainer');
  const inputBusca=document.getElementById('searchInput');
  const btnBuscar=document.getElementById('btnBuscar');
  let produtosCache=[];

  async function carregarEFiltrar(categoria='Todos', termo=''){
    try{
      if(produtosCache.length===0){const res=await fetch('data/produtos.json');produtosCache=await res.json()}
      container.innerHTML='';
      const termoLower=termo.toLowerCase();
      const filtrados=produtosCache.filter(p=>{
        const matchCategoria=(categoria==='Todos')||p.categoria.toLowerCase().includes(categoria.toLowerCase());
        const matchBusca= p.nome.toLowerCase().includes(termoLower) || p.categoria.toLowerCase().includes(termoLower);
        return matchCategoria && matchBusca;
      });
      if(filtrados.length===0){container.innerHTML='<p style="color:var(--muted)">Nenhum produto encontrado.</p>'}
      else{
        filtrados.forEach(prod=>{
          const card=document.createElement('article');card.className='card reveal';card.innerHTML=`
            <img src='${prod.imagem}' alt='${prod.nome}'>
            <div class='meta'><div><div style='font-weight:700'>${prod.nome}</div><div class='tag'>${prod.categoria}</div></div><div class='price'>R$ ${prod.preco.toFixed(2).replace('.',',')}</div></div>
            <div class='buy'><button class='btn' onclick="openWhatsApp('Tenho interesse em ${prod.nome}')">WhatsApp</button>
            <button class='btn secondary' onclick="openPixModal('${prod.nome}',${prod.preco})">Pagar com Pix</button></div>`;
          container.appendChild(card);observer.observe(card);
        });
      }
    }catch(e){console.error('Erro ao filtrar produtos',e)}
  }

  filtros.forEach(filtro=>{filtro.addEventListener('click',()=>{filtros.forEach(f=>f.classList.remove('active'));filtro.classList.add('active');carregarEFiltrar(filtro.dataset.cat, inputBusca.value)})});

  btnBuscar.addEventListener('click',()=>{const ativo=document.querySelector('#filtros .cat.active');const categoriaAtiva=ativo?ativo.dataset.cat:'Todos';carregarEFiltrar(categoriaAtiva,inputBusca.value)});
  inputBusca.addEventListener('keyup',e=>{if(e.key==='Enter'){const ativo=document.querySelector('#filtros .cat.active');const categoriaAtiva=ativo?ativo.dataset.cat:'Todos';carregarEFiltrar(categoriaAtiva,inputBusca.value)}});

  carregarEFiltrar('Todos','');
}
window.addEventListener('DOMContentLoaded',inicializarFiltros);
