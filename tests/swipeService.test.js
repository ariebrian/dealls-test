const SwipeService = require('../services/SwipeService');
const swipeRepository = require('../repositories/SwipeRepository');
const userRepository = require('../repositories/UserRepository');

jest.mock('../repositories/SwipeRepository');
jest.mock('../repositories/UserRepository');

describe('SwipeService', () => {
  let swipeService;

  beforeEach(() => {
    swipeService = new SwipeService(swipeRepository, userRepository);
    jest.clearAllMocks();
  });

  describe('swipeProfile', () => {
    it('should log a swipe and update user swipe count and date', async () => {
      const swiperId = 'user1';
      const swipedId = 'user2';
      const direction = 'like';
      const today = new Date();
      const user = {
        _id: swiperId,
        swipeCount: 5,
        swipeLimit: 10,
        premium: false,
        lastSwipeDate: today,
        swipedToday: []
      };

      userRepository.findById = jest.fn().mockResolvedValue(user);
      swipeRepository.logSwipe = jest.fn().mockResolvedValue();
      userRepository.updateUser = jest.fn().mockResolvedValue();

      await swipeService.swipeProfile(swiperId, swipedId, direction);

      expect(swipeRepository.logSwipe).toHaveBeenCalledWith(swiperId, swipedId, direction);
      expect(userRepository.updateUser).toHaveBeenCalledWith(swiperId, {
        ...user,
        swipeCount: 6,
        swipedToday: [swipedId]
      });
    });

    it('should reset swipe count and swipedToday array if it is a new day', async () => {
      const swiperId = 'user1';
      const swipedId = 'user2';
      const direction = 'like';
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      const user = {
        _id: swiperId,
        swipeCount: 5,
        swipeLimit: 10,
        premium: false,
        lastSwipeDate: yesterday,
        swipedToday: ['user3']
      };

      userRepository.findById = jest.fn().mockResolvedValue(user);
      swipeRepository.logSwipe = jest.fn().mockResolvedValue();
      userRepository.updateUser = jest.fn().mockResolvedValue();

      await swipeService.swipeProfile(swiperId, swipedId, direction);

      expect(userRepository.updateUser).toHaveBeenCalledWith(swiperId, {
        ...user,
        swipeCount: 1,
        lastSwipeDate: expect.any(Date),
        swipedToday: [swipedId]
      });
    });

    it('should throw an error if user exceeds daily swipe limit and is not premium', async () => {
      const swiperId = 'user1';
      const swipedId = 'user2';
      const direction = 'like';
      const user = {
        _id: swiperId,
        swipeCount: 10,
        swipeLimit: 10,
        premium: false,
        lastSwipeDate: new Date(),
        swipedToday: []
      };

      userRepository.findById = jest.fn().mockResolvedValue(user);

      await expect(swipeService.swipeProfile(swiperId, swipedId, direction)).rejects.toThrow('Swipe limit reached for the day');
      expect(swipeRepository.logSwipe).not.toHaveBeenCalled();
    });
  });

  describe('getSwipableProfiles', () => {
    it('should return profiles excluding those already swiped today', async () => {
      const userId = 'user1';
      const user = { _id: userId, swipedToday: ['user2', 'user3'] };
      const swipableProfiles = [
        { _id: 'user4', username: 'user4' },
        { _id: 'user5', username: 'user5' }
      ];

      userRepository.findById = jest.fn().mockResolvedValue(user);
      userRepository.getSwipableProfiles = jest.fn().mockResolvedValue(swipableProfiles);

      const result = await swipeService.getSwipableProfiles(userId);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.getSwipableProfiles).toHaveBeenCalledWith(userId, user.swipedToday);
      expect(result).toEqual(swipableProfiles);
    });
  });
});
