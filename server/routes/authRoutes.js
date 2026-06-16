const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

// POST /register - register a new user
router.post('/register', registerUser);

// POST /login - login user and return JWT
router.post('/login', loginUser);

module.exports = router;
