import { Router } from "express";
import multer from "multer";

const router = Router();

router.get("/api/images", (req, res) => {
    res.send("LOL");
});

//Handles destination and the filename of the uploaded image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../client/Virtual-Escape/public/uploadedImages/");
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

router.post("/api/images", upload.single("file"), (req, res) => {
    console.log(req.file);
    res.send({ data: "File uploaded correctly" });
});

export default router;