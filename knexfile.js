// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      user: 'uqyvapwz',
      password: 'NP8EmmZ38OVjK9ZUFPB0jKttP41R8PwZ',
      host: 'lallah.db.elephantsql.com',
      port: 5432,
      database: 'uqyvapwz',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
