const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");

async function createCart(user) {
  try {
    const cart = new Cart({ user: user._id }); // ✅ Ensure we're using user._id
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate("product");

    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cartItems) {
      totalPrice += cartItem.price * cartItem.quantity;
      totalDiscountedPrice += cartItem.discountedPrice * cartItem.quantity;
      totalItem += cartItem.quantity;
    }

    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.discountedPrice = totalDiscountedPrice;

    return cart;

  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userId, req) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    const product = await Product.findById(req.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId,
      size: req.size, // ✅ Include size in condition if it's relevant
    });

    if (existingItem) {
      // If the item already exists, increase quantity
      existingItem.quantity += 1;
      await existingItem.save();
      return existingItem;
    }

    // Otherwise, create new item
    const cartItem = new CartItem({
      product: product._id,
      cart: cart._id,
      userId,
      quantity: 1,
      size: req.size,
      price: product.price,
      discountedPrice: product.discountedPrice,
    });

    const createdCartItem = await cartItem.save();
    cart.cartItems.push(createdCartItem._id); // ✅ Store reference only
    await cart.save();

    return createdCartItem;

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createCart,
  findUserCart,
  addCartItem,
};
