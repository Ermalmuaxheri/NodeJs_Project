require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./routes/auth");

app.use(express.json());

app.use("/auth", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(4000, () => console.log("running on port 4000"));
