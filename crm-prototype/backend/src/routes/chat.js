import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {

    console.log("Received chat request:", req.body);

    try {

        const response = await axios.post(
            "http://127.0.0.1:8000/chat",
            req.body
        );

        console.log("FastAPI Response:", response.data);

        res.json(response.data);

    } catch (err) {

        console.error("Chat Error:");

        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: "AI chat failed."
        });

    }

});

export default router;