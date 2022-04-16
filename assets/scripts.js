/* LÓGICA PARA O JAVASCRIPT:  
    *Rolar automaticamente a página (pesquisar scrollIntoView)
    *Deixar as mensagens reservadas visíveis somente para o destinatário específico
    *Ao entrar na sala o usuário deve inserir seu nome (prompt)
        *enviar o nome para o servidor para cadastrar o usuário se o servidor responder com sucesso
        *se o servidor retornar com errp o nome está em uso: pedir para o usuário digitar outro nome
    *A cada 4 segundos avisar que o usuário está na sala, caso contrário será considerado que "saiu da sala"
    *Inserir a mensagem no HTML
    *Mandar a mensagem para o servidor (push)
    *Pegar a mensagem do servidor e atualizar a págna a cada 3s (get)
*/


let nome = prompt("Qual seu nome?")
        nome = {
            name: nome
        }
let entrarSala = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);

entrarSala.catch(function () {
            nome.name = prompt("Digite outro nome pois esse já está em uso:");
        });
function manterConexao() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status",nome);
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
        } else if(mensagens[i].type === "private_message" && mensagens[i].to === nome.name){
            chat.innerHTML += `
                <div class="mensagem reservada">
                    <div class="time">(${mensagens[i].time})</div>
                    <div class="from"><strong>${mensagens[i].from}</strong></div>
                    <div class="to"> para <strong>${mensagens[i].to}:</strong></div>
                    <div class="text">${mensagens[i].text}</div>
                </div>`
        }
    }
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
    promise.catch(function (){
        window.location.reload();
    });
    const apareca = document.querySelector('.mensagem');
    apareca.scrollIntoView();
}

setInterval(pegarMensagens, 3000);
