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


export default router;