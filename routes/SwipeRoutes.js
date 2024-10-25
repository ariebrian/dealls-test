const express = require('express');
const router = express.Router();
const swipeController = require('../controllers/SwipeController');
const jwtUtil = require('../utils/jwtUtil');  // Middleware to verify JWT

router.post('/swipe', jwtUtil.verifyToken, swipeController.swipe);
router.get('/profiles', jwtUtil.verifyToken, swipeController.getSwipableProfiles);

module.exports = router;
