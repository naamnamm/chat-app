const path = require('path');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser } = require('./utils/users');

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

io.on('connection', (socket) => {
  socket.on('loggedIn', ({ username }) => {
    //emit to single user that is connecting
    const user = userJoin(socket.id, username);

    socket.emit(
      'message',
      formatMessage('chatbot', `Welcome to chatroom, ${user.username}`)
    );

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

const registeredUsers = []; //mock db
const activeUsers = [];

app.post('/users/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const user = { username, password };

    registeredUsers.length >= 1
      ? registeredUsers.forEach((u) => {
          if (u.username === username && u.password === password) {
            activeUsers.push(user);

            io.emit('new-login', { activeUsers });
            // return 200 response
            res.send();
          } else {
            // return 200 response
            res.status(403).send('login not valid');
          }
        })
      : res.status(403).send('login not valid');
  } catch (error) {
    console.log(error);
  }
});

app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;

  if (registeredUsers.some((user) => user.username === username)) {
    res.json('please choose different username');
  } else {
    const user = { username, password };
    registeredUsers.push(user);
    res.send(registeredUsers);
  }
});

server.listen(port, () => console.log(`server started on port ${port}`));

// app.get('/users', (req, res) => {
//   res.json(users);
// });
