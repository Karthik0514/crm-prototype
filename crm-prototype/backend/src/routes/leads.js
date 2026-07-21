import express from "express";
import db from "../database/db.js";

const router = express.Router();

// GET ALL LEADS
router.get("/", (req, res) => {

    db.all("SELECT * FROM leads", [], (err, rows) => {

        if (err) return res.status(500).json(err);

        res.json(rows);

    });

});

// GET ONE LEAD
router.get("/:id", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        (err, row) => {

            if (err)
                return res.status(500).json(err);

            if (!row)
                return res.status(404).json({
                    message: "Lead not found"
                });

            res.json(row);

        }
    );

});

// CREATE LEAD
router.post("/", (req, res) => {

    const {
        name,
        company,
        phone,
        email,
        source,
        status,
        notes
    } = req.body;

    db.run(
        `INSERT INTO leads
        (name, company, phone, email, source, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            name,
            company,
            phone,
            email,
            source,
            status,
            notes
        ],
        function (err) {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Lead Created",
                id: this.lastID
            });

        }
    );

});

export default router;