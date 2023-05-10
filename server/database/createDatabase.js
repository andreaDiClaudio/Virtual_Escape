import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
    db.exec(`DROP TABLE planets;`);
    db.exec(`DROP TABLE people;`);
}


// DDL
