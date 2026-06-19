const fs = require("fs");

async function readUser() {
  return JSON.parse(await fs.promises.readFile("./data/users.json", "utf-8"));
}

async function writeUser(data) {
  await fs.promises.writeFile("./data/users.json", JSON.stringify(data));
}

module.exports = { readUser, writeUser };
