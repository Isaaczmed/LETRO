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