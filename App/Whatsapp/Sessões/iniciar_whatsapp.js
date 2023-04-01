const qr = require("qrcode-terminal")

module.exports = iniciar_whatsapp

async function iniciar_whatsapp(sessão) {

    const cliente = await new Promise((res, rej) => {

        console.log(`Carregando Whatsapp-Web para a Sessão ${sessão}`);

        const { Client, LocalAuth } = require('whatsapp-web.js');
        const client = new Client({ authStrategy: new LocalAuth({ clientId: sessão }) })

        client.on('qr', (code) => {
            console.log(`Qr Code para a Sessão ${sessão}`);
            qr.generate(code, { small: true })
        });

        client.on('ready', () => {
            console.log(`Whatsapp da Sessão ${sessão} iniciado com sucesso!`);
            res(client)
        });

        client.on("auth_failure", () => {
            console.log(`Houve um erro ao iniciar a sessão ${sessão}`);
            rej(false)
        })

        client.initialize();

    })

    return await cliente

}