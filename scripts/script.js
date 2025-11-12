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

