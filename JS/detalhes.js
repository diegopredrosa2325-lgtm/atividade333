const URL_API = "https://fakestoreapi.com/products";

// Contador demonstrativo: não é salvo e reinicia em 0 a cada página carregada.
let quantidadeCarrinho = 0;

async function buscarProduto() {
    // 1. Obter o ID da URL (ex.: detalhes.html?id=3)
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    // 2. Validar o ID antes de fazer a requisição
    if (!id || !/^\d+$/.test(id)) {
        exibirMensagem("Produto não informado ou ID inválido.");
        return;
    }

    // 3. Requisição HTTP
    try {
        const resposta = await fetch(`${URL_API}/${id}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        // Para IDs inexistentes, a FakeStore API pode responder com status 200
        // e corpo vazio. Por isso lemos como texto antes de converter em JSON.
        const texto = await resposta.text();

        if (!texto) {
            exibirMensagem("Produto não encontrado.");
            return;
        }

        const produto = JSON.parse(texto);

        if (!produto || !produto.id) {
            exibirMensagem("Produto não encontrado.");
            return;
        }

        exibirDetalhesProduto(produto);
    } catch (error) {
        exibirMensagem(
            "Erro ao carregar os detalhes do produto. Tente novamente mais tarde."
        );

        console.error("Erro ao buscar produto:", error);
    }
}

function exibirDetalhesProduto(produto) {
    const containerDetalhe = document.getElementById("detalhe-produto");

    containerDetalhe.replaceChildren();

    const imagem = document.createElement("img");
    imagem.classList.add("detalhe-imagem");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const informacoes = document.createElement("div");
    informacoes.classList.add("detalhe-informacoes");

    const categoria = document.createElement("p");
    categoria.classList.add("detalhe-categoria");
    categoria.textContent = produto.category;

    const titulo = document.createElement("h2");
    titulo.classList.add("detalhe-titulo");
    titulo.textContent = produto.title;

    // Formato pt-BR com moeda USD: o resultado aparece como "US$ 109,95".
    const preco = document.createElement("p");
    preco.classList.add("detalhe-preco");
    preco.textContent = produto.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "USD",
    });

    const descricaoTitulo = document.createElement("h3");
    descricaoTitulo.classList.add("detalhe-subtitulo");
    descricaoTitulo.textContent = "Descrição";

    const descricao = document.createElement("p");
    descricao.classList.add("detalhe-descricao");
    descricao.textContent = produto.description;

    const avaliacao = document.createElement("p");
    avaliacao.classList.add("detalhe-avaliacao");
    avaliacao.textContent =
        `★ ${produto.rating.rate} de 5 (${produto.rating.count} avaliações)`;

    const botao = document.createElement("button");
    botao.classList.add("botao-carrinho");
    botao.textContent = "Adicionar ao carrinho";

    botao.addEventListener("click", function() {
        adicionarAoCarrinho(produto);
    });

    informacoes.append(
        categoria,
        titulo,
        preco,
        descricaoTitulo,
        descricao,
        avaliacao,
        botao
    );

    containerDetalhe.append(imagem, informacoes);
    document.title = `${produto.title} - Loja FakeStore`;
}

function exibirMensagem(mensagem) {
    const containerDetalhe = document.getElementById("detalhe-produto");

    containerDetalhe.textContent = mensagem;
}

function adicionarAoCarrinho(produto) {
    quantidadeCarrinho++;

    const contador = document.getElementById("quantidade-carrinho");

    contador.textContent = quantidadeCarrinho;

    console.log("Produto adicionado:", produto.title);
}

buscarProduto();