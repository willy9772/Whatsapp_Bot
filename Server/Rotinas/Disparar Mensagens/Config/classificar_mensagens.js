const fs = require("fs")
const moment = require("moment/moment")
const path = require("path")
const { Op } = require("sequelize")

module.exports = classificarMensagens

async function classificarMensagens() {

    const cacheDir = path.join(__dirname, "..", "Data", "Cache", buscarDataAtual())

    const abc = JSON.parse(fs.readFileSync(path.join(cacheDir, "abc.json")))
    const cdefg = JSON.parse(fs.readFileSync(path.join(cacheDir, "cdefg.json")))

    const todosOsClientes = abc.concat(cdefg)

    await separar_mensagens_por_tipo(cacheDir, todosOsClientes)

}

async function separar_mensagens_por_tipo(cacheDir, clientes) {
    const message_types = JSON.parse(fs.readFileSync(path.join(__dirname, "TipodeMensagens", "TiposdeMensagens.json")))
    let geral = []
    const clientesNotificadosRecentemente = await ClientesNotificadosRecentemente()

    for (const msg of message_types) {
        let correspondentes = 0
        let notificadosRecentes = 0

        for (const cliente of clientes) {
            if (cliente.tipoDeMensagem === msg.tipo) {

                const FoiNotificadoRecentemente = clientesNotificadosRecentemente.filter((c) => c.numero === cliente.telefone)
                if (FoiNotificadoRecentemente.length !== 0) { notificadosRecentes++; continue }

                cliente.mensagem = criar_mensagem_com_variaveis(cliente, msg)
                geral.push(cliente)
                correspondentes++
            }
        }

        console.log(`São ${correspondentes} clientes para ser notificados com a mensagem de ${msg.tipo} e ${notificadosRecentes} notificados Recentemente`)

    }

    criar_ou_alterar_arquivo(cacheDir, "GERAL", geral)
}

async function ClientesNotificadosRecentemente() {

    const { databases } = require("../../../DataBase/Start/StartDatabases")
    const enviadosDb = databases.bds.mensagensEnviadasDb

    try {

        const dataInicial = moment().subtract(3, 'days').startOf('day').toDate();
        const dataFinal = moment().endOf('day').toDate();

        // Realize a busca no banco de dados
        const result = await enviadosDb.findAll({
            where: {
                createdAt: {
                    [Op.gte]: dataInicial,
                    [Op.lte]: dataFinal
                }
            }
        }).catch(erro => {
            console.error(erro);
        });

        return result

    } catch (error) {
        console.log(`Erro ao buscar clientes notificados recentemente ${error}`);
    }

}

function criar_mensagem_com_variaveis(cliente, msg) {

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

    for (const chave in variaveis) {

        let msg_var = `{{${chave.toUpperCase()}}}`

        if (mensagem_predefinida.includes(msg_var)) {
            mensagem_predefinida = mensagem_predefinida.replace(new RegExp(msg_var, "g"), variaveis[chave]);
        }

    }

    if (mensagem_predefinida.includes("undefined") || mensagem_predefinida.includes("{{") || mensagem_predefinida.includes('false')) {
        return false
    }

    return mensagem_predefinida

}

function criar_ou_alterar_arquivo(diretorio, nome, conteudo) {

    fs.writeFileSync(path.join(diretorio, nome + ".json"), JSON.stringify(conteudo))

}

function voltar_um_mes(vencimento) {

    let [dia, mes, ano] = vencimento.split("/");

    const data = new Date(ano, mes - 1, dia);

    data.setMonth(data.getMonth() - 1);

    const novoDia = data.getDate().toString().padStart(2, "0");
    const novoMes = (data.getMonth() + 1).toString().padStart(2, "0");
    const novoAno = data.getFullYear().toString();

    return `${novoDia}/${novoMes}/${novoAno}`;
}

function converter_dia_e_mes(str) {

    const [dia, mes] = [str.split("/")[0], str.split("/")[1]]

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