const express = require('express');
const { User } = require('../models'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'my-super-secret-key-12345'; 

// API route for new user registration
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }
    const newUser = await User.create({ email, password });
    return res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// API route for user login
router.post('/signin', async (req, res) => { // Corrected from GET to POST
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;