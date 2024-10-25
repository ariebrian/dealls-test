const User = require('../models/User');

class UserRepository {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }
  
    async createUser(data) {
        const newUser = new User(data);
        return await newUser.save();
    }

    async findByEmail(email) {
        return User.findOne({ email });
      }
    
    async findById(id) {
        return User.findById(id);
    }
    
    async updateUser(userId, updates) {
        return User.findByIdAndUpdate(userId, updates, { new: true });
    }

    async getSwipableProfiles(userId, swipedToday) {
        return User.find({
          _id: { $nin: swipedToday, $ne: userId }
        }).limit(10);
      }
}

module.exports = UserRepository;
