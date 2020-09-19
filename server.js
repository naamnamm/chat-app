const path = require('path');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser } = require('./utils/users');

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

io.on('connection', (socket) => {
  socket.on('loggedIn', ({ username }) => {
    //emit to single user that is connecting
    const user = userJoin(socket.id, username);

    socket.emit(
      'message',
      formatMessage('chatbot', `Welcome to chatroom, ${user.username}`)
    );

    io.emit('currentUsers', user);

    //emit to all user accept use that is connecting
    socket.broadcast.emit(
      'message',
      formatMessage('chatbot', `${user.username} has join the chat`)
    );
  });

  //broadcast to everybody
  //io.emit()
  //Catch event from the client
  //1. Runs when client disconnect
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

  //2. catch message from the client
  socket.on('chatMsg', (msg) => {
    const user = getCurrentUser(socket.id);

    io.emit('message', formatMessage(user.username, msg));
  });
});

server.listen(port, () => console.log(`server started on port ${port}`));
