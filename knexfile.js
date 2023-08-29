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
      password: 'yiff',
    },
    migrations: {
      directory: './migrations'
    }
  },


};
