const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const authMiddleware = require("../middleware/auth");

authRouter.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.user.create({
      data: { username: req.body.username, password: hashedPassword },
    });
    res.status(200).json({ message: "succesfuly registered" });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "user already exists, choose another one!" });
    }
    next(error);
  }
});

authRouter.get("/listallusers", authMiddleware, async (req, res, next) => {
  try {
    const result = await prisma.user.findMany();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const userLogin = await prisma.user.findUnique({
      where: { username: req.body.username },
    });
    if (userLogin === null) {
      return json.status(400).json({ message: "user not found" });
    }
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      userLogin.password,
    );
    if (!hashedPassword) {
      return res.status(400).json({ message: "wrong password" });
    } else {
      const token = jwt.sign(
        { id: userLogin.id, username: userLogin.username },
        process.env.JWT_SECRET,
        { expiresIn: "100h" },
      );
      res.status(200).json({ token });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
