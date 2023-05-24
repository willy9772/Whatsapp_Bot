const tbody = document.querySelector('tbody');
const form = document.querySelector('form');

(async function () {

    await fetch('/mensagens').then((res) => res.json().then((data) => {
        renderTabela(data)
    }))

})()




form.addEventListener('submit', async (evento) => {

    evento.preventDefault()

    const filtros = buscarFiltros()

    await fetch('/filtrar', {
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(filtros),
        method: 'POST'
    }).then((res) => res.json().then((result) => {
        renderTabela(result)
    }))

})

function buscarFiltros() {

    const elementos = form.querySelectorAll('input')

    const data = elementos[0]
    const numero = elementos[1]
    const celular = elementos[2]
    const status = elementos[3]

    const objeto = {
        data: data.value,
        numero: numero.value,
        celular: celular.value,
        status: status.value
    }

    return objeto

}

function renderTabela(dados) {

    tbody.innerHTML = ``

    dados.forEach((dado) => {

        const li = gerarTr(dado)

        tbody.append(li)

    })


}

function gerarTr(dado) {

    const data = dado.createdAt
    const numero = dado.numero
    const celular = dado.celular
    const status = dado.status
    const mensagem = dado.mensagem


    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td>${AjustarData(data)}</td>
    <td>${numero}</td>
    <td>${celular}</td>
    <td>${status}</td>
    <td>${mensagem}</td>
    `

    return tr

}

function AjustarData(string) {

    const dataString = string;
    const data = new Date(dataString);
    const dia = data.getUTCDate();
    const mes = data.getUTCMonth() + 1;
    const ano = data.getUTCFullYear();

    const hora = data.getUTCHours()
    const minuto = data.getUTCMinutes()

    const dataFormatada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano} ${hora}:${minuto}`;

    return dataFormatada

}