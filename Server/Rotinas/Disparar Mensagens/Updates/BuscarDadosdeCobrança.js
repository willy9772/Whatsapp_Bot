const fs = require("fs")
const puppeteer = require("puppeteer")
const path = require("path");
const { log } = require("console");

module.exports = { atualizarDadosdeCobranca }

async function atualizarDadosdeCobranca() {

	await Promise.all([
		atualizarDados_abc(),
		atualizarDados_cdefg()
	])

	return true

}

async function atualizarDados_abc() {

	console.log(`Buscando Dados da URL http://10.254.1.13/abc/`);

	const dados = await new Promise(async (res, rej) => {
		try {

			const page = await newPage(`http://10.254.1.13/abc/`)

			await page.waitForSelector("tbody")

			const dados = await page.evaluate(async() => {

				let clientes = []

				const tBody = document.querySelector("tbody")
				const Trs = tBody.querySelectorAll("tr")

				Trs.forEach((tr) => {

					const Tds = tr.querySelectorAll("td")

					clientes.push({
						id: Tds[0].innerText,
						nome: Tds[1].innerText,
						telefone: Tds[2].innerText,
						status: Tds[3].innerText,
						vencimento: Tds[4].innerText,
						bloqueia_com: Tds[5].innerText,
						tempo_em_atraso: Tds[6].innerText,
						valor: Tds[7].innerText
					})

				})

				return clientes
				
			})
			
			console.log(`A busca por clientes em http://10.254.1.13/abc/  terminou com sucesso!`)
			const browser = await page.browser()
			await browser.close()

			res(dados)

		} catch (error) {

			console.log(`Houve um erro ao Atualizar os dados em em http://10.254.1.13/abc/, o erro: ` + error)
			rej(false)

		}
	})

	colocarNoCache("abc.json", dados)

	return true

}

async function atualizarDados_cdefg() {

	console.log(`Buscando Dados da URL http://10.254.1.13/cdefg/`);

	const dados = await new Promise(async (res, rej) => {
		try {

			const page = await newPage(`http://10.254.1.13/cdefg/`)

			await page.waitForSelector("tbody")

			const dados = await page.evaluate(async() => {

				let clientes = []

				const tBody = document.querySelector("tbody")
				const Trs = tBody.querySelectorAll("tr")

				Trs.forEach((tr) => {

					const Tds = tr.querySelectorAll("td")

					clientes.push({
						id: Tds[0].innerText,
						nome: Tds[1].innerText,
						telefone: Tds[2].innerText,
						status: Tds[3].innerText,
						vencimento: Tds[4].innerText,
						bloqueia_com: Tds[5].innerText,
						tempo_em_atraso: Tds[6].innerText
					})

				})

				return clientes
				
			})
			
			console.log(`A busca por clientes em http://10.254.1.13/cdefg/  terminou com sucesso!`)
			const browser = await page.browser()
			await browser.close()

			res(dados)

		} catch (error) {

			console.log(`Houve um erro ao Atualizar os dados em em http://10.254.1.13/cdefg/, o erro: ` + error)
			rej(false)

		}
	})

	colocarNoCache("cdefg.json", dados)

	return true

}

function colocarNoCache(nome_do_arquivo, conteudo) {

	const CacheDir = path.join(__dirname, "..", "Data", "Cache", buscarDataAtual())

	let FileDir = path.join(CacheDir, nome_do_arquivo)

	if (!fs.existsSync(CacheDir)) {
		fs.mkdirSync(CacheDir)
	}

	fs.writeFileSync(FileDir, JSON.stringify(conteudo))

	log(`O cache foi atualizado com sucesso com o arquivo ${[nome_do_arquivo]}`)

}

async function newPage(url) {

	// Launch the browser
	const browser = await puppeteer.launch({ headless: true });

	// Create a page
	const page = await browser.newPage();

	// Go to your site
	await page.goto(url);

	return page

}

function buscarDataAtual() {

	const date = new Date()

	const day = date.getDate().toString().padStart(2, 0)
	const month = (date.getMonth() + 1).toString().padStart(2, 0)
	const year = date.getFullYear().toString()

	return `${day}-${month}-${year}`

}