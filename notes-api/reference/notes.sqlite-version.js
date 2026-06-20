// ============================================================
// REFERENCE ONLY — not loaded by the app.
// Storage method: SQLite via better-sqlite3 (raw SQL, db.prepare).
// This is how the notes routes looked in our SECOND version.
// Note: better-sqlite3 is SYNCHRONOUS — no await on the queries.
// Compare against notes.json-version.js and the live Prisma routes.
// ============================================================

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db");

// GET all notes  ->  SELECT
router.get("/", async (req, res, next) => {
  try {
    const notes = db.prepare("SELECT * FROM notes").all();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// GET one note by id  ->  SELECT ... WHERE
router.get("/:id", async (req, res, next) => {
  try {
    const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CREATE a note  ->  INSERT
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const result = db
      .prepare("INSERT INTO notes (title, body) VALUES (?, ?)")
      .run(req.body.title, req.body.body);
    res.status(201).json({
      id: result.lastInsertRowid,
      title: req.body.title,
      body: req.body.body,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE a note  ->  UPDATE ... SET ... WHERE
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = db
      .prepare("UPDATE notes SET title = ?, body = ? WHERE id = ?")
      .run(req.body.title, req.body.body, req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.status(200).json({ message: "updated successfully", changes: result.changes });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE a note  ->  DELETE ... WHERE
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.status(200).json({ message: `note ${req.params.id} deleted successfully` });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
