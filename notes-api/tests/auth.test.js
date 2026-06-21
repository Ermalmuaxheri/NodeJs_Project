const request = require("supertest");
const app = require("../app");

//register

test("register with no password returns 400", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "tester" }); // no password on purpose

  expect(res.status).toBe(400);
});

test("register with small password returns 400", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "tester", password: "123" });
  expect(res.status).toBe(400);
});

test("register with small username returns 400", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "12", password: "tester" });
  expect(res.status).toBe(400);
});

//Login

test("login with wrong username should return 400", async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ username: "tester", password: "tester" });
  expect(res.status).toBe(400);
});

test("login with wrong password should return 400", async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ username: "ermal", password: "tester" });
  expect(res.status).toBe(400);
});

//register

test("register with short password should return 400", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "ermal", password: "tes" });
  expect(res.status).toBe(400);
});
test("register with short username should return 400", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "e", password: "tester" });
  expect(res.status).toBe(400);
});

//get notes

test("request all notes with no token should return 401 (unauthorised)", async () => {
  const res = await request(app).get("/notes");
  expect(res.status).toBe(401);
});

test("request all notes with a valid token should return 200", async () => {
  const token = await request(app)
    .post("/auth/login")
    .send({ username: "ermal", password: "ermal" });
  console.log(token.status, token.body);
  const res = await request(app)
    .get("/notes/")
    .set("Authorization", "Bearer " + token.body.token);
  expect(res.status).toBe(200);
});
