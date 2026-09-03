import db from "./db.js";

console.log("\n==========================================");
console.log("🚀 INITIALIZING CRM DATABASE");
console.log("==========================================\n");


// ============================================================
// HELPERS
// ============================================================

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes
            });
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row);
        });
    });
}

async function tableExists(tableName) {
    const row = await get(
        `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name = ?
        `,
        [tableName]
    );

    return !!row;
}

async function columnExists(tableName, columnName) {
    const rows = await all(`PRAGMA table_info(${tableName})`);

    return rows.some(row => row.name === columnName);
}

async function addColumnIfMissing(tableName, columnName, definition) {
    const exists = await columnExists(tableName, columnName);

    if (!exists) {
        console.log(`➕ Adding ${tableName}.${columnName}`);

        await run(
            `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`
        );
    }
}


// ============================================================
// MAIN INITIALIZATION
// ============================================================

(async () => {

    try {

        // ========================================================
        // REMOVE OLD BROKEN TRIGGERS
        // ========================================================

        console.log("\n========== CLEANING OLD TRIGGERS ==========\n");

        const oldTriggers = [
            "leads_updated_at",
            "users_updated_at",
            "employees_updated_at",
            "sales_updated_at",
            "campaigns_updated_at",
            "chat_sessions_updated_at"
        ];

        for (const trigger of oldTriggers) {
            await run(`DROP TRIGGER IF EXISTS ${trigger}`);
            console.log(`🧹 Old trigger checked: ${trigger}`);
        }


        // ========================================================
        // LEADS
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                name TEXT NOT NULL,

                company TEXT,

                phone TEXT,

                email TEXT,

                source TEXT,

                status TEXT NOT NULL DEFAULT 'New',

                notes TEXT,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Leads table ready");


        // ========================================================
        // USERS
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                name TEXT NOT NULL,

                email TEXT NOT NULL UNIQUE,

                phone TEXT,

                password TEXT NOT NULL,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Users table ready");


        // ========================================================
        // EMPLOYEES
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                name TEXT NOT NULL,

                email TEXT UNIQUE,

                phone TEXT,

                role TEXT,

                department TEXT,

                status TEXT NOT NULL DEFAULT 'Active',

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Employees table ready");


        // ========================================================
        // CHAT SESSIONS
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                title TEXT,

                current_lead TEXT,

                pending_action TEXT,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Chat Sessions table ready");


        // ========================================================
        // CHAT MESSAGES
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                session_id INTEGER NOT NULL,

                sender TEXT NOT NULL,

                message TEXT NOT NULL,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (session_id)
                    REFERENCES chat_sessions(id)
                    ON DELETE CASCADE
            )
        `);

        console.log("✅ Chat Messages table ready");


        // ========================================================
        // CAMPAIGNS
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                name TEXT NOT NULL,

                channel TEXT,

                audience TEXT,

                sent INTEGER NOT NULL DEFAULT 0,

                total INTEGER NOT NULL DEFAULT 0,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                CHECK (sent >= 0),

                CHECK (total >= 0),

                CHECK (sent <= total)
            )
        `);

        console.log("✅ Campaigns table ready");


        // ========================================================
        // SALES
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                lead_id INTEGER NOT NULL,

                customer_name TEXT NOT NULL,

                company TEXT,

                source TEXT,

                sale_amount REAL NOT NULL DEFAULT 0,

                amount_paid REAL NOT NULL DEFAULT 0,

                payment_status TEXT NOT NULL DEFAULT 'Pending',

                payment_due_date TEXT,

                payment_notes TEXT,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (lead_id)
                    REFERENCES leads(id)
                    ON DELETE RESTRICT,

                CHECK (sale_amount >= 0),

                CHECK (amount_paid >= 0),

                CHECK (amount_paid <= sale_amount),

                CHECK (
                    payment_status IN (
                        'Pending',
                        'Partial',
                        'Paid',
                        'Overdue'
                    )
                )
            )
        `);

        console.log("✅ Sales table ready");


        // ========================================================
        // NOTIFICATIONS
        // ========================================================

        await run(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                type TEXT,

                title TEXT NOT NULL,

                message TEXT,

                related_id INTEGER,

                is_read INTEGER NOT NULL DEFAULT 0,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                CHECK (is_read IN (0, 1))
            )
        `);

        console.log("✅ Notifications table ready");


        // ========================================================
        // SAFE MIGRATIONS
        // ========================================================

        console.log("\n========== SAFE MIGRATIONS ==========\n");


        // --------------------------------------------------------
        // LEADS
        // --------------------------------------------------------

        if (await tableExists("leads")) {

            await addColumnIfMissing(
                "leads",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "leads",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // USERS
        // --------------------------------------------------------

        if (await tableExists("users")) {

            await addColumnIfMissing(
                "users",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "users",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // EMPLOYEES
        // --------------------------------------------------------

        if (await tableExists("employees")) {

            await addColumnIfMissing(
                "employees",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "employees",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // CHAT SESSIONS
        // --------------------------------------------------------

        if (await tableExists("chat_sessions")) {

            await addColumnIfMissing(
                "chat_sessions",
                "current_lead",
                "TEXT"
            );

            await addColumnIfMissing(
                "chat_sessions",
                "pending_action",
                "TEXT"
            );

            await addColumnIfMissing(
                "chat_sessions",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "chat_sessions",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // CHAT MESSAGES
        // --------------------------------------------------------

        if (await tableExists("chat_messages")) {

            await addColumnIfMissing(
                "chat_messages",
                "created_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // CAMPAIGNS
        // --------------------------------------------------------

        if (await tableExists("campaigns")) {

            await addColumnIfMissing(
                "campaigns",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "campaigns",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // SALES
        // --------------------------------------------------------

        if (await tableExists("sales")) {

            await addColumnIfMissing(
                "sales",
                "created_at",
                "DATETIME"
            );

            await addColumnIfMissing(
                "sales",
                "updated_at",
                "DATETIME"
            );
        }


        // --------------------------------------------------------
        // NOTIFICATIONS
        // --------------------------------------------------------

        if (await tableExists("notifications")) {

            await addColumnIfMissing(
                "notifications",
                "created_at",
                "DATETIME"
            );
        }


        // ========================================================
        // BACKFILL TIMESTAMPS
        // ========================================================

        console.log("\n========== BACKFILLING TIMESTAMPS ==========\n");


        if (
            await tableExists("leads") &&
            await columnExists("leads", "created_at") &&
            await columnExists("leads", "updated_at")
        ) {
            await run(`
                UPDATE leads
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("users") &&
            await columnExists("users", "created_at") &&
            await columnExists("users", "updated_at")
        ) {
            await run(`
                UPDATE users
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("employees") &&
            await columnExists("employees", "created_at") &&
            await columnExists("employees", "updated_at")
        ) {
            await run(`
                UPDATE employees
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("chat_sessions") &&
            await columnExists("chat_sessions", "created_at") &&
            await columnExists("chat_sessions", "updated_at")
        ) {
            await run(`
                UPDATE chat_sessions
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("chat_messages") &&
            await columnExists("chat_messages", "created_at")
        ) {
            await run(`
                UPDATE chat_messages
                SET created_at = COALESCE(
                    created_at,
                    CURRENT_TIMESTAMP
                )
            `);
        }


        if (
            await tableExists("campaigns") &&
            await columnExists("campaigns", "created_at") &&
            await columnExists("campaigns", "updated_at")
        ) {
            await run(`
                UPDATE campaigns
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("sales") &&
            await columnExists("sales", "created_at") &&
            await columnExists("sales", "updated_at")
        ) {
            await run(`
                UPDATE sales
                SET
                    created_at = COALESCE(
                        created_at,
                        CURRENT_TIMESTAMP
                    ),
                    updated_at = COALESCE(
                        updated_at,
                        CURRENT_TIMESTAMP
                    )
            `);
        }


        if (
            await tableExists("notifications") &&
            await columnExists("notifications", "created_at")
        ) {
            await run(`
                UPDATE notifications
                SET created_at = COALESCE(
                    created_at,
                    CURRENT_TIMESTAMP
                )
            `);
        }


        // ========================================================
        // NORMALIZE EXISTING DATA
        // ========================================================

        console.log("\n========== NORMALIZING DATA ==========\n");


        if (await tableExists("users")) {

            if (await columnExists("users", "email")) {
                await run(`
                    UPDATE users
                    SET email = LOWER(TRIM(email))
                    WHERE email IS NOT NULL
                `);
            }

            if (await columnExists("users", "name")) {
                await run(`
                    UPDATE users
                    SET name = TRIM(name)
                    WHERE name IS NOT NULL
                `);
            }
        }


        if (await tableExists("employees")) {

            if (await columnExists("employees", "email")) {
                await run(`
                    UPDATE employees
                    SET email = LOWER(TRIM(email))
                    WHERE email IS NOT NULL
                `);
            }

            if (await columnExists("employees", "name")) {
                await run(`
                    UPDATE employees
                    SET name = TRIM(name)
                    WHERE name IS NOT NULL
                `);
            }
        }


        if (await tableExists("leads")) {

            if (await columnExists("leads", "name")) {
                await run(`
                    UPDATE leads
                    SET name = TRIM(name)
                    WHERE name IS NOT NULL
                `);
            }

            if (await columnExists("leads", "email")) {
                await run(`
                    UPDATE leads
                    SET email = LOWER(TRIM(email))
                    WHERE email IS NOT NULL
                `);
            }

            if (await columnExists("leads", "phone")) {
                await run(`
                    UPDATE leads
                    SET phone = TRIM(phone)
                    WHERE phone IS NOT NULL
                `);
            }
        }


        // ========================================================
        // INDEXES
        // ========================================================

        console.log("\n========== CREATING INDEXES ==========\n");


        await run(`
            CREATE INDEX IF NOT EXISTS idx_leads_name
            ON leads(name)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_leads_company
            ON leads(company)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_leads_status
            ON leads(status)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_leads_email
            ON leads(email)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_chat_messages_session
            ON chat_messages(session_id)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_chat_messages_created
            ON chat_messages(created_at)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_sales_lead
            ON sales(lead_id)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_sales_payment_status
            ON sales(payment_status)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_sales_due_date
            ON sales(payment_due_date)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_notifications_read
            ON notifications(is_read)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_notifications_created
            ON notifications(created_at)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_employees_status
            ON employees(status)
        `);


        // ========================================================
        // EMAIL UNIQUENESS
        // ========================================================

        console.log("\n========== EMAIL UNIQUENESS ==========\n");


        await run(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_normalized
            ON users(email COLLATE NOCASE)
        `);


        await run(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_email_normalized
            ON employees(email COLLATE NOCASE)
            WHERE email IS NOT NULL
        `);


        // ========================================================
        // SALES DUPLICATE AUDIT
        // ========================================================

        console.log("\n========== SALES DUPLICATE AUDIT ==========\n");

        const duplicateSales = await all(`
            SELECT
                lead_id,
                COUNT(*) AS count
            FROM sales
            GROUP BY lead_id
            HAVING COUNT(*) > 1
        `);

        if (duplicateSales.length > 0) {

            console.warn(
                `⚠️ Found ${duplicateSales.length} lead(s) with multiple sales.`
            );

            duplicateSales.forEach(row => {
                console.warn(
                    `   lead_id=${row.lead_id}, sales=${row.count}`
                );
            });

        } else {

            console.log("✅ No duplicate sales found");
        }


        // ========================================================
        // SALES ORPHAN AUDIT
        // ========================================================

        console.log("\n========== SALES ORPHAN AUDIT ==========\n");

        const orphanSales = await all(`
            SELECT sales.id
            FROM sales
            LEFT JOIN leads
                ON leads.id = sales.lead_id
            WHERE leads.id IS NULL
        `);

        if (orphanSales.length > 0) {

            console.warn(
                `⚠️ Found ${orphanSales.length} orphan sale(s).`
            );

        } else {

            console.log("✅ No orphan sales found");
        }


        // ========================================================
        // CHAT ORPHAN AUDIT
        // ========================================================

        console.log("\n========== CHAT ORPHAN AUDIT ==========\n");

        const orphanMessages = await all(`
            SELECT chat_messages.id
            FROM chat_messages
            LEFT JOIN chat_sessions
                ON chat_sessions.id = chat_messages.session_id
            WHERE chat_sessions.id IS NULL
        `);

        if (orphanMessages.length > 0) {

            console.warn(
                `⚠️ Found ${orphanMessages.length} orphan chat message(s).`
            );

        } else {

            console.log("✅ No orphan chat messages found");
        }


        // ========================================================
        // VALIDATION RULES
        // ========================================================

        console.log("\n========== VALIDATION RULES ==========\n");


        // --------------------------------------------------------
        // LEAD STATUS
        // --------------------------------------------------------

        await run(`
    DROP TRIGGER IF EXISTS validate_lead_status
`);

        await run(`
    CREATE TRIGGER validate_lead_status
    BEFORE INSERT ON leads
    WHEN NEW.status NOT IN (
        'New',
        'Interested',
        'Follow Up',
        'Converted'
    )
    BEGIN
        SELECT RAISE(
            ABORT,
            'Invalid lead status'
        );
    END
`);


        await run(`
    DROP TRIGGER IF EXISTS validate_lead_status_update
`);

        await run(`
    CREATE TRIGGER validate_lead_status_update
    BEFORE UPDATE OF status ON leads
    WHEN NEW.status NOT IN (
        'New',
        'Interested',
        'Follow Up',
        'Converted'
    )
    BEGIN
        SELECT RAISE(
            ABORT,
            'Invalid lead status'
        );
    END
`);

        // --------------------------------------------------------
        // EMPLOYEE STATUS
        // --------------------------------------------------------

        await run(`
            DROP TRIGGER IF EXISTS validate_employee_status
        `);

        await run(`
            CREATE TRIGGER validate_employee_status
            BEFORE INSERT ON employees
            WHEN NEW.status NOT IN (
                'Active',
                'Inactive',
                'On Leave'
            )
            BEGIN
                SELECT RAISE(
                    ABORT,
                    'Invalid employee status'
                );
            END
        `);


        await run(`
            DROP TRIGGER IF EXISTS validate_employee_status_update
        `);

        await run(`
            CREATE TRIGGER validate_employee_status_update
            BEFORE UPDATE OF status ON employees
            WHEN NEW.status NOT IN (
                'Active',
                'Inactive',
                'On Leave'
            )
            BEGIN
                SELECT RAISE(
                    ABORT,
                    'Invalid employee status'
                );
            END
        `);


        // --------------------------------------------------------
        // SALES PAYMENT VALIDATION
        // --------------------------------------------------------

        await run(`
            DROP TRIGGER IF EXISTS validate_sale_payment
        `);

        await run(`
            CREATE TRIGGER validate_sale_payment
            BEFORE INSERT ON sales
            WHEN
                NEW.sale_amount < 0
                OR NEW.amount_paid < 0
                OR NEW.amount_paid > NEW.sale_amount
                OR NEW.payment_status NOT IN (
                    'Pending',
                    'Partial',
                    'Paid',
                    'Overdue'
                )
            BEGIN
                SELECT RAISE(
                    ABORT,
                    'Invalid sale payment data'
                );
            END
        `);


        await run(`
            DROP TRIGGER IF EXISTS validate_sale_payment_update
        `);

        await run(`
            CREATE TRIGGER validate_sale_payment_update
            BEFORE UPDATE OF
                sale_amount,
                amount_paid,
                payment_status
            ON sales
            WHEN
                NEW.sale_amount < 0
                OR NEW.amount_paid < 0
                OR NEW.amount_paid > NEW.sale_amount
                OR NEW.payment_status NOT IN (
                    'Pending',
                    'Partial',
                    'Paid',
                    'Overdue'
                )
            BEGIN
                SELECT RAISE(
                    ABORT,
                    'Invalid sale payment data'
                );
            END
        `);


        // --------------------------------------------------------
        // PREVENT FUTURE DUPLICATE SALES
        // --------------------------------------------------------

        await run(`
            DROP TRIGGER IF EXISTS prevent_duplicate_sale
        `);

        await run(`
            CREATE TRIGGER prevent_duplicate_sale
            BEFORE INSERT ON sales
            WHEN EXISTS (
                SELECT 1
                FROM sales
                WHERE lead_id = NEW.lead_id
            )
            BEGIN
                SELECT RAISE(
                    ABORT,
                    'A sale already exists for this lead'
                );
            END
        `);


        // ========================================================
        // FINAL STATUS
        // ========================================================

        console.log("\n==========================================");
        console.log("✅ CRM DATABASE INITIALIZATION COMPLETE");
        console.log("==========================================\n");

    } catch (error) {

        console.error("\n❌ DATABASE INITIALIZATION FAILED");
        console.error(error);

        process.exit(1);
    }

})();