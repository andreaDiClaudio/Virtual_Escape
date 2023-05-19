import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../app.js";
import db from "../database/connection.js";
import connection from "../database/connection.js";

const router = Router();

//Handles destination and the filename of the uploaded image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploadedImages/");
    },
    filename: (req, file, cb) => {
        const filenameParts = file.originalname.split(".");

        if (filenameParts.length <= 1) {
            cb(new Error("File has no extension: " + file.originalname));
        }

        const extension = filenameParts.pop();
        const originalFilename = filenameParts.join(".").replace(/\s+/g, '_');
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const newFileName = uniqueSuffix + "___" + originalFilename + "." + extension;

        cb(null, newFileName);
    }
});

const upload = multer({ storage });

router.post("/api/images", isAuthenticated, upload.single("file"), async (req, res) => {
    const { description, game } = req.body;
    const { id, nickname, email } = req.session.user;
    const path = req.file.path;

    const [usersId, fields] = await db.execute("SELECT id FROM users WHERE nickname = ? AND email = ?;", [nickname, email]);
    const userId = usersId[0].id;

    const { lastID } = await db.execute("INSERT INTO images (user_id, description, game, image_url) VALUES (?, ?, ?, ?);", [userId, description, game, path]);

    res.sendStatus(200);
});

//TODO polishing and commments
export default router;