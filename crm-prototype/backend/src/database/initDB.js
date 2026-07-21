import db from "./db.js";

db.serialize(() => {
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
            console.error("Error creating leads table:", err.message);
        } else {
            console.log("✅ Leads table ready");
        }
    });
});