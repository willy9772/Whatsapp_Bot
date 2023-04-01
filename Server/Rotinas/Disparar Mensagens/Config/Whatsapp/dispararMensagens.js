const fs = require("fs")
const path = require("path")

module.exports = enviarMensagens

async function enviarMensagens(instancias) {

    const envio = new Promise(async (res, rej) => {
        try {

            instancias.forEach(async instancia => {
                await disparar(instancia)
            });

            res(true)

        } catch (e) {
            console.log(`Houve um erro ao enviar as mensagens na instancia ${instance.nome}`);
            rej(false)
        }
    })

    return await envio

}

async function disparar(instance) {

    const cliente = instance.cliente
    const celular = instance.celular
    const tipos = classificar_celular(celular)

    console.log(tipos);

}



function classificar_celular(celular) {

    const tipo_de_mensagens = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "TipodeMensagens", "TiposdeMensagens.json")))

    let categorias_para_enviar = []

    tipo_de_mensagens.forEach((modelo) => {

        modelo.web_instance_type.forEach((type) => {

            if (type == celular) {
                categorias_para_enviar.push(modelo.tipo)
            }

        })

    })

    return categorias_para_enviar

}

function buscarArquivo(arquivo) {

    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "Data", "Cache", buscarDataAtual(), "mensagens", arquivo + ".json")))

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}