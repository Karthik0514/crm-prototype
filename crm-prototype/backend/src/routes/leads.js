import express from "express";
import db from "../database/db.js";
import { generateEmail } from "../services/emailService.js";
import { analyzeLead } from "../services/aiService.js";
import { generateWhatsApp } from "../services/whatsappService.js";
import { generateCallScript } from "../services/callScriptService.js";
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

router.get("/:id/analyze", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        async (err, row) => {

            if (err)
                return res.status(500).json(err);

            if (!row)
                return res.status(404).json({
                    message: "Lead not found"
                });

            try {

                const analysis = await analyzeLead(row);

                res.json(analysis);

            } catch (err) {

                console.error(err);

                res.status(500).json({
                    message: "AI analysis failed"
                });

            }

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

router.get("/:id/email", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        async (err, lead) => {

            if (err)
                return res.status(500).json(err);

            if (!lead)
                return res.status(404).json({
                    message: "Lead not found"
                });

            try {

                const email = await generateEmail(lead);

                res.json(email);

            } catch (err) {

                console.error(err);

                res.status(500).json({
                    message: "Failed to generate email"
                });

            }

        }
    );

});

router.get("/:id/whatsapp", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        async (err, lead) => {

            if (err)
                return res.status(500).json(err);

            if (!lead)
                return res.status(404).json({
                    message: "Lead not found"
                });

            try {

                const whatsapp = await generateWhatsApp(lead);

                res.json(whatsapp);

            } catch (err) {

                console.error(err);

                res.status(500).json({
                    message: "WhatsApp generation failed"
                });

            }

        }
    );

});
router.get("/:id/call-script", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        async (err, lead) => {

            if (err)
                return res.status(500).json(err);

            if (!lead)
                return res.status(404).json({
                    message: "Lead not found"
                });

            try {

                const script = await generateCallScript(lead);

                res.json(script);

            } catch (err) {

                console.error(err);

                res.status(500).json({
                    message: "Call script generation failed"
                });

            }

        }
    );

});

router.put("/:id", (req, res) => {

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
        `
        UPDATE leads
        SET
            name = ?,
            company = ?,
            phone = ?,
            email = ?,
            source = ?,
            status = ?,
            notes = ?
        WHERE id = ?
        `,
        [
            name,
            company,
            phone,
            email,
            source,
            status,
            notes,
            req.params.id
        ],
        function (err) {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Lead updated successfully"
            });

        }
    );

});
router.delete("/:id", (req, res) => {

    db.run(
        "DELETE FROM leads WHERE id = ?",
        [req.params.id],
        function (err) {

            if (err)
                return res.status(500).json(err);

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Lead not found"
                });
            }

            res.json({
                message: "Lead deleted successfully"
            });

        }
    );

});
export default router;