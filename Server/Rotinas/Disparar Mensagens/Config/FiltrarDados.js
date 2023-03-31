const { log } = require("console")
const fs = require("fs")
const path = require("path")

FiltrarDados()

function FiltrarDados() {

    const cacheDir = path.join(__dirname, "..", "Data", "Cache", buscarDataAtual())

    let abc = lerArquivoJson(path.join(cacheDir, "abc.json"))
    let cdefg = lerArquivoJson(path.join(cacheDir, "cdefg.json"))

    abc = filtrarObjeto(abc)
/*     cdefg = filtrarObjeto(cdefg) */

}

function filtrarObjeto(array_de_objetos) {

    array_de_objetos.forEach((cliente) => {

        // Mudar Nome
        cliente.nome = mudarNome(cliente.nome)

        // Mudar Conexão
        cliente.status = mudarConexao(cliente.status)

        // Mudar Numero
        cliente.telefone = mudarNumero(cliente.telefone)

        // Mudar Valor da Fatura
        cliente.valor = mudarValor(cliente.valor)

        // Transformar Vencimento em Data
        cliente.vencimento = mudarVencimento(cliente.vencimento)

        // Calcular a Data em que o Cliente estará em bloqueio
        cliente.data_do_bloqueio = calcularDatadoBloqueio(cliente.vencimento, cliente.bloqueia_com)

        // Calcular o tempo restante para entrar em bloqueio
        cliente.tempoParaEntrarEmBloqueio = calcularTempoParaEntraremBloqueio(cliente)

        // Definir qual mensagem será enviada ao cliente
        cliente.tipoDeMensagem = classificarMensagens(cliente)

    })



}



function classificarMensagens(cliente) {

    let conexao = cliente.status
    let tempoParaEntrarEmBloqueio = Number(cliente.tempoParaEntrarEmBloqueio)
    let diasEmAtraso = Number(cliente.diasEmAtraso)
    let bloqueiaCom = Number(cliente.bloqueia_com)
    let valorAberto = cliente.valor

    if (tempoParaEntrarEmBloqueio === 1) {
        return "BLOQUEIA AMANHÃ";
    } else if (conexao === "Bloqueado" && diasEmAtraso >= 41) {
        return "50+MENSALIDADE";
    } else if (conexao === "Bloqueado" && diasEmAtraso < 41 && diasEmAtraso >= 31) {
        return "DESCONTO+MENSALIDADE";
    } else if (conexao === "Bloqueado" && diasEmAtraso < 34 && diasEmAtraso >= 20 && bloqueiaCom === 6) {
        return "DESCONTO";
    } else if (conexao === "Bloqueado" && (tempoParaEntrarEmBloqueio === "Passou" || tempoParaEntrarEmBloqueio === 0)) {
        return "BLOQUEADO";
    } else if (conexao === "Ativo" && !valorAberto) {
        return "PADRÃO2";
    } else if (conexao === "Ativo") {
        return "PADRÃO";
    } else {
        return false;
    }

}








function lerArquivoJson(caminho) {

    log(caminho)

    const dados = JSON.parse(fs.readFileSync(caminho))

    return dados

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}


// Auxiliares

function mudarNome(nome) {

    return nome.split(" ")[0]

}

function mudarNumero(numero) {

    let telefone = numero;
    let telefoneSemCaracteres = telefone.replace(/\D/g, ''); // remove tudo que não é dígito
    let telefoneFormatoNovo = telefoneSemCaracteres.substring(0, 11);

    return telefoneFormatoNovo

}

function mudarVencimento(data) {

    let partesData = data.split('-'); // separa a data em ano, mês e dia
    let ano = partesData[0];
    let mes = partesData[1] - 1; // subtrai 1 do mês, pois o objeto Date considera os meses de 0 a 11
    let dia = partesData[2];

    let dataFormatada = new Date(ano, mes, dia).toLocaleDateString(); // converte a data para uma string de data formatada

    return dataFormatada;

}

function calcularDatadoBloqueio(vencimento, dias_para_bloquear) {

    let dataString = vencimento;
    let partesData = dataString.split('/'); // separa a data em dia, mês e ano
    let dia = partesData[0];
    let mes = partesData[1] - 1; // subtrai 1 do mês, pois o objeto Date considera os meses de 0 a 11
    let ano = partesData[2];

    let tempoEmMilissegundos = Date.parse(`${ano}-${mes + 1}-${dia}`); // converte a string em uma data em milissegundos
    let data = new Date(tempoEmMilissegundos); // cria um objeto Date a partir do valor de tempo em milissegundos

    let dataDaquiA6Dias = new Date(data.getTime() + (Number.parseInt(dias_para_bloquear) * 24 * 60 * 60 * 1000)); // adiciona 6 dias à data atual

    return dataDaquiA6Dias.toLocaleDateString()

}

function mudarValor(valor) {

    const novoValor = valor.replace(".", ",")

    return novoValor

}

function mudarConexao(conexao) {

    if (conexao == "A" || conexao == "FA" || conexao == "AA") {
        return "Ativo"
    } else if (conexao == "CA" || conexao == "CM" || conexao) {
        return "Bloqueado"
    }

    return false

}

function calcularTempoParaEntraremBloqueio(cliente){

    let diaDoBloqueio = Date.parse(converterEmDataJs(cliente.data_do_bloqueio))

    try {

        if (diaDoBloqueio - Date.now() < 0) {

            if (cliente.conexao = "Bloqueado"){
                return "Passou"
            } else {
                return "Confiança"
            }

        } else {

            let data = parseInt((new Date(parseInt(diaDoBloqueio - Date.now()))) / (1000 * 60 * 60 * 24))

            return data.toLocaleString()

        }

    } catch (e) {
        return false
    }

}

function converterEmDataJs(dataString){

    var partesDaData = dataString.split("/");
    var dia = partesDaData[0];
    var mes = partesDaData[1] - 1; // subtrai 1 do mês para ficar na faixa 0-11
    var ano = partesDaData[2];
  
    // Cria um objeto de data em JavaScript com as partes da data
    var data = new Date(ano, mes, dia);

    return data;

}