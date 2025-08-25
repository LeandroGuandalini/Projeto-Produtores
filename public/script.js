async function carregarProdutos() {
    try {
        const res = await fetch('/produtos/lista');
        const produtos = await res.json();

        const container = document.getElementById('lista-produtos');
        container.innerHTML = '';

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';
            card.innerHTML = `
                <div class="card">
                    <img src="uploads/${produto.foto || 'placeholder.png'}" class="card-img-top" alt="${produto.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">${produto.descricao || ''}</p>
                        <p class="card-text"><strong>R$ ${produto.valor.toFixed(2)}</strong></p>
                        <p class="card-text"><em>Produtor: ${produto.produtor}</em></p>
                        <a href="https://wa.me/55${produto.telefone}" class="btn btn-success">WhatsApp</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
}

carregarProdutos();
