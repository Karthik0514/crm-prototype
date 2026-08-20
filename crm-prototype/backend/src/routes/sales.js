import express from "express";
import db from "../database/db.js";

const router = express.Router();


// ==================================================
// GET ALL SALES
// ==================================================

router.get("/", (req, res) => {

    db.all(
        `
        SELECT *
        FROM sales
        ORDER BY created_at DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                console.error(
                    "❌ Failed to fetch sales:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch sales"
                });

            }


            res.json(rows);

        }
    );

});


// ==================================================
// GET ONE SALE
// ==================================================

router.get("/:id", (req, res) => {

    db.get(
        `
        SELECT *
        FROM sales
        WHERE id = ?
        `,
        [req.params.id],
        (err, sale) => {

            if (err) {

                console.error(
                    "❌ Failed to fetch sale:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch sale"
                });

            }


            if (!sale) {

                return res.status(404).json({
                    message: "Sale not found"
                });

            }


            res.json(sale);

        }
    );

});


// ==================================================
// UPDATE PAYMENT
// ==================================================

router.put("/:id/payment", (req, res) => {

    const {

        amount_paid,

        payment_status,

        payment_due_date,

        payment_notes

    } = req.body;


    const paidAmount =
        Number(amount_paid);


    // Validate amount
    if (

        Number.isNaN(paidAmount) ||

        paidAmount < 0

    ) {

        return res.status(400).json({

            message:
                "Amount paid must be a valid positive number"

        });

    }


    // First check whether sale exists
    db.get(

        `
        SELECT *
        FROM sales
        WHERE id = ?
        `,

        [req.params.id],

        (err, sale) => {

            if (err) {

                console.error(
                    "❌ Failed to find sale:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to find sale"

                });

            }


            if (!sale) {

                return res.status(404).json({

                    message:
                        "Sale not found"

                });

            }


            // Prevent paying more than sale amount
            if (

                paidAmount >

                Number(sale.sale_amount)

            ) {

                return res.status(400).json({

                    message:
                        "Amount paid cannot exceed sale amount"

                });

            }


            db.run(

                `
                UPDATE sales

                SET

                    amount_paid = ?,

                    payment_status = ?,

                    payment_due_date = ?,

                    payment_notes = ?

                WHERE id = ?
                `,

                [

                    paidAmount,

                    payment_status || "Pending",

                    payment_due_date || null,

                    payment_notes || null,

                    req.params.id

                ],

                function (err) {

                    if (err) {

                        console.error(

                            "❌ Failed to update payment:",

                            err

                        );

                        return res.status(500).json({

                            message:
                                "Failed to update payment"

                        });

                    }


                    if (this.changes === 0) {

                        return res.status(404).json({

                            message:
                                "Sale not found"

                        });

                    }


                    res.json({

                        message:
                            "Payment updated successfully"

                    });

                }

            );

        }

    );

});


export default router;