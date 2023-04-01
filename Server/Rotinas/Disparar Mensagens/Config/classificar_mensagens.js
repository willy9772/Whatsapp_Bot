const { log } = require("console")
const fs = require("fs")
const path = require("path")

module.exports = classificarMensagens

function classificarMensagens() {

    const cacheDir = path.join(__dirname, "..", "Data", "Cache", buscarDataAtual())

    const abc = JSON.parse(fs.readFileSync(path.join(cacheDir, "abc.json")))
    const cdefg = JSON.parse(fs.readFileSync(path.join(cacheDir, "cdefg.json")))

    const todosOsClientes = abc.concat(cdefg)

    criarPasta(cacheDir, "mensagens")

    separar_mensagens_por_tipo(cacheDir, todosOsClientes)

}

function separar_mensagens_por_tipo(cacheDir, clientes) {

    const message_types = JSON.parse(fs.readFileSync(path.join(__dirname, "TipodeMensagens", "TiposdeMensagens.json")))

    message_types.forEach((msg) => {

        let clientes_correspondentes = []

        clientes.forEach((cliente) => {

            if (cliente.tipoDeMensagem == msg.tipo) {

                cliente.mensagem = criar_mensagem_com_variaveis(cliente, msg)

                clientes_correspondentes.push(cliente)
                
            }

        })

        console.log(`São ${clientes_correspondentes.length} clientes para ser notificados com a mensagem de ${msg.tipo}`)

        criar_ou_alterar_arquivo(cacheDir, msg.tipo, clientes_correspondentes)

    })


}

function criar_mensagem_com_variaveis(cliente, msg){

    // Declarar Variáveis

    let variaveis = {
        saudacao: gerar_saudacao(),
        nome: cliente.nome,
        valor: cliente.valor,
        vencimento: converter_dia_e_mes(cliente.vencimento),
        dia_para_bloquear: converter_dia_e_mes(cliente.data_do_bloqueio),
        "VENCIMENTO-1MES": converter_dia_e_mes(voltar_um_mes(cliente.vencimento))
    }

    let mensagem_predefinida = msg.mensagem
    
    for (const chave in variaveis){

        let msg_var = `{{${chave.toUpperCase()}}}`

        if (mensagem_predefinida.includes(msg_var)) {
            mensagem_predefinida = mensagem_predefinida.replace(new RegExp(msg_var, "g"), variaveis[chave]);
        }

    }

    if (mensagem_predefinida.includes("undefined") || mensagem_predefinida.includes("{{")) {
        return false
    }

    return mensagem_predefinida

}





function criarPasta(diretorio, nome_da_pasta) {

    if (!fs.existsSync(path.join(diretorio, nome_da_pasta))) {
        fs.mkdirSync(path.join(diretorio, nome_da_pasta))
    } else {
        return
    }

}

function criar_ou_alterar_arquivo(diretorio, nome, conteudo) {

        fs.writeFileSync(path.join(diretorio, "mensagens", nome + ".json"), JSON.stringify(conteudo))

}


function voltar_um_mes(vencimento) {

    let [ dia, mes, ano ] = vencimento.split("/");

    const data = new Date(ano, mes - 1, dia);

    data.setMonth(data.getMonth() - 1);

    const novoDia = data.getDate().toString().padStart(2, "0");
    const novoMes = (data.getMonth() + 1).toString().padStart(2, "0");
    const novoAno = data.getFullYear().toString();

    return `${novoDia}/${novoMes}/${novoAno}`;
  }

function converter_dia_e_mes(str){

    const [dia, mes] = [ str.split("/")[0], str.split("/")[1] ]

    return `${dia}/${mes}`


}

function gerar_saudacao() {
    var data = new Date();
    var hora = data.getHours();
    if (hora >= 5 && hora < 12) {
      return "Bom dia";
    } else if (hora >= 12 && hora < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }
  

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}