// const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const jwtUtil = require('../utils/jwtUtil');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signUp(userData) {
    console.log('signup');
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    if (!userData.swipeLimit) {
        userData.swipeLimit = 10;
    }
    try {
      const newUser = await this.userRepository.createUser({
        ...userData,
        password: hashedPassword
      });
      
      return {
        token: jwtUtil.generateToken(newUser._id),
        user: newUser
      };
    } catch (error) {
      console.error(error)
      throw new Error('Failed to create user. Please try again.')
    }
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return {
      token: jwtUtil.generateToken(user._id),
      user: user
    };
  }

  async getProfile(userId) {
    return await this.userRepository.findById(userId);
  }

  async updateUserPremiumStatus(userId, updatedData) {
    const data = {
      ...updatedData,
      swipeLimit: updatedData.premium ? null : 10, 
    }
    const user = await this.userRepository.updateUser(userId, updatedData);
    if (!user) throw new Error('User not found.');

    return user;
  }
}

module.exports = UserService;
