import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../../app.js";
import db from "../../database/connection.js";

const router = Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
    // Define the destination folder for uploaded images
    destination: (req, file, cb) => {
        cb(null, "./public/uploadedImages/");
    },
    // Define the naming convention for uploaded images
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

// Initialize multer with the storage configuration
const upload = multer({ storage });

router.post("/api/images", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
        const { description, game } = req.body;
        const { id, nickname, email } = req.session.user;

        if (!req.file) {
            //TODO see if it better to save the old path in the db or somewhere else and then set it here if the nrw one is empty
        }
        const path = req.file.path;

        const [usersId, fields] = await db.execute("SELECT id FROM users WHERE nickname = ? AND email = ?;", [nickname, email]);
        const userId = usersId[0].id;

        const { lastID } = await db.execute("INSERT INTO images (user_id, description, game, image_url) VALUES (?, ?, ?, ?);", [userId, description, game, path]);

        res.status(200).json({ message: 'Image uploaded successfully', imagePath: path });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while uploading the image' });
    }
});

export default router;