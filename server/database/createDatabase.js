import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
  db.execute(`DROP TABLE folder_images;`);
  db.execute(`DROP TABLE comments;`);
  db.execute(`DROP TABLE likes;`);
  db.execute(`DROP TABLE follows;`);
  db.execute(`DROP TABLE folders;`);
  db.execute(`DROP TABLE images;`);
  db.execute(`DROP TABLE users;`);
}

/*
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
    gamertag VARCHAR(255)
  );
`);

/*IMAGES
db.execute(`
  CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    game VARCHAR(255),
    image_data LONGBLOB NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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

/*FOLLOWS
db.execute(`
  CREATE TABLE IF NOT EXISTS follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    followee_id INT NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users (id) ON DELETE CASCADE
  );
`);
*/
