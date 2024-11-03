function selecionarBloco(num, lin) {
    let linhaSelecionada = document.getElementById("linha" + lin);

    if (linhaSelecionada && linhaSelecionada.classList.contains("linha_selecionada")) {
        let blocosNaLinha = linhaSelecionada.getElementsByClassName("bloco");
        let letrasNaLinha = linhaSelecionada.getElementsByClassName("letra");

        Array.from(blocosNaLinha).forEach(bloco => {
            bloco.classList.remove("bloco_selecionado");
        });

        if (blocosNaLinha[num - 1]) {
            blocosNaLinha[num - 1].classList.add("bloco_selecionado");
        }

        Array.from(letrasNaLinha).forEach(letra => {
            letra.classList.remove("letra_selecionada");
        });

        if (letrasNaLinha[num - 1]) {
            letrasNaLinha[num - 1].classList.add("letra_selecionada");
        }

        const input = linhaSelecionada.querySelector(`#letra${num}`);
        if (input) {
            input.focus(); 
        }
    }
}

function selecionarLetra(num, lin) {
    let linhaSelecionada = document.getElementById("linha" + lin);

    if (linhaSelecionada && linhaSelecionada.classList.contains("linha_selecionada")) {
        let letrasNaLinha = linhaSelecionada.getElementsByClassName("letra");

        Array.from(letrasNaLinha).forEach(letra => {
            letra.classList.remove("letra_selecionada");
        });

        if (letrasNaLinha[num - 1]) {
            letrasNaLinha[num - 1].classList.add("letra_selecionada");
        }
    }
}

function gerarCombinacoes(palavra) {
    const combinacoes = [];

    function gerarCombinacao(prefixo, resto) {
        if (resto.length === 0) {
            combinacoes.push(prefixo);
            return;
        }

        const letra = resto[0];
        const opcoes = acentos[letra] || [letra]; 

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

                    if (palavrasValidas.includes(palavraCompleta) || palavrasValidas.includes(removerAcentos(palavraCompleta))) {
                        console.log(`Palavra válida: ${palavraCompleta}`);
                        avaliarPalavra(letras, palavraSorteada);
                        trocarPalavraInput(linha, palavraCompleta);

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
                                mostrarAviso(`Palavra: ${palavraSorteada}`);
                            }
                        }
                    } else {
                        const combinacoesPossiveis = gerarCombinacoes(palavraCompleta);
                        const palavraValida = combinacoesPossiveis.find(comb => {
                            return palavrasValidas.includes(comb);
                        });

                        if (palavraValida) {
                            console.log(`Palavra sem acento válida: ${palavraCompleta}`);
                            avaliarPalavra(letras, palavraSorteada);
                            trocarPalavraInput(linha, palavraValida); 

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

function trocarPalavraInput(linhas, palavra) {
    const letras = linhas.querySelectorAll('.letra');
    letras.forEach((letra, index) => {
        letra.value = palavra[index];
    });
}

function avaliarPalavra(letras, palavraSorteada) {
    const palavraNormalizada = palavraSorteada.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const palavraArray = palavraSorteada.split('');
    const letrasUsadas = Array(palavraArray.length).fill(false); 

    letras.forEach((letraInput, index) => {
        const letra = letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const bloco = letraInput.parentElement;

        if (letra === palavraNormalizada[index]) {
            bloco.classList.add('bloco_enviado_certo');
            letraInput.value = palavraArray[index]; 
            letrasUsadas[index] = true; 
        }
    });

    letras.forEach((letraInput, index) => {
        const letra = letraInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const bloco = letraInput.parentElement;

        if (bloco.classList.contains('bloco_enviado_certo')) return;

        const posicaoAlternativa = palavraNormalizada.indexOf(letra);

        if (posicaoAlternativa !== -1 && letrasUsadas[posicaoAlternativa] === false) {
            bloco.classList.add('bloco_enviado_errado');
            letraInput.value = palavraArray[posicaoAlternativa]; 
            letrasUsadas[posicaoAlternativa] = true; 
        } else {
            bloco.classList.add('bloco_enviado');
        }
    });

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

let palavrasValidas = []; 

async function carregarPalavras() {
    try {
        const response = await fetch('./palavras.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON');
        }
        const data = await response.json();
        palavrasValidas = data.palavras.map(p => p.toLowerCase()); 
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
    caixaAviso.style.display = 'block'; 
}

function esconderAviso() {
    const caixaAviso = document.getElementById('caixaAviso');
    caixaAviso.classList.remove('mostrar');
    caixaAviso.style.display = 'none'; 
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

async function carregarPalavrasSorteadas() {
    try {
        const response = await fetch('./escolhidas.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON');
        }
        const data = await response.json();
        palavrasValidas = data.palavras.map(p => p.toLowerCase()); 
        return palavrasValidas;
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
}

async function atualizarPalavraSorteada() {
    const palavrasSorteadas = await carregarPalavrasSorteadas();
    if (palavrasSorteadas) { 
        palavraSorteada = sortearPalavra(palavrasSorteadas); 
        console.log('Palavra sorteada:', palavraSorteada); 
    } else {
        console.error('Não foi possível carregar as palavras.');
    }
}

let palavraSorteada = atualizarPalavraSorteada();
document.addEventListener('DOMContentLoaded', async function() {
    await carregarPalavras();
    atualizarBlocosSelecionados();
    apenasLetras();
});