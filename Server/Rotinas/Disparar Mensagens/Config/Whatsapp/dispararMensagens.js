const { log } = require("console");
const fs = require("fs")
const path = require("path")

module.exports = enviarMensagens

async function enviarMensagens(instancias) {

    criar_diretorio_logs()

    const promessas = instancias.map(async (instance) => {
        try {
            const instancia = await disparar(instance);
            return instancia;
        } catch (e) {
            console.log(`Houve um erro ao enviar as mensagens na instancia ${instance.nome}`);
            return false;
        }
    });

    const resultados = await Promise.all(promessas);

    if (resultados.every((resultado) => resultado)) {
        log(`O envio de mensagens de cobrança em todas as instâncias foi concluído com sucesso!`);
        return true;
    } else {
        throw new Error("Houve um erro ao enviar as mensagens em algumas instâncias.");
    }
}

async function disparar(instance) {
    const evento_disparar = new Promise(async (resolve, reject) => {
        try {

            const celular = instance.celular
            const clientes = buscarArquivo(celular)
            let enviados = []

            for (let i = 0; i < clientes.length; i++) {
                const cliente = clientes[i];

                await enviar_mensagem(cliente, instance)
                enviados.push(cliente)

            }

            salvarLogs(`${celular}-${buscarDataAtual()}`, enviados)
            log(`O envio de mensagens de cobrança no celular ${celular} foi concluido!`)
            resolve(true)

        } catch (error) {
            log(`Houve um erro ao disparar as mensagens na instancia ${instance.celular}`)
        }
    })

    return await evento_disparar

}

async function enviar_mensagem(cliente, instance) {
    const mensagem_enviada = new Promise((resolve, reject) => {
        setTimeout(async () => {

            try {
                const numero = "55" + cliente.telefone + "@c.us"
                const mensagem = cliente.mensagem
                const instancia = instance.cliente
    
                await instancia.sendMessage(numero, mensagem)
    
                const chat = await instancia.getChatById(numero)
                await chat.archive()
    
                log(`Mensagem enviada para ${numero}, com o tipo ${cliente.tipoDeMensagem}, no ${instance.celular}`)
    
                resolve(true)
            }
            catch (error) { 
                log(`Erro ao disparar as mensagens para o ID: ${cliente.id} o Erro:\n${error}`)
                reject(false)
            }

        }, 30000)
    })

    return await mensagem_enviada

}

function buscarArquivo(arquivo) {

    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "Data", "Cache", buscarDataAtual(), "mensagens", arquivo + ".json")))

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}

function salvarLogs(nome, conteudo) {
    fs.writeFileSync(path.join(__dirname, "..", "..", "Data", "Cache", buscarDataAtual(), "Logs", nome + ".json"), JSON.stringify(conteudo))
}

function criar_diretorio_logs() {
    fs.mkdirSync(path.join(__dirname, "..", "..", "Data", "Cache", buscarDataAtual(), "Logs"))
}