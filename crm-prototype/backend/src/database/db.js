import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./crm.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite database");
    }
});

export default db;