const express = require('express');
const http = require('http');
const socketIO = require('socket.io')

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const ejs = require ('ejs');
const path = require('path');
const { Socket } = require('dgram');

app.use(express.static(path.join(__dirname, 'public')));
//console.log(path.join(__dirname, 'public'));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (request, response) => {
    response.render('index.html')
});

// LOGICA DO SOCKET.IO - ENVIO E PROPAGAÇÃO DE MENSAGEM //

//Array que simula o banco de dados das mensagnes

let messages = [];
// ESTRUTURA DE CONEXÃO DO SCKET.IO

io.on('connection', socket => {

    //TESTE DE CONEXÃO
    console.log('NOVO USUARIO CONECTADO: ' + socket.id);


    // Recupera e mantem(mostra) as mensagens entre o from e o back 
    socket.emit('previousMessage', messages);

    //logica de chat chat quando uma mensagem é enviada
    socket.on('sedMessage', data => {

        //adicionar a mensagem no final do array de messagem 
        messages.push(data)

        socket.broadcast.emit('receiveMessage', data)
    });

});

server.listen(3000, () => {
    console.log('CHAT RODANDO EM - HTTP://localhost:3000')
});