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