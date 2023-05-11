import express from "express";

const app = express();
//for parsing the req.body
app.use(express.json());

import userRouter from "./routers/userRouter.js";
app.use(userRouter);

import loginRouter from "./routers/loginRouter.js";
app.use(loginRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT)
})