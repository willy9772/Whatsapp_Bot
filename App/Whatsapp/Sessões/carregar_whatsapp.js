const iniciar_whatsapp = require("./iniciar_whatsapp");

module.exports = carregar_sessoes_whatsapp

async function carregar_sessoes_whatsapp() {
    
    console.log(`\nCarregando Sessões do Whatsapp\n`);

    const sessões = await new Promise(async(res, rej)=>{
        const celulares = [
            "CELULAR_1",
/*             "CELULAR_2",
            "CELULAR_3",
            "CELULAR_4",
            "CELULAR_5",
            "CELULAR_6",
            "CELULAR_7", */
        ]
    
        let clientes_iniciados = []
    
        for (let i = 0; i < celulares.length; i++) {
            
            const celular = celulares[i];
            const cliente = await iniciar_whatsapp(celular)
    
            clientes_iniciados.push({
                cliente: cliente,
                celular: celular
            })
            
        }
    
        res(clientes_iniciados)

    })

    return sessões

}







