function selecionarBloco(num, lin) {
    let linhaSelecionada = document.getElementById("linha" + lin);
    if (linhaSelecionada.classList.contains("linha_selecionada")){

        let blocoSelecionado = document.getElementById("bloco" + num);
        let blocosNaLinha = linhaSelecionada.getElementsByClassName("bloco");
    
        for (let i = 0; i < blocosNaLinha.length; i++) {
            if (blocosNaLinha[i].classList.contains("bloco_selecionado")) {
    
                blocosNaLinha[i].classList.remove("bloco_selecionado");
            }
        }
        blocoSelecionado.classList.add("bloco_selecionado");
    }
}

function apenasLetras(){
    const inputs = document.querySelectorAll('.letra');

    inputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            // Permite apenas letras (a-z, A-Z) e impede números
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
}
