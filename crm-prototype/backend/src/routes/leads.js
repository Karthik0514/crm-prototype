import express from "express";
import db from "../database/db.js";

import { generateEmail } from "../services/emailService.js";
import { analyzeLead } from "../services/aiService.js";
import { generateWhatsApp } from "../services/whatsappService.js";
import { generateCallScript } from "../services/callScriptService.js";

const router = express.Router();


// =========================================
// JSON BODY PARSER
// =========================================

router.use(express.json());


// =========================================
// GET ALL LEADS
// =========================================

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM leads",
        [],
        (err, rows) => {

            if (err) {

                console.error(
                    "❌ Error getting leads:",
                    err.message
                );

                return res.status(500).json(err);

            }

            res.json(rows);

        }
    );

});


// =========================================
// GET ONE LEAD
// =========================================

router.get("/:id", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],
        (err, row) => {

            if (err) {

                console.error(
                    "❌ Error getting lead:",
                    err.message
                );

                return res.status(500).json(err);

            }

            if (!row) {

                return res.status(404).json({
                    message: "Lead not found"
                });

            }

            res.json(row);

        }
    );

});


// =========================================
// AI ANALYZE LEAD
// =========================================

router.get("/:id/analyze", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],

        async (err, row) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!row) {

                return res.status(404).json({
                    message: "Lead not found"
                });

            }

            try {

                const analysis =
                    await analyzeLead(row);

                res.json(analysis);

            } catch (err) {

                console.error(
                    "❌ AI analysis error:",
                    err
                );

                res.status(500).json({
                    message: "AI analysis failed"
                });

            }

        }
    );

});


