const express = require("express")
const server = express()
const bodyParser = require('body-parser')


function MensagensRecebidas() {

    // Iniciando Servidor Express

    server.use(express.static(__dirname))
    server.use(bodyParser.json())

    // Rotas
    server.get('/', (req, res) => {
        res.sendFile(__dirname + '/visualizacao.html')
    })

    server.get('/mensagens', async (req, res) => {

        const { databases } = require("../DataBase/Start/StartDatabases")
        const mensagensDb = databases.bds.mensagensDb

        const mensagens = await mensagensDb.findAll()

        res.setHeader('content-type', 'application/json')
        res.send(JSON.stringify(mensagens))

    })

    server.post('/filtrar', async (req, res) => {

        const { databases } = require("../DataBase/Start/StartDatabases")
        const mensagensDb = databases.bds.mensagensDb

        const filtros = req.body

        const filtro = {}
        if (filtros.data) {
            filtro.data = ajustarData(filtros.data)
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

        const query = await mensagensDb.findAll({
            where: filtro
        })

        res.send(query)

    })

    server.listen(5523, () => {
        console.log(`Servidor Sendo Executado com Sucesso!`)
    })

}

module.exports = { MensagensRecebidas }