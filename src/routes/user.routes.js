const express = require("express");
const router = express.Router(); // 🔧 remove the space after express.

const userController = require("../controller/user.controller.js");
const authenticate = require("../middleware/authenticate"); // ✅ import middleware


router.get("/profile", authenticate, userController.getUserProfile);


router.get("/", userController.getAllUsers);

module.exports = router;
