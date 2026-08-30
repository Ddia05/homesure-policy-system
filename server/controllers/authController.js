const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const result = await authService.registerCustomer(req.body);
    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      ...result
    });
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message });
    }
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getUserById(req.user.userId);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
