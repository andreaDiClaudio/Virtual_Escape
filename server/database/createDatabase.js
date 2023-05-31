import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;
const isTruncateMode = process.argv.findIndex((argument) => argument === "truncate_mode") === -1 ? false : true;

// List of tables to empty or delete
const tables = [
  "follows",
  "images",
  "users",
];

if (isDeleteMode) {
  // Delete the tables (drop schema)
  tables.forEach((table) => {
    db.execute(`DROP TABLE ${table};`);
  });
} else if (isTruncateMode) {
  // Empty the tables without deleting them (truncate data)
  tables.forEach((table) => {
    db.execute(`DELETE FROM ${table};`);
  });
}

/*DDL*/
// Users
db.execute(`
 CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 nickname VARCHAR(255) NOT NULL,
 password VARCHAR(255) NOT NULL,
 bio TEXT,
 age INT,
 country VARCHAR(255),
 language VARCHAR(255),
 gamertag VARCHAR(255),
 profile_img_url TEXT
 );
`);

// Images
db.execute(` 
 CREATE TABLE IF NOT EXISTS images (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_email VARCHAR(255) NOT NULL,
 description TEXT,
 game VARCHAR(255),
 image_url TEXT NOT NULL,
 is_profile_img TINYINT NOT NULL,
 FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE CASCADE
 );
`);

// Best Games
db.execute(`
CREATE TABLE IF NOT EXISTS best_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_nickname VARCHAR(255) NOT NULL,
  user_opinion VARCHAR(255) NOT NULL
);
`);
