

module.exports = RegistrarMensagens

function RegistrarMensagens(sessões){
    
    const { databases } = require("../../DataBase/Start/StartDatabases");
    const mensagensDb = databases.bds.mensagensDb

    sessões.forEach(sessão => {
        
        sessão.cliente.on("message", async (msg)=>{

            const numero = msg.from
            const mensagem = msg.body
            const msgId = msg.id.id
            const celular = sessão.celular

            await mensagensDb.create({
                numero: numero,
                mensagem: mensagem,
                celular: celular,
                msgId: msgId,
                data: buscarDataAtual()
            })

        })

    });

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}/${month}/${year}`

}