let nome = prompt("Qual seu nome?")
nome = {
    name: nome
}
let entrarSala = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);

entrarSala.catch(function () {
    nome.name = prompt("Digite outro nome pois esse já está em uso:");
});
function manterConexao() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
}
let idInterval = setInterval(manterConexao, 4000);


let mensagens = [];

pegarMensagens();

function pegarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(carregarMensagens)
}

function carregarMensagens(resposta) {
    mensagens = resposta.data;
    renderizarMensagens();
}

function renderizarMensagens() {
    const chat = document.querySelector(".container");
    chat.innerHTML = "";
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "message") {
            chat.innerHTML += `
                <div class="mensagem">
                    <div class="time">(${mensagens[i].time})</div>
                    <div class="from"><strong>${mensagens[i].from}</strong></div>
                    <div class="to"> para <strong>${mensagens[i].to}:</strong></div>
                    <div class="text">${mensagens[i].text}</div>
                </div>`
        } else if (mensagens[i].type === "status") {
            chat.innerHTML += `
                <div class="mensagem status">
                    <div class="time">(${mensagens[i].time})</div>
                    <div class="from"><strong>${mensagens[i].from}</strong></div>
                    <div class="text">${mensagens[i].text}</div>
                </div>`
        } else if (mensagens[i].type === "private_message" && mensagens[i].to === nome.name) {
            chat.innerHTML += `
                <div class="mensagem reservada">
                    <div class="time">(${mensagens[i].time})</div>
                    <div class="from"><strong>${mensagens[i].from}</strong></div>
                    <div class="to"> para <strong>${mensagens[i].to}:</strong></div>
                    <div class="text">${mensagens[i].text}</div>
                </div>`
        }
    }
    aparecerMensagem()
}


function enviarMensagem() {
    const mensagemValue = document.querySelector(".mensagemEscrita").value;

    const mensagemEnviada = {
        "from": nome.name,
        "to": "Todos",
        "text": mensagemValue,
        "type": "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnviada)

    promise.then(pegarMensagens);
    promise.catch(function () {
        window.location.reload();
    });
    document.querySelector(".mensagemEscrita").value = '';
    aparecerMensagem()
}
setInterval(pegarMensagens, 3000);

function aparecerMensagem() {
    const apareca = document.querySelector('.mensagem');
    apareca.scrollIntoView();
}