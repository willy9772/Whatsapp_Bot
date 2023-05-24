const { Iniciar_Rotina_Cobrança } = require("../Server/Rotinas/Disparar Mensagens/Rotina_Disparar_Mensagens");
const carregar_sessoes_whatsapp = require("./Whatsapp/Sessões/carregar_whatsapp")

mostrarAssinatura();

(async function () {

	// Iniciar A rotina de Cobrança
	const sessoes_whatsapp = await carregar_sessoes_whatsapp()
	Iniciar_Rotina_Cobrança(sessoes_whatsapp)

})()







function mostrarAssinatura() {
	console.log("_______________________________________________________________________________________________")
	console.log("     _______     _       ___ _____                                    __                   __")
	console.log("    / _____ \\   | |     / (_) / (_)___ _____ ___     ____ ____  _____/ /_  ____ __________/ /")
	console.log("   / / ___/ /   | | /| / / / / / / __ `/ __ `__ \\   / __ `/ _ |/ ___/ __ \\/ __ `/ ___/ __  / ")
	console.log("  / / /__  /    | |/ |/ / / / / /_/_/ / / / / / /  / /_/ /  __/ /  / / / / /_/ / /  / /_/ /  ")
	console.log(" / /____/ /     |__/\\__/_/_/_/_/\\__,_/_/ /_/ /_/   \\__, /\\___/_/  /_/ /_/\\__,_/_/   \\__,_/   ")
	console.log(` \\_______/                                        /____/                                     `)
	console.log(`_______________________________________________________________________________________________`)
} 