const fs = require("fs");

async function readNotes() {
  return JSON.parse(await fs.promises.readFile("./data/notes.json", "utf-8"));
}

async function writeNotes(notes) {
  await fs.promises.writeFile("./data/notes.json", JSON.stringify(notes));
}

module.exports = { readNotes, writeNotes };
