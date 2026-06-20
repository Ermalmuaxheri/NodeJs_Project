const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const prisma = require("../prismaClient");

router.get("/", authMiddleware, async (req, res, next) => {
  //get only the logged-in user's notes
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await prisma.note.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (result && result.userId === req.user.id) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const result = await prisma.note.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      id: result.id,
      title: req.body.title,
      body: req.body.body,
      message: "succesfully sent using prisma!!!",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await prisma.note.update({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: { title: req.body.title, body: req.body.body },
    });

    res.status(200).json({
      message: "done",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "note not found, try a different one" });
    }
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await prisma.note.delete({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    res
      .status(200)
      .json({ message: `done, deleted note with id ${result.id}` });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "note not found!" });
    }
    next(error);
  }
});

module.exports = router;
