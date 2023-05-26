import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../../app.js";
import db from "../../database/connection.js";

const router = Router();

/*GET*/
//All images where is_profile_img = 0;
router.get("/api/images", async (req, res) => {

    const [images, fields] = await db.execute("SELECT image_url, description, game FROM images WHERE user_email = ? AND is_profile_img=0;", [req.session.user.email]);

    res.status(200).json({ data: images });
});

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

        const { description, game, is_profile_img } = req.body;
        const { id, nickname, email } = req.session.user;
        const path = req.file.path;

        const [usersId, fields] = await db.execute("SELECT email FROM users WHERE nickname = ? AND email = ?;", [nickname, email]);
        const userEmail = usersId[0].email;

        const { lastID } = await db.execute("INSERT INTO images (user_email, description, game, image_url, is_profile_img) VALUES (?, ?, ?, ?, ?);", [userEmail, description, game, path, is_profile_img]);

        res.status(200).json({ message: 'Image uploaded successfully', imagePath: path });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while uploading the image' });
    }
});

router.patch("/api/images/:")

export default router;