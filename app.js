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

                    // Passa para a próxima linha
                    const numeroLinhaAtual = parseInt(linha.id.replace('linha', '')); // Ajuste aqui
                    const proximaLinha = document.getElementById('linha' + (numeroLinhaAtual + 1)); // Obtém a próxima linha

                    if (proximaLinha) {
                        linha.classList.remove('linha_selecionada'); // Remove da linha atual
                        proximaLinha.classList.add('linha_selecionada'); // Adiciona à próxima linha

                        // Atualiza os blocos da nova linha selecionada
                        const blocosNaProximaLinha = proximaLinha.querySelectorAll('.bloco');
                        blocosNaProximaLinha.forEach(bloco => {
                            bloco.classList.add('blocos_selecionados'); // Adiciona a classe blocos_selecionados
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

atualizarBlocosSelecionados();
apenasLetras();