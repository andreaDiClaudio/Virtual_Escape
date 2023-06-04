import dotenv from "dotenv";
import { Router } from "express";
import nodemailer from "nodemailer";
import { isAuthenticated } from "../../app.js";

//needed to read .env file
dotenv.config();

const router = Router();

router.post("/contact", isAuthenticated, (req, res) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let details = {
        to: process.env.EMAIL_USER,
        subject: "From: " + req.body.email + " - " + req.body.subject,
        text: req.body.message
    };

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
            res.status(200).send({ message: "email sent correctly" })
        }
    });
});

export default router;