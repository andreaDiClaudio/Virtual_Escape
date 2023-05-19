import { Router } from "express";

const router = Router();

//Destroys the session
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.sendStatus(200);
    });
});

export default router;