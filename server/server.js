import express, { response } from "express";
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
// Search endpoint
app.get("/search", async (request, response) => {
  const q = request.query.q; // get the search query from the client

  if (!q) {
    return response.status(400).json({ message: "Search query missing" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${apiKey}`;

  const result = await fetch(apiUrl);
  const data = await result.json();
  console.log(data);
  response.status(200).json(data.results);
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

app.post("/list", async (request, response) => {
  console.log("request.body", request.body);

  if (request.body.list == "seenlist") {
    const post = await db.query(
      `
      UPDATE week05projectusers
      SET seenlist = ARRAY_APPEND(seenlist, $1) 
      WHERE username = $2`,
      [request.body.filmID, request.body.username]
    );
    response.json(post);
  } else if (request.body.list == "watchlist") {
    const post = await db.query(
      `
      UPDATE week05projectusers
      SET watchlist = ARRAY_APPEND(watchlist, $1) 
      WHERE username = $2`,
      [request.body.filmID, request.body.username]
    );
    response.json(post);
  } else {
    response.status(400).json({ error: "invalid list type" });
  }
});

app.delete("/list", async function (request, response) {
  const { list, filmID, username } = request.body;

  if (list === "seenlist") {
    const result = await db.query(
      `
      UPDATE week05projectusers
      SET seenlist = ARRAY_REMOVE(seenlist, $1)
      WHERE username = $2`,
      [filmID, username]
    );
    response.json({ message: "Film removed from seenlist", result });
  } else if (list === "watchlist") {
    const result = await db.query(
      `
      UPDATE week05projectusers
      SET watchlist = ARRAY_REMOVE(watchlist, $1)
      WHERE username = $2`,
      [filmID, username]
    );
    response.json({ message: "Film removed from watchlist", result });
  } else {
    response.status(400).json({ error: "Invalid list type" });
  }
});

app.listen(8080, function () {
  console.log("App is running on port 8080");
});
