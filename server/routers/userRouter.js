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
    /* //TODO implement later once it works
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Please provide all required credentials' });
    }
    */

    /* //TODO implement later once it works
    const user = await db.get('SELECT * FROM users WHERE email = ? AND nick = ?', [email, username]);
    if (user) {
        // Check if a user with the same credentials already exists
        if (user.username === username && user.email === email) return res.status(400).json({ message: `User with the username '${username}' and email '${email}' already exists` });

        // Check if a user with the same username already exists
        if (user.username === username) return res.status(400).json({ message: `User with the username '${username}' already exists` });

        // Check if a user with the same email already exists
        if (user.email === email) return res.status(400).json({ message: `User with the email '${email}' already exists` });
    }
    */

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