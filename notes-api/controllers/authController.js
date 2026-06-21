const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const registerUser = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }
    const hashedPassword = await bcrypt.hash(validation.data.password, 10);
    const result = await prisma.user.create({
      data: { username: validation.data.username, password: hashedPassword },
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
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await prisma.user.findMany();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const userLogin = await prisma.user.findUnique({
      where: { username: validation.data.username },
    });
    if (userLogin === null) {
      return res.status(400).json({ message: "user not found" });
    }
    const hashedPassword = await bcrypt.compare(
      validation.data.password,
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
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res
      .status(200)
      .json({ message: `user ${result.username} was deleted succesfully` });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, getAllUsers, loginUser, deleteUser };
