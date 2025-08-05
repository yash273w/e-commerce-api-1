const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  size: {
    type: String,
    required: true,
    // Optional: enforce valid sizes
    // enum: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Use singular 'CartItem' — mongoose auto-pluralizes it to 'cartitems'
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
