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

    // Não permite enviar algo além de letras no input
    inputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Caso não seja vazio e seja um número muda a cor da letra
        input.addEventListener('input', function () {
            if (!isNaN(this.value) && this.value.length > 0) {
                this.style.backgroundColor = '#5C4D8B'; 
                this.style.color = '#5C4D8B'; 
            } else {
                this.style.backgroundColor = 'transparent'; 
                this.style.color = '#FFFFFF'; 
            }
        });

        // O input selecionado ganha foco
        input.addEventListener('focus', function () {
            this.setSelectionRange(0, 1); 
        });
    });
}

apenasLetras();