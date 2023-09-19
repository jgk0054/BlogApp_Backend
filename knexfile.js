// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'blog_api',
      password: 'test_password',
    },
    migrations: {
      directory: './migrations'
    }
  },


};
