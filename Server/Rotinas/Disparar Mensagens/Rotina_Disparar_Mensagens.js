const FiltrarDados = require("./Config/FiltrarDados");
const classificarMensagens = require("./Config/classificar_mensagens");
const { atualizarDadosdeCobranca } = require("./Updates/BuscarDadosdeCobrança");
const enviarMensagens = require("./Config/Whatsapp/dispararMensagens");
const organizar_por_celular = require("./Config/organizar_por_celular");

module.exports = { Iniciar_Rotina_Cobrança }

async function Iniciar_Rotina_Cobrança(sessoes_whatsapp) {

    // setInterval(async () => {
    if (await podeEnviar()) {
        console.log(`\nIniciando a rotina de Cobrança Automática\n`);
        dispararMensagens(sessoes_whatsapp)
    }
    // }, 10000)

}

async function podeEnviar() {

    if (verificar_hora()) {
        if (!éFimdeSemana()) {
            if (!(await verificarSeJaFoiDisparado())) {
                return true
            } else {
                console.log(`\nOs clientes já foram notificados hoje\n`)
            }
        } else {
            console.log(`\nÉ fim de semana\n`);
        }
    } else {
        console.log(`\nAinda não é Hora de cobrar os Clientes\n`);
    }

    return false

}
async function dispararMensagens(sessoes_whatsapp) {

    await atualizarDadosdeCobranca()
    FiltrarDados()
    await classificarMensagens()
    organizar_por_celular()
    enviarMensagens(sessoes_whatsapp)

}
function verificar_hora() {

    const data = new Date()
    const hora = data.getHours()

    if (hora >= 8 && hora <= 18) {
        return true
    } else {
        return false
    }

}
function éFimdeSemana() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 1;
}
async function verificarSeJaFoiDisparado() {

    const { databases } = require("../../DataBase/Start/StartDatabases");
    const enviadosDb = databases.bds.mensagensEnviadasDb

    const clientesEnviados = await enviadosDb.findAll({ where: { data: DataAtual() } })

    if (clientesEnviados.length !== 0) {
        return true
    } else {
        return false
    }

}
function DataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}