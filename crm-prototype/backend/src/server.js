import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.js";
import aiTools from "./routes/aiTools.js";
import leadRoutes from "./routes/leads.js";
import chatRoutes from "./routes/chat.js";
import salesRoutes from "./routes/sales.js";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notifications.js";
import "./database/initDB.js";


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

app.use("/api/sales", salesRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.listen(5000, () => {

    console.log(
        "🚀 Server running on http://localhost:5000"
    );

});