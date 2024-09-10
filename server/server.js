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

app.listen(8080, function () {
  console.log("App is running on port 8080");
});
