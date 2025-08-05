const cartService = require("../services/cart.service.js");

const findUserCart = async (req, res) => {
  console.log("🛒 [findUserCart] req.user:", req.user); // ✅ Debug log

  const user = req.user;

  try {
    if (!user || !user._id) {
      return res.status(401).send({ error: "Unauthorized: User not attached to request." });
    }

    const cart = await cartService.findUserCart(user._id);
    return res.status(200).send(cart);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  console.log("🛒 [addItemToCart] req.user:", req.user); // ✅ Debug log

  const user = req.user;

  try {
    if (!user || !user._id) {
      return res.status(401).send({ error: "Unauthorized: User not attached to request." });
    }

    const cartItem = await cartService.addCartItem(user._id, req.body);
    return res.status(200).json({
  message: "Item added to cart",
  cartItem,
});
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCart,
  addItemToCart,
};
