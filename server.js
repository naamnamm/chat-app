const path = require('path');

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

io.on('connection', (socket) => {
  //emit to single user that is connecting
  socket.emit('msg', 'Welcome to chatroom');

  //broadcast when new user connects >
  //emit to all user accept use that is connecting
  socket.broadcast.emit('msg', 'User has join the chat');

  //Runs when client disconnect
  socket.on('disconnect', () => {
    io.emit('msg', 'A user has left the chat');
  });

  //broadcast to everybody
  //io.emit()
});

server.listen(port, () => console.log(`server started on port ${port}`));
