const { buscarDataAtual } = require("../../Rotina_Disparar_Mensagens")
const fs = require("fs")
const path = require("path")

module.exports=dispararMensagens

function dispararMensagens(instance, aquivo){

    




}


function buscarArquivo(arquivo){

    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "Data", "Cache", buscarDataAtual(), "mensagens", arquivo + ".json")))

}