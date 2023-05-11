import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../database/connection.js";

const router = Router();

//Only for testing the backend redirection to login
router.get("/login", (req, res) => {
    res.status(200).json({ message: "Redirected to login page" });
});

router.post("/login", async (req, res) => {
    const { email, nickname, password } = req.body;

    // Validate the required fields
    if (!email || !password || !nickname) {
        return res.status(400).json({ message: 'Please provide all required credentials' });
    }

    //Check if user exists
    const [users, fields] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
        return res.status(400).json({ message: `Couldn't find user with the email '${email}. Try again with different credentials'` });
    }

    //saves the user in a variable
    const user = users[0];

    if (user) {
        if (nickname != user.nickname)
            return res.status(404).json({
                message: `Couldn't find user with username '${nickname}' connected to email '${email}'`
            });
    }

    //Check if password is the same
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
        //save the user info in the session
        req.session.user = {
            id: user.id,
            nickname: user.nickname,
            email: user.email
        };

        console.log(req.session.user);

        return res.status(200).json({ message: "Logged in" });
    }
    else {
        return res.status(400).json({ message: "Wrong password. Try again" });
    }

});

export default router;