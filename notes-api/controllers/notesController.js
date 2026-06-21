const prisma = require("../prismaClient");
const { z } = require("zod");

//imports

const noteSchema = z.object({
  title: z.string().min(2),
  body: z.string().optional(),
});

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
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
};

const addNote = async (req, res, next) => {
  try {
    const validation = noteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const result = await prisma.note.create({
      data: {
        title: validation.data.title,
        body: validation.data.body,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      id: result.id,
      title: validation.data.title,
      body: validation.data.body,
      message: "succesfully sent using prisma!!!",
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const validation = noteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const result = await prisma.note.update({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: { title: validation.data.title, body: validation.data.body },
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
};

const deleteNote = async (req, res, next) => {
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
};
module.exports = { getAllNotes, getNoteById, addNote, deleteNote, updateNote };
