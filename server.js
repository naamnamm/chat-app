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

const registeredUsers = [];
const activeUsers = [];

io.on('connection', (socket) => {
  //console.log(socket.id);
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

  //1. Runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit(
        'message',
        formatMessage('chatbot', `${user.username} has left the chat`)
      );

      const index = activeUsers.findIndex((u) => u.username === user.username);

      if (index !== -1) {
        activeUsers.splice(index, 1);
        io.emit('user-leave', { activeUsers });
      }
    }
  });

  //2. catch message from the client
  socket.on('chatMsg', (msg) => {
    const user = getCurrentUser(socket.id);

    //broadcast to everybody - io.emit()
    io.emit('message', formatMessage(user.username, msg));
  });
});

app.get('/users/login/:username', (req, res) => {
  const name = req.params.username.slice(1);
  const found = activeUsers.find((u) => u.username === name);

  if (found) {
    res.send(activeUsers);
  }
});

app.post('/users/login', (req, res) => {
  try {
    const { username, password } = req.body;

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

// app.post('/users/logout', (req, res) => {
//   const { username } = req.body;

//   const index = activeUsers.findIndex((user) => user.username === username);

//   if (index !== -1) {
//     activeUsers.splice(index, 1);
//     res.send({ data: activeUsers });
//   }
// });

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

// app.get('/users', (req, res) => {
//   if (req.query.active === 'true') {
//     res.send(activeUsers);
//   }
//   res.send([]);
// });
