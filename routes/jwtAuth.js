const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const formatMessage = require('../utils/message');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

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

router.get('/channel/:channel', async (req, res) => {
  const channel = req.params.channel.slice(1);

  const getChannel = await pool.query(
    'SELECT * FROM channels WHERE name = $1',
    [channel]
  );

  if (getChannel.rows.length === 0) {
    await pool.query('INSERT INTO channels (name) VALUES ($1) RETURNING *', [
      channel,
    ]);
  }

  const getMessages = await pool.query(
    'SELECT m.id, m.text, m.created_at, c.name AS channel_name, u.name AS username FROM messages AS m INNER JOIN channels AS c ON m.channel_id = c.id INNER JOIN users AS u ON m.user_id = u.id'
  );

  const filterMessages = getMessages.rows.filter(
    (message) => message.channel_name === channel
  );

  if (filterMessages) {
    res.send(filterMessages);
  }
});

router.post('/post', authenticateToken, async (req, res) => {
  const { user, message, channel } = req.body;

  const getChannel = await pool.query(
    'SELECT * FROM channels WHERE name = $1',
    [channel]
  );

  const msgpost = await pool.query(
    'INSERT INTO messages (text, user_id, channel_id) VALUES ($1, $2, $3) RETURNING *',
    [message, req.user.id, getChannel.rows[0].id]
  );

  req.io.emit(
    'message',
    formatMessage(
      getChannel.rows[0].name,
      req.user.name,
      message,
      msgpost.rows[0].created_at
    )
  );

  res.status(201).send({
    username: req.user.name,
    channel: getChannel.rows[0].name,
    message,
  });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameMatch = await pool.query(
      'SELECT * FROM users WHERE name = $1',
      [username]
    );

    if (usernameMatch) {
      const passwordMatch = await bcrypt.compare(
        password,
        usernameMatch.rows[0].password
      );
      if (passwordMatch) {
        await pool.query(
          'UPDATE users SET last_active_at = $1 WHERE name = $2',
          [new Date(), username],
          (err, res) => {
            console.log(err, res);
          }
        );

        const payload = {
          id: usernameMatch.rows[0].id,
          name: usernameMatch.rows[0].name,
        };

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '12h',
        });

        const activeUsers = await pool.query(
          "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
        );

        req.io.emit('new-login', { activeUsers: activeUsers.rows });

        res.status(201).send({
          token,
          id: usernameMatch.rows[0].id,
          name: usernameMatch.rows[0].name,
        });
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

router.get('/getActiveUsers', async (req, res) => {
  const activeUsers = await pool.query(
    "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
  );

  if (activeUsers) {
    res.send(activeUsers);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const errors = [];

    const userMatch = await pool.query('SELECT * FROM users WHERE name = $1', [
      username,
    ]);
    if (userMatch.rows.length > 0) {
      errors.push({ message: 'Username already exist!' });
    }

    if (password.length < 6) {
      errors.push({ message: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
      return res.status(401).send(errors);
    } else {
      const saltRounds = await bcrypt.genSalt();
      const passHash = await bcrypt.hash(password, saltRounds);
      const newUser = await pool.query(
        'INSERT INTO users (name, password, last_active_at) VALUES ($1, $2, $3) RETURNING *',
        [username, passHash, null]
      );

      res
        .status(201)
        .send({ success: { code: 201, message: 'successfully signed up' } });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/logout', async (req, res) => {
  const { username } = req.body;

  const logoutUser = await pool.query(
    'UPDATE users SET last_active_at = $1 WHERE name = $2',
    [null, username]
  );

  const activeUsers = await pool.query(
    "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
  );

  if (activeUsers) {
    req.io.emit('user-leave', { activeUsers: activeUsers.rows });
    res.status(201).send({ activeUsers: activeUsers.rows });
  }
});

router.get('/verify-token', authenticateToken, (req, res) => {
  try {
    const data = Object.assign(req.user, { isVerified: true });
    res.json(data);
  } catch (error) {
    res.status(403).send('Invalid or Expired token');
  }
});

module.exports = router;
