import express from "express";
import db from "../database/db.js";

const router = express.Router();


// ==========================================
// GET ALL CAMPAIGNS
// ==========================================

router.get("/", (req, res) => {

    db.all(
        `
        SELECT *
        FROM campaigns
        ORDER BY created_at DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    error: "Failed to fetch campaigns"
                });

            }

            res.json(rows);

        }
    );

});


// ==========================================
// CREATE NEW CAMPAIGN
// ==========================================

router.post("/", (req, res) => {

    const {
        name,
        channel,
        audience,
        total
    } = req.body;


    if (
        !name ||
        !channel ||
        !audience ||
        !total
    ) {

        return res.status(400).json({
            error: "All fields are required"
        });

    }


    db.run(
        `
        INSERT INTO campaigns
        (
            name,
            channel,
            audience,
            total
        )

        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            channel,
            audience,
            Number(total)
        ],
        function (err) {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    error: "Failed to create campaign"
                });

            }


            res.json({

                success: true,

                id: this.lastID

            });

        }
    );

});


// ==========================================
// UPDATE SENT COUNT
// ==========================================

router.put("/:id", (req, res) => {

    const { sent } = req.body;


    db.run(
        `
        UPDATE campaigns

        SET sent = ?

        WHERE id = ?
        `,
        [
            Number(sent),
            req.params.id
        ],
        function (err) {

            if (err) {

                return res.status(500).json({
                    error: "Failed to update campaign"
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    error: "Campaign not found"
                });

            }


            res.json({
                success: true
            });

        }
    );

});


// ==========================================
// DELETE CAMPAIGN
// ==========================================

router.delete("/:id", (req, res) => {

    db.run(
        `
        DELETE FROM campaigns
        WHERE id = ?
        `,
        [req.params.id],
        function (err) {

            if (err) {

                return res.status(500).json({
                    error: "Failed to delete campaign"
                });

            }


            res.json({
                success: true
            });

        }
    );

});


export default router;