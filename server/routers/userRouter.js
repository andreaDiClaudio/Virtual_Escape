import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

//*GET*//
router.get("/api/users", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM users;")
    res.send({
        data: rows
    });
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

    /*TODO Implement later once it works
    // Hash the password using bcrypt
    hashedPassword = await bcrypt.hash(password, 12);
    */

    //Saving the user in the db
    const { lastID } = await db.execute("INSERT INTO users (email, nickname, password) VALUES (?, ?, ?);", [email, nickname, password]);

    return res.status(201).json({
        message: `User created successfully`
    });
});

export default router;