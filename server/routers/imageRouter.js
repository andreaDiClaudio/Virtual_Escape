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
        const originalFilename = filenameParts.join(".");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);

        const newFileName = uniqueSuffix + "___" + originalFilename + "." + extension;

        cb(null, newFileName);
    }
});

const upload = multer({ storage });

router.post("/api/images", isAuthenticated, upload.single("file"), (req, res) => {

    //TODO Database queries
    //TODO polishing and commments

    console.log(req.session.user);
    console.log(req.file);
    console.log(req.body);

    res.sendStatus(200);
});

export default router;