import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;
const isTruncateMode = process.argv.findIndex((argument) => argument === "truncate_mode") === -1 ? false : true;

// List of tables to empty or delete
const tables = [
  //"folder_images",
  // "comments",
  // "likes",
  // "folders",
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

// DDL
/*USERS*/
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

/*IMAGES*/
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

db.execute(`
CREATE TABLE IF NOT EXISTS best_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_nickname VARCHAR(255) NOT NULL,
  user_opinion VARCHAR(255) NOT NULL
);
`);

/*FOLLOWS*/
db.execute(`
  CREATE TABLE IF NOT EXISTS follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_email VARCHAR(255) NOT NULL,
    followee_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (follower_email) REFERENCES users (email) ON DELETE CASCADE,
    FOREIGN KEY (followee_email) REFERENCES users (email) ON DELETE CASCADE
  );
`);

/*FOLDERS
db.execute(`
  CREATE TABLE IF NOT EXISTS folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`);

/*FOLDER_IMAGES
db.execute(`
  CREATE TABLE IF NOT EXISTS folder_images (
    folder_id INT NOT NULL,
    image_id INT NOT NULL,
    order_index INT NOT NULL,
    PRIMARY KEY (folder_id, image_id),
    FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
  );
`);

/*COMMENTS
db.execute(`
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
  );
`);


/*LIKES
db.execute(`
  CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
  );
`);
*/
