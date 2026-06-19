require("dotenv").config();

const express = require("express");
const app = express();
const notesRouter = require("./routes/notes");

app.use(express.json());
app.use(express.static("public"));
app.use("/notes", notesRouter);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/about", (req, res) => {
  res.json({
    about: [
      "this is the about page",
      "it will explain what this is about",
      "self explanatory",
    ],
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log("running on port 3000"));
