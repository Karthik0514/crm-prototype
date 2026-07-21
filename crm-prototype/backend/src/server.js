import express from "express";
import cors from "cors";

import "./database/initDB.js";

import leadRoutes from "./routes/leads.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/chat", chatRoutes);

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});