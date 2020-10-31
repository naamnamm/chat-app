require('dotenv').config();

const path = require('path');
const bcrypt = require('bcrypt');
const formatMessage = require('./utils/message');
const { userJoin, userLeave } = require('./utils/users');

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const pool = require('./database/db');
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

const registeredUsers = [];
const activeUsers = []; 

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
    if (err)
      return res.status(403).send({ message: 'Invalid or expired token' });
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
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10h',
        });

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
  try {
    const { username, password } = req.body;
    const userMatch = await pool.query(
      'SELECT * FROM users WHERE user_name = $1',
      [username]
    );

    if (userMatch.rows.length > 0) {
      return res.status(401).json('User already exist!');
    } else {
      const saltRounds = await bcrypt.genSalt();
      const passHash = await bcrypt.hash(password, saltRounds);
      const newUser = await pool.query(
        'INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING *',
        [username, passHash]
      );
      console.log(newUser);

      // res.json(newUser);
      res
        .status(201)
        .send({ success: { code: 201, message: 'successfully signed up' } });
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

app.get('/users/verify-token', authenticateToken, (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(err.message);
    res.status(403).send('Invalid or Expired token');
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`server started on port ${port}`));


