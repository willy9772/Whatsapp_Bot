const { log } = require("console")
const fs = require("fs")
const path = require("path")

module.exports = organizar_por_celular

function organizar_por_celular() {
    const estrutura_de_mensagens = lerjson(path.join(__dirname, "TipodeMensagens", "TiposdeMensagens.json"));
    const todos_os_clientes = lerjson(path.join(__dirname, "..", "Data", "Cache", buscarDataAtual(), "GERAL.json"));

    let grupo_de_clientes = {};
    let excluidos = []

    todos_os_clientes.forEach(cliente => {
        const tipo_de_mensagem_cliente = cliente.tipoDeMensagem;
        const estrutura = estrutura_de_mensagens.find(est => est.tipo === tipo_de_mensagem_cliente);
        const celulares_disponiveis = estrutura.celulares;

        let menor_tamanho = Infinity;
        let celular_com_menor_tamanho = null;

        celulares_disponiveis.forEach(celular => {
            if (!grupo_de_clientes[celular]) {
                grupo_de_clientes[celular] = [];
            }

            if (grupo_de_clientes[celular].length < menor_tamanho) {
                menor_tamanho = grupo_de_clientes[celular].length;
                celular_com_menor_tamanho = celular;
            }
        });

        if (grupo_de_clientes[celular_com_menor_tamanho].length < 800 && !grupo_de_clientes[celular_com_menor_tamanho].some(c => c.id === cliente.id)) {
            grupo_de_clientes[celular_com_menor_tamanho].push(cliente);
        } else {
            excluidos.push(cliente)
        }
    });

    log(`Foram encontrados ${excluidos.length} clientes duplicados e removidos da cobrança`)

    for (const celular in grupo_de_clientes) {
        log(`O tamanho do grupo ${celular} é ${grupo_de_clientes[celular].length}`)
        salvarArquivodeMensagens(celular, grupo_de_clientes[celular])
    }

}














function lerjson(caminho) {

    const arquivo = JSON.parse(fs.readFileSync(caminho))

    return arquivo

}

function salvarArquivodeMensagens(nome, conteudo) {

    if (!fs.existsSync(path.join(__dirname, "..", "Data", "Cache", buscarDataAtual(), "Mensagens"))) {
        fs.mkdirSync(path.join(__dirname, "..", "Data", "Cache", buscarDataAtual(), "Mensagens"))
    }

    fs.writeFileSync(path.join(__dirname, "..", "Data", "Cache", buscarDataAtual(), "Mensagens", nome + ".json"), JSON.stringify(conteudo))

}











function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}