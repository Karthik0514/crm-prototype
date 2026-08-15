import db from "./db.js";

db.serialize(() => {

    // -----------------------------------------
    // LEADS
    // -----------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            company TEXT,
            phone TEXT,
            email TEXT,
            source TEXT,
            status TEXT,
            notes TEXT
        )
    `, (err) => {

        if (err) {
            console.error("❌ Error creating leads table:", err.message);
        } else {
            console.log("✅ Leads table ready");
        }

    });


    // -----------------------------------------
    // CHAT SESSIONS
    // -----------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT DEFAULT 'New Chat',

            current_lead TEXT,

            pending_action TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `, (err) => {

        if (err) {
            console.error("❌ Error creating chat_sessions table:", err.message);
        } else {
            console.log("✅ Chat Sessions table ready");
        }

    });


    // -----------------------------------------
    // ADD NEW COLUMNS TO EXISTING DATABASE
    // -----------------------------------------
    //
    // IMPORTANT:
    // CREATE TABLE IF NOT EXISTS does NOT modify
    // an existing table.
    //
    // These ALTER statements make sure an older
    // database gets the new columns.
    // -----------------------------------------

    db.run(`
        ALTER TABLE chat_sessions
        ADD COLUMN current_lead TEXT
    `, (err) => {

        if (err) {

            if (err.message.includes("duplicate column name")) {

                console.log("ℹ️ current_lead column already exists");

            } else {

                console.error(
                    "❌ Error adding current_lead:",
                    err.message
                );

            }

        } else {

            console.log("✅ current_lead column added");

        }

    });


    db.run(`
        ALTER TABLE chat_sessions
        ADD COLUMN pending_action TEXT
    `, (err) => {

        if (err) {

            if (err.message.includes("duplicate column name")) {

                console.log("ℹ️ pending_action column already exists");

            } else {

                console.error(
                    "❌ Error adding pending_action:",
                    err.message
                );

            }

        } else {

            console.log("✅ pending_action column added");

        }

    });


    // -----------------------------------------
    // CHAT MESSAGES
    // -----------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS chat_messages (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            session_id INTEGER,

            sender TEXT,

            message TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(session_id)
            REFERENCES chat_sessions(id)

        )
    `, (err) => {

        if (err) {
            console.error(
                "❌ Error creating chat_messages table:",
                err.message
            );
        } else {
            console.log("✅ Chat Messages table ready");
        }

    });

});