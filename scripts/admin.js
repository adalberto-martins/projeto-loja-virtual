// === SENHA PADRÃO DO PAINEL ===
const SENHA = "admin123";

// Verificação da senha
const senhaDigitada = prompt("Digite a senha de administrador:");

if (senhaDigitada !== SENHA) {
    alert("Senha incorreta!");
    location.reload();
}

// === SISTEMA DE PRODUTOS ===
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// Renderizar lista
function renderList() {
    const tbody = document.getElementById("productList");
    tbody.innerHTML = "";

    produtos.forEach((p, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.categoria}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>
                <button class="btn secondary" onclick="editarProduto(${index})">Editar</button>
                <button class="btn btn-danger" onclick="excluirProduto(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

renderList();

// Salvar produto
document.getElementById("productForm").addEventListener("submit", function(e){
    e.preventDefault();

    const nome = document.getElementById("name").value;
    const categoria = document.getElementById("category").value;
    const preco = parseFloat(document.getElementById("price").value);
    const imagem = document.getElementById("image").value;
    const descricao = document.getElementById("description").value;

    produtos.push({ nome, categoria, preco, imagem, descricao });

    localStorage.setItem("produtos", JSON.stringify(produtos));
    renderList();
    this.reset();
});

// Editar produto
function editarProduto(i){
    const p = produtos[i];

    document.getElementById("name").value = p.nome;
    document.getElementById("category").value = p.categoria;
    document.getElementById("price").value = p.preco;
    document.getElementById("image").value = p.imagem;
    document.getElementById("description").value = p.descricao;

    excluirProduto(i);
}

// Excluir produto
function excluirProduto(i){
    produtos.splice(i,1);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    renderList();
}
