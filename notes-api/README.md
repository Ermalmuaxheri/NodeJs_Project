# Notes API

My first backend project, built to learn Node.js from the ground up.

It's a notes app with user accounts: you register, log in, and create notes that belong to you. Only the owner can edit or delete their own notes.

## The journey

I rebuilt the storage layer three times to learn how each approach works:

1. **JSON files** — storing notes in a plain `.json` file with `fs`
2. **SQLite (better-sqlite3)** — raw SQL queries with prepared statements
3. **Prisma ORM** — the final version, using a schema, migrations, and a type-safe client

The old versions are kept in `reference/` so I can compare them. Auth started as a separate `auth-api` project (users in a JSON file) and was later merged in here using a real one-to-many relationship between `User` and `Note`.

## What it does

- Register / login with hashed passwords (bcrypt) and JWT tokens
- Full CRUD for notes
- Notes are tied to their owner via a foreign key — you only see and can edit/delete your own
- Protected routes via auth middleware

## Stack

- **Backend:** Node.js + Express, Prisma ORM + SQLite, bcrypt, jsonwebtoken, dotenv
- **Frontend:** plain HTML + vanilla JS (single file, served by Express)

## Note

The **backend is all hand-written** — that was the whole point of the project. The **frontend (`public/index.html`) is AI-generated**, since this was purely a backend learning exercise and I just needed something to test against.

## Running it

```bash
npm install
npx prisma migrate dev
npm start
```

Then open `localhost:3000`.
