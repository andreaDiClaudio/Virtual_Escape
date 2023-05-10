import dotenv from 'dotenv';
import mysql from "mysql2/promise";

dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
});

// connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connection to database established successfully!');
});

export default connection;