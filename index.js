const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);  

const ejs = require("ejs");
const path = require('path');
const socetIO = require('socket.io');
const { Socket } = require("dgram");

const io = socetIO(server)

const mongoose = require('mongoose')

app.use(express.static(path.join(__dirname,'public')));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req,res)=>{
    res.render('indes.html')
})

function connectDB(){
    let dbURL = 'mongodb+srv://rafaelladrive1:R6W2OZu8ZoLub3pS@cluster0.jupxc.mongodb.net/'
    mongoose.connect(dbURL)
    mongoose.connection.on('error', console.error.bind(console, 'Connection error:'))
    mongoose.connection.once('open', function(){
        console.log('ATLAS MONGODB CONECTADO COM SUCESSO!')
    })
}

connectDB()

let Message = mongoose.model('Message', {usuario:String, data_hora:String, message:String})


// LÓGICA DO SOCKET.IO - ENVIO DE PROPAGAÇÃO DE MENSAGENS

//array que simula o branco de dados:
let messages = [];

Message.find({})
    .then(docs=>{
        messages = docs 
    }).catch(error=>{
        console.log(error);
    });

//ESTRUTURA DE CONEXÃO DO SOCKET.IO
io.on('connection', socket=>{

    //teste de conexão
    console.log('NOVO USUÁRIO CONECTADO: ' + socket.id)

    //Recupera e mantém (exibe) as mensagens entre o front e o back:
    socket.emit('previousMessage', messages);

    //Lógica de chat quando uma mensagem é enviada:
    socket.on('sendMessage', data=>{

        //adiciona a mensagem no ginal do array de menssagens:
        //messages.push(data);

        let message = new Message(data)

        message.save()
        .then(
            socket.broadcast.emit('receivedMessage', data)
        ).catch(error=>{
                console.log(error)
            });

        console.log('QTD MENSAGENS: '+messages.length)

    });

    console.log('QTD MENSAGENS: '+messages.length)

})

server.listen(3000, ()=>{console.log("chat rodando em http://localhost:3000")});