import express from "express";

const app = express();

//for parsing the req.body
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ message: "Working" });
})

import userRouter from "./routers/userRouter.js";
app.use(userRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT)
})