const express = require("express")
const server = express()
const bodyParser = require('body-parser')


function IniciarAcompanhamentodeMensagens() {

    // Iniciando Servidor Express

    server.use(express.static(__dirname))
    server.use(bodyParser.json())

    // Rotas
    server.get('/', (req, res) => {
        res.sendFile(__dirname + '/visualizacao.html')
    })

    server.get('/mensagens', async (req, res) => {

        const { databases } = require("../DataBase/Start/StartDatabases")
        const mensagensEnviadasDb = databases.bds.mensagensEnviadasDb

        const mensagens = await mensagensEnviadasDb.findAll()

        res.setHeader('content-type', 'application/json')
        res.send(JSON.stringify(mensagens))

    })

    server.post('/filtrar', async (req, res) => {

        const { databases } = require("../DataBase/Start/StartDatabases")
        const mensagensEnviadasDb = databases.bds.mensagensEnviadasDb

        const filtros = req.body

        const filtro = {}
        if (filtros.data) {
            if (ajustarData(filtros.data)) {
                filtro.data = ajustarData(filtros.data)
            }
        }
        if (filtros.numero) {
            filtro.numero = filtros.numero
        }
        if (filtros.celular) {
            filtro.celular = filtros.celular
        }
        if (filtros.status) {
            filtro.status = filtros.status
        }

        const query = await mensagensEnviadasDb.findAll({
            where: filtro
        })

        res.send(query)

    })

    server.listen(5522, () => {
        console.log(`Servidor Sendo Executado com Sucesso!`)
    })

}

module.exports = { IniciarAcompanhamentodeMensagens }

function ajustarData(dataStringFormatada) {
    try {
        const [dia, mes, ano] = dataStringFormatada.split('/');

        const data = new Date(Date.UTC(ano, mes - 1, dia));
        data.setUTCHours(0, 0, 0, 0);

        const dataString = data.toISOString();
        return dataString
    } catch (error) {
        return false
    }
}