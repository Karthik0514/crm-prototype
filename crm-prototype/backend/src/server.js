import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";
import aiTools from "./routes/aiTools.js";
import "./database/initDB.js";

import leadRoutes from "./routes/leads.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("CRM Backend Running 🚀");
});

app.use("/api/leads", leadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tools", aiTools);
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});