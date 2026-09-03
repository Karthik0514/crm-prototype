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

            console.error(
                "❌ Error creating leads table:",
                err.message
            );

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

            console.error(
                "❌ Error creating chat_sessions table:",
                err.message
            );

        } else {

            console.log("✅ Chat Sessions table ready");

        }

    });


    // -----------------------------------------
    // ADD current_lead TO EXISTING DATABASE
    // -----------------------------------------

    db.run(`
        ALTER TABLE chat_sessions
        ADD COLUMN current_lead TEXT
    `, (err) => {

        if (err) {

            if (
                err.message.includes(
                    "duplicate column name"
                )
            ) {

                console.log(
                    "ℹ️ current_lead column already exists"
                );

            } else {

                console.error(
                    "❌ Error adding current_lead:",
                    err.message
                );

            }

        } else {

            console.log(
                "✅ current_lead column added"
            );

        }

    });


    // -----------------------------------------
    // ADD pending_action TO EXISTING DATABASE
    // -----------------------------------------

    db.run(`
        ALTER TABLE chat_sessions
        ADD COLUMN pending_action TEXT
    `, (err) => {

        if (err) {

            if (
                err.message.includes(
                    "duplicate column name"
                )
            ) {

                console.log(
                    "ℹ️ pending_action column already exists"
                );

            } else {

                console.error(
                    "❌ Error adding pending_action:",
                    err.message
                );

            }

        } else {

            console.log(
                "✅ pending_action column added"
            );

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

            console.log(
                "✅ Chat Messages table ready"
            );

        }

    });


    // -----------------------------------------
    // CAMPAIGNS
    // -----------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS campaigns (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            channel TEXT NOT NULL,

            audience TEXT NOT NULL,

            sent INTEGER DEFAULT 0,

            total INTEGER DEFAULT 0,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `, (err) => {

        if (err) {

            console.error(
                "❌ Error creating campaigns table:",
                err.message
            );

        } else {

            console.log(
                "✅ Campaigns table ready"
            );

        }

    });


    // -----------------------------------------
    // SALES
    // -----------------------------------------

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            lead_id INTEGER NOT NULL,

            customer_name TEXT NOT NULL,

            company TEXT,

            source TEXT,

            sale_amount REAL NOT NULL,

            amount_paid REAL DEFAULT 0,

            payment_status TEXT DEFAULT 'Pending',

            payment_due_date TEXT,

            payment_notes TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(lead_id)
            REFERENCES leads(id)

        )
    `, (err) => {

        if (err) {

            console.error(
                "❌ Error creating sales table:",
                err.message
            );

        } else {

            console.log(
                "✅ Sales table ready"
            );

        }

    });

    // -----------------------------------------
    // USERS
    // -----------------------------------------

    db.run(
        `
    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT NOT NULL UNIQUE,

        phone TEXT,

        password TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `,
        (err) => {

            if (err) {

                console.error(
                    "❌ Error creating users table:",
                    err.message
                );

            } else {

                console.log(
                    "✅ Users table ready"
                );

            }

        }
    );

    // ==========================================
    // NOTIFICATIONS TABLE
    // ==========================================

    db.run(`
    CREATE TABLE IF NOT EXISTS notifications (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        type TEXT NOT NULL,

        title TEXT NOT NULL,

        message TEXT NOT NULL,

        related_id INTEGER,

        is_read INTEGER DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`, (err) => {

        if (err) {

            console.error(
                "❌ Failed to create Notifications table:",
                err
            );

        } else {

            console.log(
                "✅ Notifications table ready"
            );

        }

    });

    // ==========================================
    // EMPLOYEES TABLE
    // ==========================================

    db.run(`
    CREATE TABLE IF NOT EXISTS employees (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT NOT NULL UNIQUE,

        phone TEXT,

        role TEXT NOT NULL,

        department TEXT,

        status TEXT DEFAULT 'Active',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`);

});