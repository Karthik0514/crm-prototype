import express from "express";
import db from "../database/db.js";

const router = express.Router();

router.get("/context", (req, res) => {

    db.all(
        "SELECT * FROM leads",
        [],
        (err, rows) => {

            if (err)
                return res.status(500).json(err);

            res.json(rows);

        }
    );

});

export default router;