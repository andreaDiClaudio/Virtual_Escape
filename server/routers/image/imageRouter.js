import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../../app.js";
import db from "../../database/connection.js";

const router = Router();

/*GET*/
//All images where is_profile_img = 0;
router.get("/api/images", isAuthenticated, async (req, res) => {

    const [images, fields] = await db.execute("SELECT * FROM images WHERE is_profile_img=0;");

    res.status(200).json({ data: images });
});

router.get("/api/search/images/:email", async (req, res) => {

    const [images, fields] = await db.execute("SELECT id, image_url, description, game FROM images WHERE user_email = ? AND is_profile_img=0;", [req.params.email]);

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

/*POST*/
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

/*PATCH*/
router.patch("/api/images/:id", isAuthenticated, async (req, res) => {
    const image_id = req.params.id;

    if (!image_id) {
        return res.status(400).send({ error: "image id is required." });
    }

    const [rows, fields] = await db.execute(
        "SELECT description, game FROM images WHERE id = ?",
        [image_id]
    );

    if (rows.length === 0) {
        return res.status(404).send({ error: "image to update not found." });
    } else {
        // Update image info
        await db.execute("UPDATE images SET description = ?, game = ? WHERE id = ?", [req.body.description, req.body.game, image_id]);
        res.status(200).send({ message: "Image info updated correctly" });
    }
})

/*DELETE*/
router.delete("/api/images/:id", isAuthenticated, async (req, res) => {
    const image_id = req.params.id;

    if (!image_id) {
        return res.status(400).send({ error: "image id is required." });
    }

    const [rows, fields] = await db.execute(
        "SELECT description, game FROM images WHERE id = ?",
        [image_id]
    );

    if (rows.length === 0) {
        return res.status(404).send({ error: "image to update not found." });
    } else {
        // Delete image
        await db.execute("DELETE FROM images WHERE id = ?", [image_id]);
        res.status(200).send({ message: "Image deleted correctly" });
    }
})

export default router;