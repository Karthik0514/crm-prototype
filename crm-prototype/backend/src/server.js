import express from "express";
import cors from "cors";

// Initialize database (creates tables)
import "./database/initDB.js";

// Routes
import leadRoutes from "./routes/leads.js";
//import employeeRoutes from "./routes/employees.js";
//import campaignRoutes from "./routes/campaigns.js";
//import salesRoutes from "./routes/sales.js";
//import tenderRoutes from "./routes/tenders.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("CRM Backend Running 🚀");
});

app.use("/api/leads", leadRoutes);
//app.use("/api/employees", employeeRoutes);
//app.use("/api/campaigns", campaignRoutes);
//app.use("/api/sales", salesRoutes);
//app.use("/api/tenders", tenderRoutes);

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});