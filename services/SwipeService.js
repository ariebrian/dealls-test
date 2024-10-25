const swipeRepository = require('../repositories/SwipeRepository');
const userRepository = require('../repositories/UserRepository');

class SwipeService {
  constructor(swipeRepository, userRepository) {
    this.swipeRepository = swipeRepository;
    this.userRepository = userRepository;
  }

  async swipeProfile(swiperId, swipedId, direction) {
    const user = await this.userRepository.findById(swiperId);
    console.log('user', user);
    

    // Reset swipe count if it's a new day
    const today = new Date();
    if (user.lastSwipeDate && user.lastSwipeDate.toDateString() !== today.toDateString()) {
      user.swipeCount = 0;
      user.swipedToday = [];
    }

    if (user.swipeCount >= user.swipeLimit && !user.premium) {
      throw new Error('Swipe limit reached for the day');
    }

    await this.swipeRepository.logSwipe(swiperId, swipedId, direction);
    user.swipeCount += 1;    
    user.swipedToday.push(swipedId);
    user.lastSwipeDate = today;
    await this.userRepository.updateUser(swiperId, user);
  }

  async getSwipableProfiles(userId) {
    const user = await this.userRepository.findById(userId);
    return this.userRepository.getSwipableProfiles(userId, user.swipedToday);
  }
}

module.exports = SwipeService;
