const express = require('express');
const http = require('http');

const app = express();

const server = http.createServer(app);

const ejs = require ('ejs');
const path = require('patch');

app.use(express.static(path.join(__dirname, 'public')));
//console.log(path.join(__dirname, 'public'));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (request, response) => {
    response.render('index.html')
});

server.listen(3000, () => {
    console.log('CHAT RODANDO EM - HTTP://localhost:3000')
});