const jwtProvider = require("../config/jwtProvider.js");
const userService = require("../services/user.service.js");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ error: "Token not found." });
    }

    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(401).send({ error: "User not found." });
    }

    req.user = user; // ✅ This is critical
    console.log("✅ Authenticated user:", user._id);

    next(); // ✅ Must be inside try
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
