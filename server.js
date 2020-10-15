// to add welcome user
// to add user has join

require('dotenv').config();

const path = require('path');
const bcrypt = require('bcrypt');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

const registeredUsers = [];
const activeUsers = [];
const messages = [];

io.on('connection', (socket) => {
  //console.log(socket.id);
  // I can't remove logged-event from the client, otherwise socket.emit won't work
  // way to get around it?
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

  //1. Runs when client close out of the browser
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
});

// fetch route in the chatroom to get username
app.get('/users/login/:username', (req, res) => {
  //console.log(req.header);
  const name = req.params.username.slice(1);
  const found = activeUsers.find((u) => u.username === name);

  if (found) {
    res.send(activeUsers);
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// verify token when user posts
app.post('/users/post', authenticateToken, (req, res) => {
  console.log('user post:', req.body, req.user);
  const { user, message } = req.body;

  io.emit('message', formatMessage(user.username, message));
  //io.emit('message', { messages });

  res.status(201).send({ message: 'successfully posted' });
  //res.json(req.body);
});

// login route & sign token
app.post('/users/login', async (req, res) => {
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
      const passwordMatch = await bcrypt.compare(
        password,
        usernameMatch.password
      );
      if (passwordMatch) {
        const loginUser = {
          userid: usernameMatch.userid,
          username,
          // password: usernameMatch.password,
        };
        console.log('login user =', loginUser);
        activeUsers.push(loginUser);
        console.log('active users =', activeUsers);

        //once authentication process is completed
        //now we serialize user with webtoken
        const payload = {
          userid: usernameMatch.userid,
          username: usernameMatch.username,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        io.emit('new-login', { activeUsers });
        res.status(201).send({
          token,
          userid: usernameMatch.userid,
          username: usernameMatch.username,
        });

        //res.send({ data: activeUsers, token });
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

app.post('/users/signup', async (req, res) => {
  const userMatch = registeredUsers.find(
    (user) => user.username === req.body.username
  );

  try {
    if (!userMatch) {
      const saltRounds = await bcrypt.genSalt();
      const passHash = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = {
        userid: Date.now(),
        username: req.body.username,
        password: passHash,
      };
      console.log('new sign-up user =', newUser);
      registeredUsers.push(newUser);
      res
        .status(201)
        .send({ success: { code: 201, message: 'successfully signed up' } });
    } else {
      res
        .status(401)
        .send({ error: { code: 401, message: 'Username already exists' } });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/users/logout', (req, res) => {
  const { user } = req.body;
  console.log('test loggedout =', user);

  const index = activeUsers.findIndex((u) => u.userid === user.userid);
  const logoutUser = activeUsers.find((u) => u.userid === user.userid);

  if (index !== -1) {
    activeUsers.splice(index, 1);
    io.emit('user-leave', { activeUsers });
    io.emit(
      'message',
      formatMessage('chatbot', `${logoutUser.username} has left the chat`)
    );
    res.status(201).send({ activeUsers });
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

// app.get('/users', (req, res) => {
//   if (req.query.active === 'true') {
//     res.send(activeUsers);
//   }
//   res.send([]);
// });
