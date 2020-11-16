const express = require('express');
const router = express.Router()

const bcrypt = require('bcrypt');
const formatMessage = require('../utils/message');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const activeUsers = [];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('user-in-auth', req.user)

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).send({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

router.get('/channel/:channel', async (req, res) => {
  console.log(req.params)
  const channel = req.params.channel.slice(1);
  console.log(channel)
  
  const getChannel = await pool.query(
    "SELECT * FROM channels WHERE channel_name = $1", [channel]
  );
  

  console.log(getChannel.rows[0].channel_id)

  // if (activeUsers) {
  //   res.send(activeUsers);
  // }
});

// verify token when user posts
router.post('/post', authenticateToken, async (req, res) => {
  console.log('user post:', req.body, req.user);
  const { user, message, channel } = req.body;

  console.log(`userid = ${req.user.user_id}` )
  console.log(`message = ${message}` )
  console.log(`channel = ${channel}` )
  
  const getChannel = await pool.query(
    "SELECT * FROM channels WHERE channel_name = $1", [channel]
  );

  //insert new message with user ID, channel ID and message into message table
  const msgpost = await pool.query('INSERT INTO messages (user_id, channel_id, message_text) VALUES ($1, $2, $3) RETURNING *',
  [req.user.user_id, getChannel.rows[0].channel_id, message]) 

  console.log(msgpost.rows[0])
  
  req.io.emit('message', formatMessage(getChannel.rows[0].channel_name, req.user.user_name, message));
  
  res.status(201).send({username: req.user.user_name, channel: getChannel.rows[0].channel_name, message})
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
          user_id: usernameMatch.rows[0].user_id,
          user_name: usernameMatch.rows[0].user_name
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '12h',
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
router.get('/getActiveUsers', async (req, res) => {

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