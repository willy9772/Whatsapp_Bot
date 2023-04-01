const path = require("path")
const fs = require("fs")
const FiltrarDados = require("./Config/FiltrarDados");
const classificarMensagens = require("./Config/classificar_mensagens");
const { atualizarDadosdeCobranca } = require("./Updates/BuscarDadosdeCobrança");

module.exports = {Iniciar_Rotina_Cobrança}

async function Iniciar_Rotina_Cobrança(sessoes_whatsapp) {

    setInterval(()=>{
        if (verificar_hora()){

            console.log(`\nIniciando a rotina de Cobrança Automática\n`);
            dispararMensagens(sessoes_whatsapp)
            
        } else {
            console.log(`\nAinda não é Hora de cobrar os Clientes\n`);
        }
    }, 10000)

}

async function dispararMensagens(sessoes_whatsapp){

    await atualizarDadosdeCobranca()
    FiltrarDados()
    classificarMensagens()

}

function verificar_hora() {

    const data = new Date()
    const hora = data.getHours()

    if ( hora != 6 ) {
        return false
    } else if (!verificar_se_ja_foi_disparado()) {
        return true
    } else {
        return false
    }

}

function verificar_se_ja_foi_disparado(){

    return (fs.existsSync(path.join(__dirname, "Data", "Cache", buscarDataAtual(), `logs_${buscarDataAtual()}`)))? true: false

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}