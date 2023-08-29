/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('username', 50).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('author_name', 100).notNullable(); // New column for author name
            table.string('author_url', 255); // New column for author URL
            table.string('avatar_url', 255); // New column for avatar URL
            table.enu('role', ['publisher', 'commenter', 'admin']).defaultTo('commenter'); // New column for user roles
        })
        .createTable('blogs', function (table) {
            table.increments('id');
            table.string('title', 100).notNullable();
            table.text('body').notNullable();
            table.integer('user_id').references('id').inTable('users');
        });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("blogs")
        .dropTable("users");
};

