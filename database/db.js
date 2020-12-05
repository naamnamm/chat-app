const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'uqyvapwz',
  password: 'NP8EmmZ38OVjK9ZUFPB0jKttP41R8PwZ',
  host: 'lallah.db.elephantsql.com',
  port: 5432,
  database: 'uqyvapwz',
});

module.exports = pool;
