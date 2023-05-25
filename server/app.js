import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { join } from "path";

const app = express();

const currentWorkingDirectory = process.cwd();

app.use("/public", express.static(join(currentWorkingDirectory, "public")));

app.use(express.json()); //for parsing the req.body

app.use(cors({
    credentials: true,
    origin: true
}));

/*SESSION*/
dotenv.config();//needed to read .env file

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //it will resave the session even if changes do not happen
    saveUninitialized: true,
    cookie: { secure: false } //'secure : true' expect us to use https    
}));

/*RATE LIMIT */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/login", apiLimiter);
app.use("/home", apiLimiter);

/* MIDDLEWARE */
// To check if the user is authenticated
export function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/*ROUTES*/
import userRouter from "./routers/user/userRouter.js";
app.use(userRouter);

import loginRouter from "./routers/authentication/loginRouter.js";
app.use(loginRouter);

import homeRouter from "./routers/home/homeRouter.js";
app.use(homeRouter);

import imageRouter from "./routers/image/imageRouter.js";
app.use(imageRouter);

import logoutRouter from "./routers/authentication/logoutRouter.js";
app.use(logoutRouter);

const PORT = process.env.PORT;
app.listen((PORT), () => {
    console.log("Server is running on port:", PORT)
})