// =========================================
// CREATE LEAD
// =========================================

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
        `
        INSERT INTO leads
        (
            name,
            company,
            phone,
            email,
            source,
            status,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,

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

            if (err) {

                console.error(
                    "❌ Error creating lead:",
                    err.message
                );

                return res.status(500).json(err);

            }

            const newLeadId = this.lastID;


            // ==========================================
            // CREATE NOTIFICATION
            // ==========================================

            db.run(

                `
    INSERT INTO notifications
    (
        title,
        message,
        type
    )

    VALUES (?, ?, ?)
    `,

                [

                    "New Lead",

                    `${name} has been added as a new lead.`,

                    "new_lead"

                ],

                (notificationError) => {

                    if (notificationError) {

                        console.error(
                            "❌ Failed to create notification:",
                            notificationError.message
                        );

                    }


                    res.status(201).json({

                        message:
                            "Lead Created",

                        id:
                            newLeadId

                    });

                }

            );

        }
    );

});


// =========================================
// GENERATE EMAIL
// =========================================

router.get("/:id/email", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],

        async (err, lead) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!lead) {

                return res.status(404).json({
                    message: "Lead not found"
                });

            }

            try {

                const email =
                    await generateEmail(lead);

                res.json(email);

            } catch (err) {

                console.error(
                    "❌ Email generation error:",
                    err
                );

                res.status(500).json({
                    message:
                        "Failed to generate email"
                });

            }

        }
    );

});


// =========================================
// GENERATE WHATSAPP MESSAGE
// =========================================

router.get("/:id/whatsapp", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],

        async (err, lead) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!lead) {

                return res.status(404).json({
                    message: "Lead not found"
                });

            }

            try {

                const whatsapp =
                    await generateWhatsApp(lead);

                res.json(whatsapp);

            } catch (err) {

                console.error(
                    "❌ WhatsApp generation error:",
                    err
                );

                res.status(500).json({
                    message:
                        "WhatsApp generation failed"
                });

            }

        }
    );

});


// =========================================
// GENERATE CALL SCRIPT
// =========================================

router.get("/:id/call-script", (req, res) => {

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id],

        async (err, lead) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!lead) {

                return res.status(404).json({
                    message: "Lead not found"
                });

            }

            try {

                const script =
                    await generateCallScript(lead);

                res.json(script);

            } catch (err) {

                console.error(
                    "❌ Call script error:",
                    err
                );

                res.status(500).json({
                    message:
                        "Call script generation failed"
                });

            }

        }
    );

});


// =========================================
// CONVERT LEAD TO SALE
// =========================================

router.post("/:id/convert", (req, res) => {

    const { id } = req.params;

    console.log("Convert request received:");
    console.log("Lead ID:", id);
    console.log("Request body:", req.body);

    const {
        amount,
        payment_due_date,
        payment_notes
    } = req.body;

    const saleAmount = Number(amount);

    if (
        !saleAmount ||
        Number.isNaN(saleAmount) ||
        saleAmount <= 0
    ) {

        return res.status(400).json({
            message: "A valid sale amount is required."
        });

    }

    db.get(
        "SELECT * FROM leads WHERE id = ?",
        [id],
        (err, lead) => {

            if (err) {

                console.error(
                    "Error finding lead:",
                    err.message
                );

                return res.status(500).json({
                    message: "Database error."
                });

            }

            if (!lead) {

                return res.status(404).json({
                    message: "Lead not found."
                });

            }

            if (lead.status === "Converted") {

                return res.status(400).json({
                    message: "Lead is already converted."
                });

            }

            db.run(

                `
                INSERT INTO sales (
                    lead_id,
                    customer_name,
                    company,
                    source,
                    sale_amount,
                    amount_paid,
                    payment_status,
                    payment_due_date,
                    payment_notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,

                [
                    lead.id,
                    lead.name,
                    lead.company,
                    lead.source,
                    saleAmount,
                    0,
                    "Pending",
                    payment_due_date || null,
                    payment_notes || null
                ],

                function (err) {

                    if (err) {

                        console.error(
                            "Error creating sale:",
                            err.message
                        );

                        return res.status(500).json({
                            message: "Failed to create sale."
                        });

                    }

                    db.run(

                        `
                        UPDATE leads
                        SET status = ?
                        WHERE id = ?
                        `,

                        [
                            "Converted",
                            lead.id
                        ],

                        (err) => {

                            if (err) {

                                console.error(
                                    "Error updating lead:",
                                    err.message
                                );

                                return res.status(500).json({
                                    message: "Sale created but failed to update lead."
                                });

                            }

                            console.log(
                                "Sale created successfully. Sale ID:",
                                this.lastID
                            );

                            const saleId = this.lastID;


                            // ==========================================
                            // CREATE SALE NOTIFICATION
                            // ==========================================

                            db.run(

                                `
    INSERT INTO notifications
    (
        title,
        message,
        type
    )

    VALUES (?, ?, ?)
    `,

                                [

                                    "Lead Converted 🎉",

                                    `${lead.name} has been converted into a sale.`,

                                    "converted"

                                ],

                                (notificationError) => {

                                    if (notificationError) {

                                        console.error(
                                            "❌ Failed to create conversion notification:",
                                            notificationError.message
                                        );

                                    }


                                    res.status(201).json({

                                        message:
                                            "Lead converted to sale successfully.",

                                        sale_id:
                                            saleId

                                    });

                                }

                            );

                        }

                    );

                }

            );

        }

    );

});
// =========================================
// UPDATE LEAD
// =========================================

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


    // =========================================
    // GET CURRENT LEAD FIRST
    // =========================================

    db.get(

        `
        SELECT *
        FROM leads
        WHERE id = ?
        `,

        [req.params.id],

        (getError, existingLead) => {

            if (getError) {

                console.error(
                    "❌ Error getting lead before update:",
                    getError.message
                );

                return res.status(500).json({

                    message:
                        "Failed to get lead"

                });

            }


            if (!existingLead) {

                return res.status(404).json({

                    message:
                        "Lead not found"

                });

            }


            // Save the old status before updating

            const oldStatus =
                existingLead.status;


            // =========================================
            // UPDATE LEAD
            // =========================================

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

                function (updateError) {

                    if (updateError) {

                        console.error(
                            "❌ Error updating lead:",
                            updateError.message
                        );

                        return res.status(500).json({

                            message:
                                "Failed to update lead"

                        });

                    }


                    // =========================================
                    // CHECK IF STATUS ACTUALLY CHANGED
                    // =========================================

                    const statusChanged =
                        oldStatus !== status;


                    if (!statusChanged) {

                        return res.json({

                            message:
                                "Lead updated successfully"

                        });

                    }


                    // =========================================
                    // CREATE STATUS CHANGE NOTIFICATION
                    // =========================================

                    db.run(

                        `
                        INSERT INTO notifications
                        (
                            title,
                            message,
                            type
                        )

                        VALUES (?, ?, ?)
                        `,

                        [

                            "Lead Status Updated",

                            `${name || existingLead.name}'s status changed from ${oldStatus} to ${status}.`,

                            "status_change"

                        ],

                        (notificationError) => {

                            if (notificationError) {

                                console.error(
                                    "❌ Failed to create status notification:",
                                    notificationError.message
                                );

                                // The lead update still worked,
                                // so we return success.

                            }


                            res.json({

                                message:
                                    "Lead updated successfully"

                            });

                        }

                    );

                }

            );

        }

    );

});

// =========================================
// DELETE LEAD
// =========================================

router.delete("/:id", (req, res) => {

    db.run(

        "DELETE FROM leads WHERE id = ?",

        [req.params.id],

        function (err) {

            if (err) {

                console.error(
                    "❌ Error deleting lead:",
                    err.message
                );

                return res.status(500).json(err);

            }

            if (this.changes === 0) {

                return res.status(404).json({

                    message:
                        "Lead not found"

                });

            }

            res.json({

                message:
                    "Lead deleted successfully"

            });

        }

    );

});


export default router;