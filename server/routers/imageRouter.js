import { Router } from "express";
import multer from "multer";
import router from "./userRouter";

//Handles destination and the filename of the uploaded image
const storage = multer.diskStorage({
    //determines where in our folder system to store the images
    destination: (req, file, cb) => {
        //       | actual path to the folder where  to store the images
        cb(null, "../uploadedImages")
    },

    //determines the filename
    filename: (req, file, cb) => {
        const filenameParts = file.originalname.split(".");
        if (filenameParts.length <= 1) {
            cb(new Error("File has no extension: " + file.originalname));
        }

        const extension = filenameParts.pop();
        const originalFilename = filenameParts.join(".");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);

        const newFileName = uniqueSuffix + "_" + originalFilename + "." + extension;

        console.log("Uplaoded file name: " + file);//TODO remove
        console.log("New file name: " + newFileName);//TODO remove

        cb(null, newFileName);
    }
});

const upload = multer({ storage: storage });

router.post("/api/images", upload.single("image-input"), (req, res) => {
    res.send({ data: "It works" });
    //TODO try to create the handleform function in the frontend
});

export default router;