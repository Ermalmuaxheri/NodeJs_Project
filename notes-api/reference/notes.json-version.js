// ============================================================
// REFERENCE ONLY — not loaded by the app.
// Storage method: JSON FILE (data/notes.json) via fs + helpers.
// This is how the notes routes looked in our FIRST version.
// Compare against notes.sqlite-version.js to see what changed.
// ============================================================

const express = require("express");
const router = express.Router();
const { readNotes, writeNotes } = require("../helpers");
const authMiddleware = require("../middleware/auth");

// GET all notes
router.get("/", async (req, res, next) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// GET one note by id
router.get("/:id", async (req, res, next) => {
  try {
    const notes = await readNotes();
    const parsedId = parseInt(req.params.id);
    const note = notes.find((note) => note.id === parsedId);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CREATE a note
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const notes = await readNotes();
    const newNote = {
      id: notes.length + 1,
      title: req.body.title,
      body: req.body.body,
    };
    notes.push(newNote);
    await writeNotes(notes);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
});

// UPDATE a note
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const notes = await readNotes();
    const parsedId = parseInt(req.params.id);
    const noteToEdit = notes.find((note) => note.id === parsedId);
    if (noteToEdit) {
      noteToEdit.title = req.body.title;
      noteToEdit.body = req.body.body;
      await writeNotes(notes);
      res.status(200).json(noteToEdit);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE a note
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const notes = await readNotes();
    const parsedId = parseInt(req.params.id);
    const noteToDelete = notes.find((note) => note.id === parsedId);
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== parsedId);
      await writeNotes(updatedNotes);
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
