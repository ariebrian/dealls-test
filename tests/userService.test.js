const bcrypt = require('bcrypt');
const UserService = require('../services/UserService');
const jwtUtil = require('../utils/jwtUtil');
const userRepository = require('../repositories/UserRepository');

jest.mock('../repositories/UserRepository');
jest.mock('../utils/jwtUtil');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService(userRepository);
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully create a user and return a token', async () => {
      const userData = { username: 'testuser', email: 'test@test.com', password: 'password123' };
      const hashedPassword = 'hashedPassword123';
      const token = 'jwtToken';

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      userRepository.createUser = jest.fn().mockResolvedValue({ ...userData, password: hashedPassword, _id: 'userId' });
      jwtUtil.generateToken = jest.fn().mockReturnValue(token);

      const result = await userService.signUp(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        swipeLimit: 10
      });
      expect(jwtUtil.generateToken).toHaveBeenCalledWith('userId');
      expect(result.user.username).toEqual('testuser');
      expect(result.user.email).toEqual('test@test.com');
    });

    it('should throw an error if user creation fails', async () => {
      const userData = { username: 'testuser', email: 'test@test.com', password: 'password123' };

      userRepository.createUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(userService.signUp(userData)).rejects.toThrow('Failed to create user. Please try again.');
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: expect.any(String),
        swipeLimit: 10
      });
    });
  });

  describe('login', () => {
    it('should authenticate a user and return a token', async () => {
      const email = 'test@test.com';
      const password = 'password123';
      const userFromDb = { _id: 'userId', email, password: 'hashedPassword' };
      const token = 'jwtToken';

      userRepository.findByEmail = jest.fn().mockResolvedValue(userFromDb);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwtUtil.generateToken = jest.fn().mockReturnValue(token);

      const result = await userService.login(email, password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, userFromDb.password);
      expect(jwtUtil.generateToken).toHaveBeenCalledWith(userFromDb._id);
      expect(result).toEqual({ token, user: userFromDb });
    });

    it('should throw an error if credentials are invalid', async () => {
      const email = 'test@test.com';
      const password = 'wrongPassword';
      const userFromDb = { _id: 'userId', email, password: 'hashedPassword' };

      userRepository.findByEmail = jest.fn().mockResolvedValue(userFromDb);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(userService.login(email, password)).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compare).toHaveBeenCalledWith(password, userFromDb.password);
    });
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const userId = 'userId';
      const user = { _id: userId, username: 'testuser' };

      userRepository.findById = jest.fn().mockResolvedValue(user);

      const result = await userService.getProfile(userId);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('updateUserPremiumStatus', () => {
    it('should update user premium status and swipe limit', async () => {
      const userId = 'userId';
      const updatedData = { premium: true };
      const updatedUser = { _id: userId, username: 'testuser', premium: true, swipeLimit: null };

      userRepository.updateUser = jest.fn().mockResolvedValue(updatedUser);

      const result = await userService.updateUserPremiumStatus(userId, updatedData);
      
      expect(result.premium).toEqual(true);
    });

    it('should throw an error if user not found', async () => {
      const userId = 'userId';
      const updatedData = { premium: false };

      userRepository.updateUser = jest.fn().mockResolvedValue(null);

      await expect(userService.updateUserPremiumStatus(userId, updatedData)).rejects.toThrow('User not found.');
    });
  });
});
