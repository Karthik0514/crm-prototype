import db from "../database/db.js";


// -------------------------------------
// Create New Chat Session
// -------------------------------------

export function createChatSession(title = "New Chat") {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT INTO chat_sessions(title)
            VALUES(?)
            `,

            [title],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }

            }

        );

    });

}


// -------------------------------------
// Get All Sessions
// -------------------------------------

export function getAllChatSessions() {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM chat_sessions
            ORDER BY created_at DESC
            `,

            [],

            (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            }

        );

    });

}


// -------------------------------------
// Get Messages For Session
// -------------------------------------

export function getChatMessages(sessionId) {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM chat_messages
            WHERE session_id = ?
            ORDER BY id ASC
            `,

            [sessionId],

            (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            }

        );

    });

}


// -------------------------------------
// Save Message
// -------------------------------------

export function saveMessage(
    sessionId,
    sender,
    message
) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT INTO chat_messages(
                session_id,
                sender,
                message
            )
            VALUES(?,?,?)
            `,

            [
                sessionId,
                sender,
                message
            ],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}


// -------------------------------------
// Delete Chat
// -------------------------------------

export async function deleteChatSession(sessionId) {

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run(

                `
                DELETE FROM chat_messages
                WHERE session_id=?
                `,

                [sessionId],

                (err) => {

                    if (err) {
                        reject(err);
                    }

                }

            );

            db.run(

                `
                DELETE FROM chat_sessions
                WHERE id=?
                `,

                [sessionId],

                function (err) {

                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }

                }

            );

        });

    });

}


// =====================================
// CURRENT LEAD MEMORY
// =====================================


// -------------------------------------
// Save Current Lead
// -------------------------------------

export function updateCurrentLead(
    sessionId,
    lead
) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE chat_sessions
            SET current_lead=?
            WHERE id=?
            `,

            [
                lead,
                sessionId
            ],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}


// -------------------------------------
// Get Current Lead
// -------------------------------------

export function getCurrentLead(sessionId) {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT current_lead
            FROM chat_sessions
            WHERE id=?
            `,

            [sessionId],

            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row?.current_lead || null);
                }

            }

        );

    });

}


// -------------------------------------
// Clear Current Lead
// -------------------------------------

export function clearCurrentLead(sessionId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE chat_sessions
            SET current_lead=NULL
            WHERE id=?
            `,

            [sessionId],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}


// =====================================
// PENDING ACTION MEMORY
// =====================================


// -------------------------------------
// Save Pending Action
// -------------------------------------

export function updatePendingAction(
    sessionId,
    action
) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE chat_sessions
            SET pending_action=?
            WHERE id=?
            `,

            [
                action,
                sessionId
            ],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}


// -------------------------------------
// Get Pending Action
// -------------------------------------

export function getPendingAction(sessionId) {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT pending_action
            FROM chat_sessions
            WHERE id=?
            `,

            [sessionId],

            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row?.pending_action || null);
                }

            }

        );

    });

}


// -------------------------------------
// Clear Pending Action
// -------------------------------------

export function clearPendingAction(sessionId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE chat_sessions
            SET pending_action=NULL
            WHERE id=?
            `,

            [sessionId],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}