const express = require('express');
const jwt = require('jsonwebtoken');
const { User, USER_ROLES } = require('../models/User');

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || 'dev_secret_key',
    { expiresIn: '7d' }
  );

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.area,
        city: user.city,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seed-super-admin', async (req, res) => {
  const { name, email, password, area, city } = req.body;

  if (!name || !email || !password || !area || !city) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Super admin already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      area,
      city,
      role: USER_ROLES.SUPER_ADMIN,
    });

    const token = signToken(user);
    return res.status(201).json({
      message: 'Super admin created',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.area,
        city: user.city,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

