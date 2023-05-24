const { log } = require("handlebars");
const iniciar_whatsapp = require("./iniciar_whatsapp");

module.exports = carregar_sessoes_whatsapp

async function carregar_sessoes_whatsapp() {

    console.log(`\nCarregando Sessões do Whatsapp\n`);

    const sessões = await new Promise(async (res, rej) => {
        const celulares = [
            "CELULAR_1",
            "CELULAR_2",
            "CELULAR_3",
            "CELULAR_4",
            "CELULAR_5",
            // "CELULAR_6",
            // "CELULAR_7",
        ]

        const instancias = celulares.map(async (celular) => {
            try {
                const instance = await iniciar_whatsapp(celular)

                const arr = {
                    celular: celular,
                    cliente: instance
                }

                return arr
            } catch (error) {
                log(`Houve um erro ao iniciar a instância do celular ${celular}\nO erro é: ${error}`)
                return false
            }
        })

        let clientes_iniciados = await Promise.all(instancias)

        res(clientes_iniciados)

    })

    return await sessões

}







