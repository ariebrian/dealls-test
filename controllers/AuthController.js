require('dotenv').config();
const express = require('express');

const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

const router = express.Router();
const userService = new UserService(new UserRepository());
const jwtUtil = require('../utils/jwtUtil');

router.post('/signup', async (req, res) => {
  try {
    const result = await userService.signUp(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('req', req.body);
  
  try {
    const result = await userService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.use(jwtUtil.verifyToken);

router.put('/update_premium_status', async (req, res) => {
  try {
    console.log(req.body);
    
    const result = await userService.updateUserPremiumStatus(req.user.id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
