import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/users", async function (request, response) {
  const users = await db.query("SELECT * FROM week05projectusers");
  response.json(users.rows);
});

app.get("/list", async function (request, response) {
  const query = request.query;
  console.log(query);

  if (request.query.list === "seen") {
    const seenlist = await db.query(
      `SELECT seenlist FROM week05projectusers WHERE username = $1`,
      [query.user]
    );
    response.json(seenlist.rows);
  } else if (query.list === "watch") {
    const watchlist = await db.query(
      `SELECT watchlist FROM week05projectusers WHERE username = $1`,
      [query.user]
    );
    response.json(watchlist.rows);
  } else {
    response.status(400).json({ error: "invalid list type" });
  }
});

app.listen(8080, function () {
  console.log("App is running on port 8080");
});
