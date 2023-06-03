import dotenv from "dotenv";

//needed to read .env file
dotenv.config();

/*Nodemailer*/
import nodemailer from "nodemailer";
const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

let details = {
    to: process.env.EMAIL_USER,
    subject: "Feedback",
    text: "Hello, your application is amazing. but you could improve and add followers and likes!"
};

mailTransporter.sendMail(details, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Email sent successfully");
    }
});