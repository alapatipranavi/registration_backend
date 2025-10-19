const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, gender, dob, password } = req.body;

    if (!name || !email || !phone || !gender || !dob || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, gender, dob, password: hashed });
    await user.save();

    // ✅ Send JSON response always
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
