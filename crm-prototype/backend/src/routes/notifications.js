import express from "express";
import db from "../database/db.js";

const router = express.Router();


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

router.get("/", (req, res) => {

    db.all(

        `
        SELECT *
        FROM notifications
        ORDER BY
            is_read ASC,
            created_at DESC
        LIMIT 50
        `,

        [],

        (err, notifications) => {

            if (err) {

                console.error(
                    "❌ Failed to fetch notifications:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to fetch notifications"

                });

            }


            res.json(notifications);

        }

    );

});


// ==========================================
// GET UNREAD COUNT
// ==========================================

router.get("/unread/count", (req, res) => {

    db.get(

        `
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE is_read = 0
        `,

        [],

        (err, result) => {

            if (err) {

                console.error(
                    "❌ Failed to count notifications:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to count notifications"

                });

            }


            res.json({

                count:
                    result.count

            });

        }

    );

});


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

router.put("/:id/read", (req, res) => {

    db.run(

        `
        UPDATE notifications

        SET is_read = 1

        WHERE id = ?
        `,

        [req.params.id],

        function (err) {

            if (err) {

                console.error(
                    "❌ Failed to update notification:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to update notification"

                });

            }


            res.json({

                message:
                    "Notification marked as read"

            });

        }

    );

});


// ==========================================
// MARK ALL AS READ
// ==========================================

router.put("/read/all", (req, res) => {

    db.run(

        `
        UPDATE notifications

        SET is_read = 1

        WHERE is_read = 0
        `,

        [],

        function (err) {

            if (err) {

                console.error(
                    "❌ Failed to update notifications:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to update notifications"

                });

            }


            res.json({

                message:
                    "All notifications marked as read"

            });

        }

    );

});


// ==========================================
// DELETE NOTIFICATION
// ==========================================

router.delete("/:id", (req, res) => {

    db.run(

        `
        DELETE FROM notifications
        WHERE id = ?
        `,

        [req.params.id],

        function (err) {

            if (err) {

                console.error(
                    "❌ Failed to delete notification:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Failed to delete notification"

                });

            }


            res.json({

                message:
                    "Notification deleted"

            });

        }

    );

});


export default router;