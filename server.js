const path = require('path');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

io.on('connection', (socket) => {
  //console.log(socket.id);
  socket.on('loggedIn', ({ username }) => {
    console.log(username);
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

  //1. Runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log(user);
    if (user) {
      io.emit(
        'message',
        formatMessage('chatbot', `${user.username} has left the chat`)
      );
    }
    //emit to all user accept use that disconnects
  });

  //2. catch message from the client
  socket.on('chatMsg', (msg) => {
    const user = getCurrentUser(socket.id);

    //broadcast to everybody - io.emit()
    io.emit('message', formatMessage(user.username, msg));
  });
});

const registeredUsers = [];
const activeUsers = [];

app.get('/users', (req, res) => {
  if (req.query.active === 'true') {
    res.send(activeUsers);
  }
  res.send([]);
});

app.post('/users/login', (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(registeredUsers);

    //to prevent user from logging in twice
    const alreadyLoggedIn = activeUsers.some(
      (user) => user.username === username
    );

    if (alreadyLoggedIn) {
      res.status(403).send({
        error: { code: 403, message: 'You are already logged in.' },
      });
      return;
    }

    const usernameMatch = registeredUsers.find((user) => {
      console.log(user);
      return user.username === username;
    });

    if (usernameMatch) {
      let passwordMatch = usernameMatch.password === password;
      if (passwordMatch) {
        const user = { username, password };
        activeUsers.push(user);
        io.emit('new-login', { activeUsers });
        res.send({ data: activeUsers });
      } else {
        res.status(403).send({
          error: { code: 403, message: 'Invalid Password' },
        });
      }
    } else {
      res.status(403).send({
        error: { code: 403, message: 'Invalid Username' },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;

  const userMatch = registeredUsers.find((user) => user.username === username);

  if (!userMatch) {
    const newUser = { username, password };
    registeredUsers.push(newUser);
    res.send({ data: registeredUsers });
  } else {
    res
      .status(401)
      .send({ error: { code: 401, message: 'Username already exists' } });
  }
});

server.listen(port, () => console.log(`server started on port ${port}`));

// app.get('/users', (req, res) => {
//   res.json(users);
// });
// registeredUsers.length >= 1
// ? registeredUsers.forEach((u) => {
//     console.log(u);
//     console.log(username, password);
//     if (u.username === username && u.password === password) {
//       activeUsers.push(user);

//       io.emit('new-login', { activeUsers });

//       res.send();
//     } else {
//       res.status(403).send({
//         error: { code: 403, message: 'Invalid Username or Password' },
//       });
//     }
//   })
// : res.status(403).send({
//     error: { code: 403, message: 'Invalid Username or Password' },
//   });
// }
