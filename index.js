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

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('sendPresence', (data) => {
        socket.emit('getPresence', data);
console.log(data);
    })

    socket.on('sendData', (data) => {
        data.socketID = socket.id;
        console.log(data);
        socket.emit('getData', data);
    });

});
