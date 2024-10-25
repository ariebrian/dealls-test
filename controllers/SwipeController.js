const express = require('express');
require('dotenv').config();

const SwipeService = require('../services/SwipeService');
const SwipeRepository = require('../repositories/SwipeRepository');
const UserRepository = require('../repositories/UserRepository');
const jwtUtil = require('../utils/jwtUtil');

const router = express.Router();
const swipeService = new SwipeService(new SwipeRepository(), new UserRepository());

router.use(jwtUtil.verifyToken);

router.post('/swipe', async (req, res) => {
  try {
    const swipe = await swipeService.swipeProfile(req.user.id, req.body.swipedId, req.body.direction);
    res.status(200).send(swipe);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/swipeableprofiles', async (req, res) => {
  try {
    const profiles = await swipeService.getSwipableProfiles(req.user.id);
    res.status(200).json(profiles);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

module.exports = router;
