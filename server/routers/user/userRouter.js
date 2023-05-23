import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../../database/connection.js";

const router = Router();

export let hashedPassword = "";

//*GET*//
router.get("/api/users", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT id, nickname, email, bio, gamertag, age, country, language, profile_img_url FROM users;")

    console.log(rows[0]);
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

/*PATCH*/
router.patch("/api/users/:id", async (req, res) => {

    //Check if user exists
    const [users, fields] = await db.execute('SELECT gamertag, bio, age,country, language FROM users WHERE id = ?', [req.params.id]);

    if (users.length === 0) {
        res.status(404).send({ message: "User not found" });
    } else {

        if (req.body.age === "") {
            req.body.age = null;
        }

        if (req.body.age !== null && isNaN(parseInt(req.body.age))) {
            res.status(400).send({ message: "Wrong data, please try again filling the information correctly (Age as number)" });
        } else {
            // Update user info
            await db.execute("UPDATE users SET gamertag = ?, bio = ?, age = ?, country = ?, language = ?, profile_img_url = ? WHERE id = ?", [req.body.gamertag, req.body.bio, req.body.age, req.body.country, req.body.language, req.body.profile_img_url, req.params.id]);
            res.status(200).send({ message: "User info updated correctly" });
        }
    }
});


export default router;