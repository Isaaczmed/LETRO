function selecionarBloco(num, lin) {
    let linhaSelecionada = document.getElementById("linha" + lin);

    if (linhaSelecionada && linhaSelecionada.classList.contains("linha_selecionada")) {
        let blocosNaLinha = linhaSelecionada.getElementsByClassName("bloco");

        Array.from(blocosNaLinha).forEach(bloco => {
            bloco.classList.remove("bloco_selecionado");
        });

        if (blocosNaLinha[num - 1]) {
            blocosNaLinha[num - 1].classList.add("bloco_selecionado");
        }
    }
}

function apenasLetras() {
    const inputs = document.querySelectorAll('.letra');

    inputs.forEach((input, index) => {
        input.addEventListener('keypress', function (e) {
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', function () {
            if (this.value.length > 0) {
                const linhaAtual = this.closest('.linha');
                const inputsNaLinha = linhaAtual.querySelectorAll('.letra');
                const indexNaLinha = Array.from(inputsNaLinha).indexOf(this);
                const nextInput = inputsNaLinha[indexNaLinha + 1];

                const currentBlock = this.parentElement;
                const nextBlock = nextInput ? nextInput.parentElement : null;

                if (currentBlock.classList.contains('bloco_selecionado')) {
                    currentBlock.classList.remove('bloco_selecionado');
                }
                if (nextBlock) {
                    nextBlock.classList.add('bloco_selecionado');
                    nextInput.focus();
                }
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 

                const linha = this.closest('.linha');
                const letras = linha.querySelectorAll('.letra');
                let palavraCompleta = '';

                let todosPreenchidos = true;
                letras.forEach(letra => {
                    if (letra.value.length === 0) {
                        todosPreenchidos = false; 
                    }
                });

                if (todosPreenchidos) {
                    letras.forEach(letra => {
                        palavraCompleta += letra.value; 
                    });

                    console.log(palavraCompleta);

                    const numeroLinhaAtual = parseInt(linha.id.replace('linha', '')); 
                    const proximaLinha = document.getElementById('linha' + (numeroLinhaAtual + 1)); 

                    if (proximaLinha) {
                        linha.classList.remove('linha_selecionada'); 
                        proximaLinha.classList.add('linha_selecionada'); 

                        const blocosNaProximaLinha = proximaLinha.querySelectorAll('.bloco');
                        blocosNaProximaLinha.forEach(bloco => {
                            bloco.classList.add('blocos_selecionados'); 
                            
                            atualizarBlocosSelecionados();
                        });

                        // Foca no primeiro input da nova linha
                        const primeiroInput = proximaLinha.querySelector('.letra');
                        if (primeiroInput) {
                            primeiroInput.focus(); 
                        }
                    } else {
                        console.log("Não há mais linhas para passar.");
                    }
                } else {
                    alert('Preencha todas as letras antes de enviar.');
                }
            }
        });
    });
}

function linhaSelecionada() {
    const linhas = document.querySelectorAll('.linha');
    let linhaSelecionada = null;

    linhas.forEach(linha => {
        if (linha.classList.contains('linha_selecionada')) {
            const idLinha = linha.id; 
            linhaSelecionada = idLinha.replace('linha', ''); 
        }
    });

    return linhaSelecionada;
}

function atualizarBlocosSelecionados() {
    const linhas = document.querySelectorAll('.linha');

    linhas.forEach(linha => {
        const blocos = linha.querySelectorAll('.bloco');

        if (linha.classList.contains('linha_selecionada')) {
            blocos.forEach(bloco => {
                bloco.classList.add('blocos_selecionados');
            });
        } else {
            blocos.forEach(bloco => {
                bloco.classList.remove('blocos_selecionados');
            });
        }
    });
}

async function carregarPalavras() {
    try {
        const response = await fetch('./palavras.json'); 
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON');
        }
        const data = await response.json();
        return data.palavras; 
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
}

function sortearPalavra(palavras) {
    const indiceAleatorio = Math.floor(Math.random() * palavras.length);
    return palavras[indiceAleatorio]; 
}

async function atualizarPalavra() {
    const palavras = await carregarPalavras();
    if (palavras) { 
        const palavraSorteada = sortearPalavra(palavras); 
        // Palavra aleatória
        console.log('Palavra sorteada:', palavraSorteada); 
    } else {
        console.error('Não foi possível carregar as palavras.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const botaoSortear = document.getElementById('botaoSortear');
    botaoSortear.addEventListener('click', atualizarPalavra); 
});

atualizarBlocosSelecionados();
apenasLetras();