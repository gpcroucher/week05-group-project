import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

// Search endpoint
app.get("/search", async (request, response) => {
  const { q } = request.query; // get the search query from the client

  if (!q) {
    return response.status(400).json({ message: "Search query missing" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    q
  )}&api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      // Return only the 'results' array from the TMDB response
      response.status(200).json(data.results);
    } else {
      response.status(response.status).json({ message: data.status_message });
    }
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
