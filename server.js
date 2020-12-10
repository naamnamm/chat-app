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
app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use('/users', require('./routes/jwtAuth'));

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`server started on port ${port}`));
