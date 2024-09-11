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

// add a film to a user's list
app.post("/add", async (request, response) => {
  console.log("request.body", request.body);

  if (request.body.list == "seen") {
    const post = await db.query(
      `
      UPDATE week05projectusers
      SET seenlist = ARRAY_APPEND(seenlist, $1) 
      WHERE username = $2`,
      [request.body.filmID, request.body.username]
    );
    response.json(post);
  } else if (request.body.list == "watch") {
    const post = await db.query(
      `
      UPDATE week05projectusers
      SET watchlist = ARRAY_APPEND(watchlist, $1) 
      WHERE username = $2`,
      [request.body.filmID, request.body.username]
    );
    response.json(post);
  } else {
    response.status(400).json({ error: "Invalid list name" });
  }
});

app.get("/film", async (request, response) => {
  const filmID = request.query.filmid;
  console.log(filmID);
  // check if it's in database
  const dbresult = await db.query(
    `SELECT * FROM week05projectfilms WHERE id = ${filmID}`
  );
  if (dbresult.rowCount === 0) {
    const result = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.TMDB_API_KEY}`
    );
    const resultData = await result.json();
    const genres = [];
    for (const genre of resultData.genres) {
      genres.push(genre.id);
    }
    console.log(`${genres}`);
    const year = resultData.release_date.split("-")[0];
    await db.query(
      `INSERT INTO week05projectfilms (id, title, year, genres) VALUES (
      ${resultData.id},
      '${resultData.title}',
      ${year},
      ARRAY[${genres}]
      )` // fix genres
    );
    const newObject = {
      id: resultData.id,
      title: resultData.title,
      year: year,
      genres: genres,
    };
    response.json(newObject);
  } else {
    response.json(dbresult.rows[0]);
  }
});

app.get("/films", async (_, response) => {
  const result = await db.query(`SELECT * FROM week05projectfilms`);
  response.json(result.rows);
});

// delete endpoint to remove from watchlist and/or seenlist
app.delete("/list", async (request, response) => {
  const { list, filmID, username } = request.body;

  if (list === "seen") {
    const result = await db.query(
      `
      UPDATE week05projectusers
      SET seenlist = ARRAY_REMOVE(seenlist, $1)
      WHERE username = $2`,
      [filmID, username]
    );
    response.json({ message: `Film ${filmID} removed from seenlist`, result });
  } else if (list === "watch") {
    const result = await db.query(
      `
      UPDATE week05projectusers
      SET watchlist = ARRAY_REMOVE(watchlist, $1)
      WHERE username = $2`,
      [filmID, username]
    );
    response.json({ message: `Film ${filmID} removed from watchlist`, result });
  } else {
    response.status(400).json({ error: "Invalid list name" });
  }
});

//endpoint - listing seen list and watch list depending on query
app.get("/list", async (request, response) => {
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
    response.status(400).json({ error: "Invalid list name" });
  }
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

// user info endpoint - lists all users
app.get("/users", async (_, response) => {
  const users = await db.query("SELECT * FROM week05projectusers");
  response.json(users.rows);
});

app.listen(8080, function () {
  console.log("App is running on port 8080");
});
