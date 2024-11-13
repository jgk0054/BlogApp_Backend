const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('blogs').del();
  await knex('users').del();

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPasswordAdmin = await bcrypt.hash('test', salt);
  const hashedPasswordUser1 = await bcrypt.hash('test', salt);

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      password: hashedPasswordAdmin,
      author_name: 'Admin',
      author_url: 'https://admin.example.com',
      avatar_url: 'https://via.placeholder.com/150',
      role: 'admin'
    },
    {
      id: 2,
      username: 'user1',
      password: hashedPasswordUser1,
      author_name: 'User One',
      author_url: 'https://user1.example.com',
      avatar_url: 'https://via.placeholder.com/150',
      role: 'commenter'
    },
  ]);

  await knex('blogs').insert([
    {
      id: 1,
      title: 'First Blog Post',
      body: JSON.stringify([
        { type: 'paragraph', data: 'This is the first paragraph of the first blog post.' },
        { type: 'image', data: 'https://via.placeholder.com/150' },
        { type: 'paragraph', data: 'This is the second paragraph of the first blog post.' }
      ]),
      user_id: 1
    },
    {
      id: 2,
      title: 'Second Blog Post',
      body: JSON.stringify([
        { type: 'paragraph', data: 'This is the first paragraph of the second blog post.' },
        { type: 'image', data: 'https://via.placeholder.com/150' },
        { type: 'paragraph', data: 'This is the second paragraph of the second blog post.' }
      ]),
      user_id: 2
    }
  ]);
};