const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    swiperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    swipedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    direction: { type: String, enum: ['left', 'right'], required: true },
    createdAt: { type: Date, default: Date.now }
});

swipeSchema.index({ direction: 1 });
swipeSchema.index({ swiperId: 1, swipedId: 1 });

const Swipe = mongoose.model('Swipe', swipeSchema);

module.exports = Swipe;
 