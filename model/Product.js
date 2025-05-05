const mongoose = require('mongoose');

// Review sub-schema
const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model
    required: false  // Make optional if you don't have user authentication yet
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  cloudinary_id: {
    type: String,
    required: true
  },
  reviews: [ReviewSchema],  // Array of reviews
  avgRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to calculate average rating
ProductSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
    return;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.avgRating = Math.round((sum / this.reviews.length) * 10) / 10; // Round to 1 decimal place
};

module.exports = mongoose.model('Product', ProductSchema);

