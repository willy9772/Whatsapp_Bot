
module.exports = AtualizarAck


function AtualizarAck(sessões) {

    const { databases } = require("../../DataBase/Start/StartDatabases");
    const logs = databases.bds.logsDb

    sessões.forEach(sessão => {

        let instancia = sessão.cliente

        instancia.on('message_ack', async (mensagem) => {
            try {

                const msgId = mensagem.id.id
                const msg_ack = mensagem.ack

                const msg = await procurarMsg(msgId)

                if (!msg) { return }

                await msg.update({
                    status: verificarAck(msg_ack)
                })

            } catch (error) {
                await logs.create({
                    operação: 'Atualizar Ack',
                    erro: JSON.stringify(error)
                })
            }
        })


    });




}


async function procurarMsg(msgID) {

    const { databases } = require("../../DataBase/Start/StartDatabases");
    const mensagensRecebidas = databases.bds.mensagensDb
    const mensagensEnviadas = databases.bds.mensagensEnviadasDb

    let consulta = await mensagensEnviadas.findOne({ where: { msgId: msgID } })

    if (!consulta) {
        consulta = await mensagensRecebidas.findOne({ where: { msgId: msgID } })
    }

    if (!consulta) {
        return false
    }

    return consulta

}

function verificarAck(ack) {

    let ack_state

    switch (ack) {
        case -1: ack_state = "erro"; break
        case 0: ack_state = "pendente"; break
        case 1: ack_state = "enviado"; break
        case 2: ack_state = "recebido"; break
        case 3: ack_state = "lido"; break
        case 4: ack_state = "reproduzido"; break
        default: ack_state = "pendente"; break
    }

    return ack_state

}