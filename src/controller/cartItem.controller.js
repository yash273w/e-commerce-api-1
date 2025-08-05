const cartItemService = require("../services/cartItem.service.js");

const updateCartItem = async (req, res) => {
  const user = req.user; // ✅ Not a Promise
  console.log("🔧 [updateCartItem] req.user:", user);

  try {
    const updatedCartItem = await cartItemService.updateCartItem(
      user._id,
      req.params.id,
      req.body
    );
    return res.status(200).send(updatedCartItem);
  } catch (error) {
    console.error("❌ Error updating cart item:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  const user = req.user;
  console.log("🗑️ [removeCartItem] cart item id:", req.params.id);

  try {
    await cartItemService.removeCartItem(user._id, req.params.id);
    return res.status(200).send({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("❌ Error removing cart item:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  updateCartItem,
  removeCartItem,
};
