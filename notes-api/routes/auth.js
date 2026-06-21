const express = require("express");
const authRouter = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  registerUser,
  getAllUsers,
  loginUser,
} = require("../controllers/authController");

authRouter.post("/register", registerUser);
authRouter.get("/getUsers", authMiddleware, getAllUsers);
authRouter.post("/login", loginUser);

module.exports = authRouter;
