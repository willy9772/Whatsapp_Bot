const iniciar_whatsapp = require("./iniciar_whatsapp");

module.exports = carregar_sessoes_whatsapp

async function carregar_sessoes_whatsapp() {
    
    console.log(`\nCarregando Sessões do Whatsapp\n`);

    const [
        privado_teste,
        privado_teste_dois
    ] = await Promise.all([
        iniciar_whatsapp("privado_teste"),
        iniciar_whatsapp("privado_teste_dois"),
    ])

    let sessões = []
    
    sessões.push({
        cliente: privado_teste,
        nome: "privado_teste"
    })

    sessões.push({
        cliente: privado_teste_dois,
        nome: "privado_teste_dois"
    })

/*     const sessões = await new Promise(async(res, rej)=>{
        const sessoes = [
            "privado_teste",
            "privado_teste_dois",
            "MENSALIDADE_E_50",
            "BLOQUEADOS",
            "BLOQUEIA_AMANHA",
            "DESCONTO",
            "DESCONTO_E_MENSALIDADE",
            "PADRAO",
            "PADRAO2"
        ]
    
        let clientes_iniciados = []
    
        for (let i = 0; i < sessoes.length; i++) {
            
            const sessão = sessoes[i];
            const cliente = await iniciar_whatsapp(sessão)
    
            clientes_iniciados.push({
                cliente: cliente,
                nome: sessão
            })
            
        }
    
        res(clientes_iniciados)

    }) */

    return sessões

}







