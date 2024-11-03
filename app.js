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

    inputs.forEach((input) => {
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
                        palavraCompleta += letra.value.toLowerCase();
                    });

                    // Verifica se a palavra completa existe no banco de palavras
                    if (palavrasValidas.includes(palavraCompleta)) {
                        console.log(`Palavra válida: ${palavraCompleta}`);
                        
                        // Envia a palavra e avalia
                        avaliarPalavra(letras, palavraSorteada);

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

                            const blocosNaLinha = document.getElementById('linha' + numeroLinhaAtual).querySelectorAll('.bloco');
                            blocosNaLinha.forEach(bloco => {
                                bloco.classList.add('bloco_enviado');
                                atualizarBlocosSelecionados();
                            });

                            const primeiroInput = proximaLinha.querySelector('.letra');
                            if (primeiroInput) {
                                primeiroInput.focus();
                            }
                        } else {
                            linha.classList.remove('linha_selecionada');
                            atualizarBlocosSelecionados();
                        }
                    } else {
                        console.log(`Palavra inválida: ${palavraCompleta}`);
                    }
                } else {
                    alert('Preencha todas as letras antes de enviar.');
                }
            }
        });
    });
}

function avaliarPalavra(letras, palavraSorteada) {
    // Normaliza a palavra sorteada para remover acentuações e define arrays auxiliares
    const palavraNormalizada = palavraSorteada.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const palavraArray = palavraSorteada.split('');
    const letrasUsadas = Array(palavraArray.length).fill(false);  // Para rastrear letras usadas na palavra sorteada

    letras.forEach((letraInput, index) => {
        const letra = letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const bloco = letraInput.parentElement;

        // Verifica se a letra está na mesma posição
        if (letra === palavraNormalizada[index]) {
            bloco.classList.add('bloco_enviado_certo');
            letraInput.value = palavraArray[index];  // Atualiza para a letra acentuada correta
            letrasUsadas[index] = true;  // Marca essa letra como usada
        }
    });

    letras.forEach((letraInput, index) => {
        const letra = letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const bloco = letraInput.parentElement;

        // Se a letra já está marcada como correta, pula para a próxima
        if (bloco.classList.contains('bloco_enviado_certo')) return;

        // Verifica se a letra existe na palavra, mas em outra posição
        const posicaoAlternativa = palavraNormalizada.indexOf(letra);

        // Somente adiciona 'bloco_enviado_errado' se a letra está em outra posição e não foi usada ainda
        if (posicaoAlternativa !== -1 && letrasUsadas[posicaoAlternativa] === false) {
            bloco.classList.add('bloco_enviado_errado');
            letraInput.value = palavraArray[posicaoAlternativa];  // Atualiza para a letra acentuada correta
            letrasUsadas[posicaoAlternativa] = true;  // Marca essa posição como usada
        } else {
            bloco.classList.add('bloco_enviado');
        }
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

let palavrasValidas = []; // Armazena as palavras carregadas do JSON

async function carregarPalavras() {
    try {
        const response = await fetch('./palavras.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON');
        }
        const data = await response.json();
        palavrasValidas = data.palavras.map(p => p.toLowerCase()); // Armazena todas as palavras em minúsculas
        return palavrasValidas;
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
        palavraSorteada = sortearPalavra(palavras); 
        console.log('Palavra sorteada:', palavraSorteada); 
    } else {
        console.error('Não foi possível carregar as palavras.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const botaoSortear = document.getElementById('botaoSortear');
    botaoSortear.addEventListener('click', atualizarPalavra); 
});

let palavraSorteada = atualizarPalavra();
document.addEventListener('DOMContentLoaded', async function() {
    await carregarPalavras();
    atualizarBlocosSelecionados();
    apenasLetras();
});