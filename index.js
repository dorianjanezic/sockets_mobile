//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

let io = require('socket.io')(server);
let player1 = io.of('/player1');
let player2 = io.of('/player2')

//player1 namespace
player1.on('connection', function(socket) {
    console.log("We have a new player1: " + socket.id);

    socket.on('sendData', (data) => {
       socket.broadcast.emit("hello", data);
    });

    socket.on('filterValue', (data) => {
        player2.emit("filter", data);
    });

    socket.on('playerstart', (data) => {
        player2.emit('playerstart', data);
    })
});

//player2 namespace
player2.on('connection', function(socket) {
    console.log("We have a new player2: " + socket.id);
    socket.on('sendData', (data) => {
        player1.emit("hello", data);
     });
     socket.on('playerstart', (data) => {
         player1.emit('playerstart', data);
     })
})