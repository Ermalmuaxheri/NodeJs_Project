const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
//imports

//controller imports->

const {
  getAllNotes,
  getNoteById,
  addNote,
  deleteNote,
  updateNote,
} = require("../controllers/notesController");

//calling from controller ->

router.get("/", authMiddleware, getAllNotes);
router.get("/:id", authMiddleware, getNoteById);
router.post("/", authMiddleware, addNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;
