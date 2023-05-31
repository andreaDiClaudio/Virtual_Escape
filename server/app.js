import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { join } from "path";
import db from "./database/connection.js";

/*Instatiate express*/
const app = express();
/*Middleware for parsing the body of a request*/
app.use(express.json());
/*Set the current workin directory*/
const currentWorkingDirectory = process.cwd();
/*Serves the static files inside the directory*/
app.use("/public", express.static(join(currentWorkingDirectory, "public")));

/*Cors*/
app.use(cors({
    credentials: true,
    origin: true
}));

//needed to read .env file
dotenv.config();

/*Session*/
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //it will resave the session even if changes do not happen
    saveUninitialized: true,
    cookie: { secure: false } //'secure : true' expect us to use https    
}));

/*Rate limit*/
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/login", apiLimiter);
app.use("/home", apiLimiter);

/*Middleware*/
// To check if the user is authenticated
export function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/*Websocket*/
import http from "http";
const server = http.createServer(app); //HTTP server will use Express to handle incoming HTTP requests

import { Server } from "socket.io";
const io = new Server(server, { //socket.io server will use the same HTTP server to handle incoming connections
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

/*Get all opinions*/
async function getOpinions() {
    const [rows] = await db.execute("SELECT * FROM best_games");
    let sorted = rows.reverse();
    return sorted;
}

/*Save a new opinion*/
async function insertOpinion(username, opinion) {
    const insertQuery = `
    INSERT INTO best_games (user_nickname, user_opinion)
    VALUES (?, ?);
    `;
    await db.execute(insertQuery, [username, opinion]);
}

(async () => {
    // send the list of all opininons 
    io.on("connection", async (socket) => {
        const opinions = await getOpinions();
        socket.emit("update opinions", opinions);

        //submit opinion
        socket.on("submit opinion", async (data) => {
            // saves the opinion in the database 
            await insertOpinion(data.username, data.opinion);

            // sends back all opinions
            const updatedOpinions = await getOpinions();
            io.emit("update opinions", updatedOpinions);
        });
    });
})();

/*Routes*/
import userRouter from "./routers/user/userRouter.js";
app.use(userRouter);

import loginRouter from "./routers/authentication/loginRouter.js";
app.use(loginRouter);

import imageRouter from "./routers/image/imageRouter.js";
app.use(imageRouter);

import logoutRouter from "./routers/authentication/logoutRouter.js";
app.use(logoutRouter);

const PORT = process.env.PORT;
server.listen((PORT), () => {
    console.log("Server is running on port:", PORT)
})