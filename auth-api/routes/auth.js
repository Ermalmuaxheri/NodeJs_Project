const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { readUser, writeUser } = require("../helpers");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    const userlist = await readUser();
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const existingUser = userlist.find((user) => user.username === newUsername);
    const newId = userlist.length + 1;
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newUser = {
      id: newId,
      username: newUsername,
      password: hashedPassword,
    };
    userlist.push(newUser);
    await writeUser(userlist);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected!", user: req.user });
});

router.post("/login", async (req, res, next) => {
  try {
    const userlist = await readUser();
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const existingUser = userlist.find((user) => newUsername === user.username);
    if (!existingUser) {
      res.status(400).json({ error: "username not found" });
      return;
    }
    const correctPassword = await bcrypt.compare(
      newPassword,
      existingUser.password,
    );
    if (!correctPassword) {
      res.status(400).json({ error: "invalid password" });
      return;
    }
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
