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

// Função para gerar todas as combinações de acentos
function gerarCombinacoes(palavra) {
    const combinacoes = [];

    function gerarCombinacao(prefixo, resto) {
        if (resto.length === 0) {
            combinacoes.push(prefixo);
            return;
        }

        const letra = resto[0];
        const opcoes = acentos[letra] || [letra]; // Se a letra não tem acentos, use a letra normal

        opcoes.forEach(opcao => {
            gerarCombinacao(prefixo + opcao, resto.slice(1));
        });
    }

    gerarCombinacao('', palavra);
    return combinacoes;
}

function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
                    if (palavrasValidas.includes(palavraCompleta) || palavrasValidas.includes(removerAcentos(palavraCompleta))) {
                        console.log(`Palavra válida: ${palavraCompleta}`);
                        avaliarPalavra(letras, palavraSorteada);
                        trocarPalavraInput(linha, palavraCompleta); // Trocar palavra digitada pelo acentuada

                        // Adiciona a verificação de acerto
                        if (removerAcentos(palavraCompleta) === removerAcentos(palavraSorteada)) {
                            mostrarAviso(`Você acertou a palavra: ${palavraSorteada.toUpperCase()}`);
                            trocarPalavraInput(linha, palavraSorteada);
                            return;
                        } else {
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
                                // Adiciona a mensagem caso todas as linhas sejam preenchidas sem acerto
                                mostrarAviso(`Palavra: ${palavraSorteada}`);
                            }
                        }
                    } else {
                        // Gerar combinações da palavra digitada e verificar
                        const combinacoesPossiveis = gerarCombinacoes(palavraCompleta);
                        const palavraValida = combinacoesPossiveis.find(comb => {
                            return palavrasValidas.includes(comb);
                        });

                        if (palavraValida) {
                            console.log(`Palavra sem acento válida: ${palavraCompleta}`);
                            avaliarPalavra(letras, palavraSorteada);
                            trocarPalavraInput(linha, palavraValida); // Trocar palavra digitada pelo acentuada

                            if (removerAcentos(palavraCompleta) === removerAcentos(palavraSorteada)) {
                                mostrarAviso(`Você acertou a palavra: ${palavraSorteada.toUpperCase()}`);
                                trocarPalavraInput(linha, palavraSorteada);
                                return;
                            }

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
                            mostrarAviso("A palavra digitada não é válida");
                        }
                    }
                } else {
                    mostrarAviso('Preencha todas as letras antes de enviar.');
                }
            }
        });
    });
}

// Função para trocar a palavra no input pelo acentuada
function trocarPalavraInput(linhas, palavra) {
    const letras = linhas.querySelectorAll('.letra');
    letras.forEach((letra, index) => {
        letra.value = palavra[index];
    });
}

function avaliarPalavra(letras, palavraSorteada) {
    const palavraNormalizada = palavraSorteada.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const palavraArray = palavraSorteada.split('');
    const letrasUsadas = Array(palavraArray.length).fill(false); // Para rastrear letras usadas na palavra sorteada

    letras.forEach((letraInput, index) => {
        const letra = letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const bloco = letraInput.parentElement;

        // Verifica se a letra está na mesma posição
        if (letra === palavraNormalizada[index]) {
            bloco.classList.add('bloco_enviado_certo');
            letraInput.value = palavraArray[index]; // Atualiza para a letra acentuada correta
            letrasUsadas[index] = true; // Marca essa letra como usada
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
            letraInput.value = palavraArray[posicaoAlternativa]; // Atualiza para a letra acentuada correta
            letrasUsadas[posicaoAlternativa] = true; // Marca essa posição como usada
        } else {
            bloco.classList.add('bloco_enviado');
        }
    });

    // Verifica se todos os blocos foram enviados como corretos
    const todosCorretos = Array.from(letras).every((letraInput, index) => {
        return letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === palavraNormalizada[index];
    });

    if (todosCorretos) {
        mostrarAviso(`Você acertou a palavra: ${palavraSorteada.toUpperCase()}`);
    }
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

function mostrarAviso(mensagem) {
    const caixaAviso = document.getElementById('caixaAviso');
    caixaAviso.textContent = mensagem;
    caixaAviso.classList.add('mostrar');
    caixaAviso.style.display = 'block'; // Certifique-se de que a caixa de aviso seja exibida
}

function esconderAviso() {
    const caixaAviso = document.getElementById('caixaAviso');
    caixaAviso.classList.remove('mostrar');
    caixaAviso.style.display = 'none'; // Oculta a caixa de aviso
}

const acentos = {
    a: ['a', 'á', 'à', 'â', 'ã', 'ä', 'å'],
    e: ['e', 'é', 'è', 'ê', 'ë'],
    i: ['i', 'í', 'ì', 'î', 'ï'],
    o: ['o', 'ó', 'ò', 'ô', 'õ', 'ö'],
    u: ['u', 'ú', 'ù', 'û', 'ü'],
    c: ['c', 'ç'],
    n: ['n', 'ñ']
};

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