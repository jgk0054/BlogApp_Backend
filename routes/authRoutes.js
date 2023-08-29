const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');  // Assuming this middleware checks for a valid token

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/user/:id', auth, authController.getUserById);

module.exports = router;
