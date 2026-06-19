const express = require("express");
const router = express.Router();
// const { readNotes, writeNotes } = require("../helpers");
const authMiddleware = require("../middleware/auth");
const db = require("../db");

router.get("/", async (req, res, next) => {
  //get all notes
  try {
    const notes = db.prepare("SELECT * FROM notes").all();
    // res.json(await readNotes());
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = db
      .prepare("SELECT * FROM notes WHERE id=?")
      .get(req.params.id);
    // const notes = await readNotes();
    // const parsedId = parseInt(req.params.id);
    // const response = notes.find((note) => note.id === parsedId);
    if (result) {
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
    // const newId = notes.length + 1;
    // const newNote = {
    //   id: newId,
    //   title: req.body.title,
    //   body: req.body.body,
    // };
    const result = db
      .prepare("INSERT INTO notes (title, body) VALUES (?, ?)")
      .run(req.body.title, req.body.body);
    // notes.push(newNote);
    // await writeNotes(notes);
    res.status(201).json({
      id: result.lastInsertRowid,
      title: req.body.title,
      body: req.body.body,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    // const notes = await readNotes();
    // const parsedId = parseInt(req.params.id);
    // const noteToEdit = notes.find((note) => note.id === parsedId);
    const result = db
      .prepare("UPDATE notes SET title=?, body=? WHERE id=?")
      .run(req.body.title, req.body.body, req.params.id);
    console.log(result.changes); //this shows how many lines it got changed from running it, for now its =1, we can use it to check
    if (result.changes === 0) {
      res.status(404).json("note not found");
    } else {
      res.status(200).json({
        message: "done, lines changed",
        lines_Changed: result.changes,
      });
    }

    // if (noteToEdit) {
    //   noteToEdit.title = req.body.title;
    //   noteToEdit.body = req.body.body;
    //   await writeNotes(notes);
    //   res.status(200).json(noteToEdit);
    // } else {
    //   res.status(404).json({ error: "Note not found" });
    // }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    // const notes = await readNotes();
    // const parsedId = parseInt(req.params.id);
    // const noteToDelete = notes.find((note) => note.id === parsedId);
    const result = db
      .prepare("DELETE FROM notes WHERE id=?")
      .run(req.params.id);
    console.log(result.changes);
    if (result.changes === 0) {
      res.status(404).json("note not found");
    } else {
      res.status(200).json({
        message: `note deleted succesfuly with id ${req.params.id}`,
        lines_Changed: result.changes,
      });
    }
    // if (noteToDelete) {
    //   const updatedNotes = notes.filter((note) => note.id !== parsedId);
    //   await writeNotes(updatedNotes);
    //   res.status(200).json({ message: "deleted successfully" });
    // } else {
    //   res.status(404).json({ error: "Note not found" });
    // }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
