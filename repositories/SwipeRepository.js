const Swipe = require('../models/Swipe');

class SwipeRepository {
    constructor(SwiperModel) {
        this.SwiperModel = SwiperModel;
    }

    async logSwipe(swiperId, swipedId, direction) {
        const swipe = new Swipe({ swiperId, swipedId, direction });
        return swipe.save();
      }
    
    async getSwipesToday(swiperId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        return Swipe.find({
          swiperId,
          createdAt: { $gte: today }
        });
    }
}

module.exports = SwipeRepository;
