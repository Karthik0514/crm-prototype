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
        ORDER BY created_at DESC, id DESC
        LIMIT 50
        `,
        [],
        (err, notifications) => {

            if (err) {

                console.error(
                    "❌ Error getting notifications:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to get notifications"
                });

            }

            res.json(notifications);

        }
    );

});


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// IMPORTANT: PUT THIS BEFORE /:id/read
// ==========================================

router.put("/read/all", (req, res) => {

    db.run(
        `
        UPDATE notifications
        SET is_read = 1
        `,
        [],
        (err) => {

            if (err) {

                console.error(
                    "❌ Error marking notifications as read:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to update notifications"
                });

            }

            res.json({
                message: "All notifications marked as read"
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
                    "❌ Error updating notification:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to update notification"
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Notification not found"
                });

            }

            res.json({
                message: "Notification marked as read"
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
                    "❌ Error deleting notification:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to delete notification"
                });

            }

            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Notification not found"
                });

            }

            res.json({
                message: "Notification deleted"
            });

        }
    );

});


export default router;