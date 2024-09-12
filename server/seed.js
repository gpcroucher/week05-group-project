import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

makeTables();

async function makeTables() {
  await makeUserTable();
  await makeFilmTable();
}

async function makeUserTable() {
  await db.query(`DROP TABLE IF EXISTS week05projectusers`);
  console.log("Deleted table 'week05projectusers' (if it existed)");

  await db.query(`
CREATE TABLE week05projectusers (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT,
    watchlist INT[],
    seenlist INT[]
  )`);
  console.log("Finished making table 'week05projectusers'");

  await db.query(`INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
  ('gpcroucher', ARRAY[11], ARRAY[12])`);
  await db.query(`
  INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
  ('jonlee', ARRAY[12], ARRAY[15])`);
  await db.query(`
  INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
  ('marc', ARRAY[53], ARRAY[82])`);
  await db.query(`
  INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
  ('michelle', ARRAY[39], ARRAY[92])`);
  await db.query(`
  INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
  ('willow', ARRAY[7], ARRAY[12])`);
  await db.query(`
    INSERT INTO week05projectusers (username, watchlist, seenlist) VALUES
    ('godzilla', ARRAY[100], ARRAY[200])`);
  const users = await db.query(`
      SELECT * from week05projectusers`);
  console.log(users.rows);
}

async function makeFilmTable() {
  await db.query(`DROP TABLE IF EXISTS week05projectfilms`);
  console.log("Deleted table 'week05projectfilms' (if it existed)");

  await db.query(`
CREATE TABLE week05projectfilms (
    id INT PRIMARY KEY,
    title TEXT,
    year INT,
    genre_ids INT[]
  )`);
  console.log("Finished making table 'week05projectfilms'");

  await db.query(
    `INSERT INTO week05projectfilms (id, title, year, genre_ids) VALUES (769, 'Goodfellas', 1990, ARRAY[18, 80])`
  );
  await db.query(
    `INSERT INTO week05projectfilms (id, title, year, genre_ids) VALUES (11, 'Star Wars', 1977, ARRAY[12, 28, 878])`
  );
  const films = await db.query(`
    SELECT * from week05projectfilms`);
  console.log(films.rows);
}
