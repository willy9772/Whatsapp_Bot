const FiltrarDados = require("./Config/FiltrarDados");
const classificarMensagens = require("./Config/classificar_mensagens");
const { atualizarDadosdeCobranca } = require("./Updates/BuscarDadosdeCobrança");

module.exports = Disparar_Mensagens_De_Cobrança

Disparar_Mensagens_De_Cobrança()

async function Disparar_Mensagens_De_Cobrança(){

    await atualizarDadosdeCobranca()
    FiltrarDados()
    classificarMensagens()

}