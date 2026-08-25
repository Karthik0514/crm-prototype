import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.js";
import aiTools from "./routes/aiTools.js";
import leadRoutes from "./routes/leads.js";
import chatRoutes from "./routes/chat.js";
import salesRoutes from "./routes/sales.js";
import notificationRoutes from "./routes/notifications.js";
import authRoutes from "./routes/auth.js";

import authenticateToken from "./middleware/auth.js";

import "dotenv/config";
import "./database/initDB.js";


const app = express();


app.use(cors());


app.use(express.json());


// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {

    res.send("CRM Backend Running 🚀");

});


// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);


// ==========================================
// PROTECTED CRM ROUTES
// ==========================================

app.use(

    "/api/leads",

    authenticateToken,

    leadRoutes

);


app.use(

    "/api/chat",

    authenticateToken,

    chatRoutes

);


app.use(

    "/api/ai",

    authenticateToken,

    aiRoutes

);


app.use(

    "/api/tools",

    authenticateToken,

    aiTools

);


app.use(

    "/api/sales",

    authenticateToken,

    salesRoutes

);


app.use(

    "/api/notifications",

    authenticateToken,

    notificationRoutes

);


// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {

    console.log(
        "🚀 Server running on http://localhost:5000"
    );

});