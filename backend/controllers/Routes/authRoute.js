const express = require('express');
const { register, login,verify } = require('../controllers/authController');
const router = express.Router();

const validateInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

router.post('/register', validateInput, register);
router.post('/login', validateInput, login);
router.post('/verify',verify);

module.exports = router;