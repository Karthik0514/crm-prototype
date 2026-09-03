import sqlite3 from "sqlite3";


// ======================================================
// DATABASE CONNECTION
// ======================================================

const db = new sqlite3.Database(
    "./crm.db",
    (err) => {

        if (err) {

            console.error(
                "❌ Database connection failed:",
                err.message
            );

        } else {

            console.log(
                "✅ Connected to SQLite database"
            );

        }

    }
);


// ======================================================
// SQLITE CONFIGURATION
// ======================================================

db.serialize(() => {

    // Enable foreign keys
    db.run(
        `PRAGMA foreign_keys = ON`,
        (err) => {

            if (err) {

                console.error(
                    "❌ Failed to enable foreign keys:",
                    err.message
                );

            } else {

                console.log(
                    "✅ Foreign keys enabled"
                );

            }

        }
    );


    // Better concurrent read/write behavior
    db.run(
        `PRAGMA journal_mode = WAL`,
        (err) => {

            if (err) {

                console.error(
                    "❌ Failed to enable WAL mode:",
                    err.message
                );

            } else {

                console.log(
                    "✅ SQLite WAL mode enabled"
                );

            }

        }
    );


    // Prevent SQLITE_BUSY errors during short locks
    db.run(
        `PRAGMA busy_timeout = 5000`,
        (err) => {

            if (err) {

                console.error(
                    "❌ Failed to set busy timeout:",
                    err.message
                );

            } else {

                console.log(
                    "✅ SQLite busy timeout configured"
                );

            }

        }
    );


    // Balanced durability/performance
    db.run(
        `PRAGMA synchronous = NORMAL`,
        (err) => {

            if (err) {

                console.error(
                    "❌ Failed to configure synchronous mode:",
                    err.message
                );

            }

        }
    );

});


export default db;