function selecionarBloco(num, lin) {
    let linhaSelecionada = document.getElementById("linha" + lin);
    if (linhaSelecionada.classList.contains("linha_selecionada")) {
        let blocoSelecionado = document.getElementById("bloco" + num);
        let blocosNaLinha = linhaSelecionada.getElementsByClassName("bloco");

        // Passa por todos os blocos da linha para ver se algum já estava selecionado
        for (let i = 0; i < blocosNaLinha.length; i++) {
            if (blocosNaLinha[i].classList.contains("bloco_selecionado")) {
                blocosNaLinha[i].classList.remove("bloco_selecionado");
            }
        }
        blocoSelecionado.classList.add("bloco_selecionado");
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
                const nextInput = inputs[index + 1];
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
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus(); // Move para o próximo input
            }
        ;
    });
}

apenasLetras();