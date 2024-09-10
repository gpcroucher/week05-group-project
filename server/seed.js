import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});
db.query(`
CREATE TABLE users(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT,
    watchlist INT[],
    seenlist INT[]
  )`);

db.query(`INSERT INTO users (username, watchlist, seenlist) VALUES
  ('gpcroucher', ARRAY[32], ARRAY[12])`);
db.query(`
  INSERT INTO users (username, watchlist, seenlist) VALUES
  ('jonlee', ARRAY[12], ARRAY[15])`);
db.query(`
  INSERT INTO users (username, watchlist, seenlist) VALUES
  ('marc', ARRAY[53], ARRAY[82])`);
db.query(`
  INSERT INTO users (username, watchlist, seenlist) VALUES
  ('michelle', ARRAY[39], ARRAY[92])`);
db.query(`
  INSERT INTO users (username, watchlist, seenlist) VALUES
  ('willow', ARRAY[7], ARRAY[12])`);
db.query(`
  SELECT * from users`);
