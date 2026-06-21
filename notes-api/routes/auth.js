const express = require("express");
const authRouter = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  registerUser,
  getAllUsers,
  loginUser,
  deleteUser,
} = require("../controllers/authController");

authRouter.post("/register", registerUser);
authRouter.get("/getUsers", authMiddleware, getAllUsers);
authRouter.post("/login", loginUser);
authRouter.delete("/:id", deleteUser);

module.exports = authRouter;
