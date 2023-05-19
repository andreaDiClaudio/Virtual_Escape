import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../../database/connection.js";

const router = Router();

export let hashedPassword = "";

//*GET*//
router.get("/api/users", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT nickname, email, bio, gamertag, age, country, language FROM users;")
    res.send({
        data: rows
    });
});

//get user by query paramethers
router.get("/api/users", async (req, res) => {
    const nickname = req.query.nickname;
    const email = req.query.email;

    if (!nickname || !email) {
        return res.status(400).send({ error: 'Both nickname and email are required.' });
    }

    const [rows, fields] = await db.execute(
        "SELECT nickname, email, gamertag, age, country, language FROM users WHERE nickname = ? AND email = ?",
        [nickname, email]
    );

    res.status(200).send({ data: userFound });
});

//*POST*//
router.post("/api/users", async (req, res) => {
    const { email, nickname, password } = req.body;

    // Validate the required fields
    if (!email || !password || !nickname) {
        return res.status(400).json({ message: 'Please provide all required credentials' });
    }

    // Check if a user with the same credentials already exists
    const [users, fields] = await db.execute('SELECT * FROM users WHERE email = ? OR nickname = ?', [email, nickname]);

    //saves the user in a variable
    const user = users[0];

    // If the user exists will send a message saying what fields are matched and status 400
    if (user) {
        if (user.nickname === nickname && user.email === email) return res.status(400).json({ message: `User with the nickname '${nickname}' and email '${email}' already exists` });

        if (user.nickname === nickname) return res.status(400).json({ message: `User with the nickname '${nickname}' already exists` });

        if (user.email === email) return res.status(400).json({ message: `User with the email '${email}' already exists` });
    }

    // Hash the password using bcrypt
    hashedPassword = await bcrypt.hash(password, 12);

    //Saving the user in the db
    const { lastID } = await db.execute("INSERT INTO users (email, nickname, password) VALUES (?, ?, ?);", [email, nickname, hashedPassword]);

    return res.status(201).json({
        message: `User created successfully`
    });
});


router.patch("/api/users/:id", (res, req) => {

    //TODO
    //find the id of the user
    //if userfound
    //UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;
});


export default router;