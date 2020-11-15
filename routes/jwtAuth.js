const express = require('express');
const router = express.Router()

const bcrypt = require('bcrypt');
const formatMessage = require('../utils/message');
const { userJoin, userLeave } = require('../utils/users');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const activeUsers = [];

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
router.post('/users/post', authenticateToken, (req, res) => {
  console.log('user post:', req.body, req.user);
  const { user, message } = req.body;

  req.io.emit('message', formatMessage(user.username, message));
  //io.emit('message', { messages });

  res.status(201).send({ message: 'successfully posted' });
  //res.json(req.body);
});

// login route & sign token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameMatch = await pool.query(
      'SELECT * FROM users WHERE user_name = $1',
      [username]
    );

    if (usernameMatch) {
      const passwordMatch = await bcrypt.compare(
        password,
        usernameMatch.rows[0].user_password
      );
      if (passwordMatch) {
        //alter last_active_at to current time
        await pool.query('UPDATE users SET last_active_at = $1 WHERE user_name = $2', [new Date(), username], (err, res) => {
          //console.log(err, res);
          //pool.end();
        });

        //now we serialize user with webtoken
        const payload = {
          user_id: usernameMatch.rows[0].user_id
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10h',
        });

        // const activeUsers = await pool.query(
        //   "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
        // );

        req.io.emit('new-login', { activeUsers });

        res.status(201).send({
          token,
          userid: usernameMatch.rows[0].user_id,
          username: usernameMatch.rows[0].user_name,
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

// fetch route in the chatroom to get all active users
router.get('/login/activeusers', async (req, res) => {

  const activeUsers = await pool.query(
    "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
  );

  //console.log(activeUsers)

  if (activeUsers) {
    res.send(activeUsers);
  }
});

router.post('/signup', async (req, res) => {
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
      console.log(newUser.rows[0]);

      // res.json(newUser);
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
  console.log('test loggedout =', username);

  //set user last active at to null
  const logoutUser = await pool.query(
    'UPDATE users SET last_active_at = $1 WHERE user_name = $2', 
    [null, username]
  );



  //send back active users
  const activeUsers = await pool.query(
    "SELECT * FROM users WHERE last_active_at >= NOW() - interval '12 hour'"
  );



  if (activeUsers) {
    res.status(201).send({ activeUsers });
  }

});

router.get('/verify-token', authenticateToken, (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    //console.error(err.message);
    res.status(403).send('Invalid or Expired token');
  }
});

module.exports = router;