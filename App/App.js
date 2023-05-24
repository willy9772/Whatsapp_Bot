const { IniciarAcompanhamentodeMensagens } = require("../Server/AcompanharCobranças/IniciarAcompanhamento");
const { StartDatabases } = require("../Server/DataBase/Start/StartDatabases");
const { MensagensRecebidas } = require("../Server/Mensagens Recebidas/IniciarAcompanhamento");
const AtualizarAck = require("../Server/Rotinas/Atualizar Status de Mensagens/AtualizarAck");
const { Iniciar_Rotina_Cobrança } = require("../Server/Rotinas/Disparar Mensagens/Rotina_Disparar_Mensagens");
const RegistrarMensagens = require("../Server/Rotinas/Registrar Mensagens/RegistrarMensagens");
const carregar_sessoes_whatsapp = require("./Whatsapp/Sessões/carregar_whatsapp")

mostrarAssinatura();

(async function () {

	// Carregar o banco de dados
	await StartDatabases()

	// Iniciar o Servidor para acompanhamento de Mensagens
	// IniciarAcompanhamentodeMensagens()
	// MensagensRecebidas()

	// // Iniciar Whatsapps
	// const sessoes_whatsapp = await carregar_sessoes_whatsapp()

	// Iniciar a Rotina de cobrança
	Iniciar_Rotina_Cobrança()

	// // Iniciar o Monitoramento das mensagens Recebidas para cada sessão no Whatsapp
	// RegistrarMensagens(sessoes_whatsapp)

	// // Iniciar o Monitoramento do Status das mensagens
	// AtualizarAck(sessoes_whatsapp)


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