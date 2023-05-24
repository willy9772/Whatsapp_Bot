const path = require("path")
const fs = require("fs")
const FiltrarDados = require("./Config/FiltrarDados");
const classificarMensagens = require("./Config/classificar_mensagens");
const { atualizarDadosdeCobranca } = require("./Updates/BuscarDadosdeCobrança");
const enviarMensagens = require("./Config/Whatsapp/dispararMensagens");
const organizar_por_celular = require("./Config/organizar_por_celular");
const { log } = require("console");

module.exports = { Iniciar_Rotina_Cobrança }

async function Iniciar_Rotina_Cobrança(sessoes_whatsapp) {

    setInterval(() => {
        if (verificar_hora()) {
            if (!éFimdeSemana()) {
                if (!verificarSeJaFoiDisparado()) {
                    console.log(`\nIniciando a rotina de Cobrança Automática\n`);
                    dispararMensagens(sessoes_whatsapp)
                } else {
                    log(`\nOs clientes já foram notificados hoje\n`)
                }
            } else {
                console.log(`\nÉ fim de semana\n`);
            }
        } else {
            console.log(`\nAinda não é Hora de cobrar os Clientes\n`);
        }
    }, 120000)

}

async function dispararMensagens(sessoes_whatsapp) {

    await atualizarDadosdeCobranca()
    FiltrarDados()
    classificarMensagens()
    organizar_por_celular()
    enviarMensagens(sessoes_whatsapp)

}

function verificar_hora() {

    const data = new Date()
    const hora = data.getHours()

    if (hora != 9) {
        return false
    } else {
        return true
    }

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}

function éFimdeSemana() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

function verificarSeJaFoiDisparado() {

    if (fs.existsSync(path.join(__dirname, "Data", "Cache", buscarDataAtual(), "Logs"))) {
        return true
    } else {
        return false
    }

}