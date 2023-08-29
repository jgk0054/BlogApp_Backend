const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    // Find a user by their username
    static async findUserByUsername(username) {
        try {

            const queryText = 'SELECT * FROM users WHERE username = $1';
            const res = await db.query(queryText, [username]);
            if (res.rows.length > 0) {
                return res.rows[0];
            } else {
                return null;
            }
        } catch(error){
            console.error('Error occurred during fetch user by username:', error);
            return null;
        }
}

    // Find a user by their ID
    static async findById(id) {
        try {
            const queryText = 'SELECT * FROM users WHERE id = $1';
            const res = await db.query(queryText, [id]);
            if (res.rows.length > 0) {
                return res.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error occurred during fetch user by ID:', error);
            return null;
        }
    }

    // Create a new user in the database
    static async createUser(username, password, authorName, authorURL, avatarURL = null, role) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const queryText = 'INSERT INTO users (username, password, author_name, author_url, avatar_url, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const res = await db.query(queryText, [username, hashedPassword, authorName, authorURL, avatarURL, role]);

            return res.rows[0];

        } catch (error) {
            console.error('Error occurred during user creation:', error);
            throw new Error('Could Not Create User');
        }
    }
}

module.exports = User;
