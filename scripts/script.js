document.getElementById('ano').textContent = new Date().getFullYear();


function openWhatsApp(msg){
const phone = '5511999999999'; // substitua pelo número real (formato internacional sem +)
const text = encodeURIComponent(msg);
const url = `https://wa.me/${phone}?text=${text}`;
window.open(url,'_blank');
}

function openPixModal(title,amount){
const modal = document.getElementById('modal');
modal.classList.add('open');
}

function closeModal(){
const modal = document.getElementById('modal');
modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeNav = document.getElementById('closeNav');

  // abrir/fechar menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // fechar ao clicar no X
  closeNav.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });

  // fechar ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });
});
