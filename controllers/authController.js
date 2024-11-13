const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Function for handling user login
exports.login = async (req, res) => {
    console.info('Login request received.');
    try {
        const { username, password } = req.body;

        // Validate incoming data
        if (!username || !password) {
            return res.status(400).send('Invalid input data.');
        }

        // Check if user exists in the database
        const user = await User.findUserByUsername(username);
        if (!user) {
            return res.status(400).send('Invalid username or password.');
        }
        console.info(password, user.password);
        // Validate password using bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid username or password.');
        }
        console.info("got here")
        // Generate JWT token for authenticated user
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
        const { id, author_name, author_url, avatar_url, role } = user;
        return res.status(200).send({token: token, user: {id, author_name, author_url, avatar_url, role}});
    } catch (error) {
        return res.status(500).send('Server error.');
    }
};

// Function for handling user registration
exports.register = async (req, res) => {
    try {
        const { username, password, author, avatarURL = null, role } = req.body;

        // Validate incoming data
        if (!username || !password || !author || !author.name || !role) {
            return res.status(400).send('Invalid input data.');
        }
        // Check if username already exists in the database
        let user = await User.findUserByUsername(username);
        if (user) {
            return res.status(400).send('Username already exists.');
        }

        // Create a new user record in the database
        user = await User.createUser(username, password, author.name, author.url, avatarURL, role);
        res.send(user);
    } catch (error) {
        res.status(500).send('Server error.');
    }
};

// Function for fetching user details by their ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Server error.");
    }
};
