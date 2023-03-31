const FiltrarDados = require("./Config/FiltrarDados");
const { atualizarDadosdeCobranca } = require("./Updates/BuscarDadosdeCobrança");

module.exports = Disparar_Mensagens_De_Cobrança

Disparar_Mensagens_De_Cobrança()

async function Disparar_Mensagens_De_Cobrança(){

    await atualizarDadosdeCobranca()
    FiltrarDados()

}