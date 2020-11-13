const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'uqyvapwz',
  password: 'NP8EmmZ38OVjK9ZUFPB0jKttP41R8PwZ',
  host: 'lallah.db.elephantsql.com',
  port: 5432,
  database: 'uqyvapwz',
});

module.exports = pool;



// const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: 'hzjnkkri',
//   password: 'ACPie3_Ux8tnq1IFZqDtlFGwXLl08rZw',
//   host: 'lallah.db.elephantsql.com',
//   port: 5432,
//   database: 'hzjnkkri',
// });

// module.exports = pool;

// const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: 'postgres',
//   password: 12345678,
//   host: 'localhost',
//   port: 5432,
//   database: 'chatapp',
// });

// module.exports = pool;


//adding and droping column 