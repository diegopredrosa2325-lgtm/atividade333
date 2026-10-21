const URL_API = "https://fakestoreapi.com/products";

async function buscarProdutos() {
    const containerProdutos = document.getElementById("produtos");

    try {
        const resposta = await fetch(URL_API);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const produtos = await resposta.json();

        exibirProdutos(produtos);
    } catch (error) {
        containerProdutos.textContent =
            "Erro ao carregar produtos. Tente novamente mais tarde.";

        console.error("Erro ao buscar produtos:", error);
    }
}

function exibirProdutos(produtos) {
    const containerProdutos = document.getElementById("produtos");

    containerProdutos.replaceChildren();

    for (const produto of produtos) {
        const card = criarCardProduto(produto);
        containerProdutos.appendChild(card);
    }
}

function criarCardProduto(produto) {
    const card = document.createElement("article");
    card.classList.add("card-produto");

    const imagem = document.createElement("img");
    imagem.classList.add("imagem-produto");
    imagem.src = produto.image;
    imagem.alt = produto.title;
    imagem.loading = "lazy";

    const titulo = document.createElement("h3");
    titulo.classList.add("titulo-produto");
    titulo.textContent = produto.title;

    const preco = document.createElement("p");
    preco.classList.add("preco-produto");
    preco.textContent = produto.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "USD",
    });

    const botaoDetalhes = document.createElement("a");
    botaoDetalhes.classList.add("botao-detalhes");
    botaoDetalhes.href = `../HTML/detalhes.html?id=${produto.id}`;
    botaoDetalhes.textContent = "Ver detalhes";

    const botao = document.createElement("button");
    botao.classList.add("botao-carrinho");
    botao.textContent = "Adicionar ao carrinho";

    botao.addEventListener("click", function() {
        adicionarAoCarrinho(produto);
    });

    card.append(
        imagem,
        titulo,
        preco,
        botaoDetalhes,
        botao
    );

    return card;
}

let quantidadeCarrinho = 0;

function adicionarAoCarrinho(produto) {
    quantidadeCarrinho++;

    const contador = document.getElementById("quantidade-carrinho");
    contador.textContent = quantidadeCarrinho;

    console.log("Produto adicionado:", produto.title);
}

buscarProdutos();