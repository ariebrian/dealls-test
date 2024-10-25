const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    premium: { type: Boolean, default: false },
    swipeCount: { type: Number, default: 0 },
    swipeLimit: { type: Number, default: 10 },
    swipedToday: { type: Array, default: [] },
    lastSwipeDate: { type: Date, default: null }
});

userSchema.index({ username: 1 });
userSchema.index({ swipeCount: 1, lastSwipeDate: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
