function selecionarBloco(num, lin) {
    // Seleciona a linha correta com base no parâmetro 'lin'
    let linhaSelecionada = document.getElementById("linha" + lin);

    // Verifica se essa linha é a atualmente selecionada
    if (linhaSelecionada && linhaSelecionada.classList.contains("linha_selecionada")) {
        // Obtém todos os blocos dentro da linha selecionada
        let blocosNaLinha = linhaSelecionada.getElementsByClassName("bloco");

        // Remove a classe 'bloco_selecionado' de todos os blocos nessa linha
        Array.from(blocosNaLinha).forEach(bloco => {
            bloco.classList.remove("bloco_selecionado");
        });

        // Adiciona a classe 'bloco_selecionado' ao bloco específico pelo índice
        if (blocosNaLinha[num - 1]) {
            blocosNaLinha[num - 1].classList.add("bloco_selecionado");
        }
    }
}

function apenasLetras() {
    const inputs = document.querySelectorAll('.letra');

    inputs.forEach((input, index) => {
        // Não permite inserir algo além de letras no input
        input.addEventListener('keypress', function (e) {
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Caso não seja vazio e seja um número, muda a cor da letra
        input.addEventListener('input', function () {
            if (!isNaN(this.value) && this.value.length > 0) {
                this.style.backgroundColor = '#5C4D8B'; 
                this.style.color = '#5C4D8B'; 
            } else {
                this.style.backgroundColor = 'transparent'; 
                this.style.color = '#FFFFFF'; 
            }

            // Passa para o próximo input automaticamente se uma letra for digitada
            if (this.value.length > 0) {
                const linhaAtual = this.closest('.linha'); // Linha atual
                const inputsNaLinha = linhaAtual.querySelectorAll('.letra'); // Todos os inputs da linha

                // Encontra o índice atual do input na linha
                const indexNaLinha = Array.from(inputsNaLinha).indexOf(this);
                const nextInput = inputsNaLinha[indexNaLinha + 1]; // Próximo input na mesma linha

                // Remove a seleção do bloco atual e adiciona ao próximo bloco
                const currentBlock = this.parentElement;
                const nextBlock = nextInput ? nextInput.parentElement : null;

                if (currentBlock.classList.contains('bloco_selecionado')) {
                    currentBlock.classList.remove('bloco_selecionado');
                }
                if (nextBlock) {
                    nextBlock.classList.add('bloco_selecionado');
                    nextInput.focus(); // Move o foco para o próximo input na linha atual
                }
            }
        });

        // Detecta quando a tecla Enter é pressionada
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Impede o comportamento padrão do Enter

                // Coleta todos os valores dos inputs na mesma linha
                const linha = this.closest('.linha');
                const letras = linha.querySelectorAll('.letra');
                let palavraCompleta = '';

                letras.forEach(letra => {
                    palavraCompleta += letra.value; // Concatena cada letra
                });

                console.log(palavraCompleta); 
                enviarLinha(1);
            }
        });
    });
}

function linhaSelecionada() {
    const linhas = document.querySelectorAll('.linha');
    let linhaSelecionada = null;

    linhas.forEach(linha => {
        if (linha.classList.contains('linha_selecionada')) {
            const idLinha = linha.id; // Obtém o ID, ex: "linha1"
            linhaSelecionada = idLinha.replace('linha', ''); // Remove "linha" e deixa só o número
        }
    });

    return(linhaSelecionada);
}

function atualizarBlocosSelecionados() {
    // Seleciona todas as divs com a classe 'linha'
    const linhas = document.querySelectorAll('.linha');

    linhas.forEach(linha => {
        const blocos = linha.querySelectorAll('.bloco');

        if (linha.classList.contains('linha_selecionada')) {
            // Adiciona 'blocos_selecionados' aos blocos dentro da linha selecionada
            blocos.forEach(bloco => {
                bloco.classList.add('blocos_selecionados');
            });
        } else {
            // Remove 'blocos_selecionados' dos blocos nas linhas não selecionadas
            blocos.forEach(bloco => {
                bloco.classList.remove('blocos_selecionados');
            });
        }
    });
}

atualizarBlocosSelecionados();
apenasLetras();