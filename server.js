require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors());
app.use(function(req,res,next){
  req.io = io;
  next();
});

//register, login, log out, post message
app.use('/users', require('./routes/jwtAuth'))

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`server started on port ${port}`));


// app.post('/users/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     //to prevent user from logging in twice
//     const alreadyLoggedIn = activeUsers.some(
//       (user) => user.username === username
//     );

//     if (alreadyLoggedIn) {
//       res.status(403).send({
//         error: { code: 403, message: 'You are already logged in.' },
//       });
//       return;
//     }

//     const usernameMatch = registeredUsers.find((user) => {
//       return user.username === username;
//     });

//     if (usernameMatch) {
//       const passwordMatch = await bcrypt.compare(
//         password,
//         usernameMatch.password
//       );
//       if (passwordMatch) {
//         const loginUser = {
//           userid: usernameMatch.userid,
//           username,
//           // password: usernameMatch.password,
//         };
//         console.log('login user =', loginUser);
//         activeUsers.push(loginUser);
//         console.log('active users =', activeUsers);

//         //once authentication process is completed
//         //now we serialize user with webtoken
//         const payload = {
//           userid: usernameMatch.userid,
//           username: usernameMatch.username,
//         };
//         const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
//           expiresIn: '10h',
//         });

//         io.emit('new-login', { activeUsers });
//         res.status(201).send({
//           token,
//           userid: usernameMatch.userid,
//           username: usernameMatch.username,
//         });

//         //res.send({ data: activeUsers, token });
//       } else {
//         res.status(403).send({
//           error: { code: 403, message: 'Invalid Password' },
//         });
//       }
//     } else {
//       res.status(403).send({
//         error: { code: 403, message: 'Invalid Username' },
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// fetch route in the chatroom to get username
// app.get('/users/login/:username', async (req, res) => {
  //console.log(req.header);
  // const loginUser = req.params.username.slice(1);

  // const usernameMatch = await pool.query(
  //   "SELECT * FROM users WHERE user_name = $1",
  //   [loginUser]
  // );

  // const activeusers = await pool.query(
  //   "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
  // );
  
  // console.log(activeusers.rows)
  // console.log(loginUser)
  // console.log(usernameMatch.rows)
  //const found = activeUsers.find((u) => u.username === loginUser);

//   if (activeusers) {
//     res.send(activeusers.rows);
//   }
// });

// app.post('/users/logout', (req, res) => {
//   const { user } = req.body;
//   console.log('test loggedout =', user);

//   const index = activeUsers.findIndex((u) => u.userid === user.userid);
//   const logoutUser = activeUsers.find((u) => u.userid === user.userid);

//   if (index !== -1) {
//     activeUsers.splice(index, 1);
//     io.emit('user-leave', { activeUsers });
//     io.emit(
//       'message',
//       formatMessage('chatbot', `${logoutUser.username} has left the chat`)
//     );
//     res.status(201).send({ activeUsers });
//   }
// });

// io.on('connection', (socket) => {
//   //console.log(socket.id);
//   // I can't remove logged-event from the client, otherwise socket.emit won't work
//   // way to get around it?
//   socket.on('loggedIn', ({ username }) => {
//     //emit to single user that is connecting
//     const user = userJoin(socket.id, username);

//     socket.emit(
//       'message',
//       formatMessage('chatbot', `Welcome to chatroom, ${user.username}`)
//     );

//     //emit to all user accept use that is connecting
//     socket.broadcast.emit(
//       'message',
//       formatMessage('chatbot', `${user.username} has join the chat`)
//     );
//   });
// });