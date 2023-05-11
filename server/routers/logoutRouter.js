import { Router } from "express";

const router = Router();

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.sendStatus(200);
    });
});

export default router;