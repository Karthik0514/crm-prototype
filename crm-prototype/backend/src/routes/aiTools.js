import express from "express";

import { searchLead, getAllLeads } from "../services/leadService.js";
import {
    updateLead,
    deleteLead,
    convertLead
} from "../services/leadActions.js";

const router = express.Router();


// SEARCH

router.get("/search/:query", async (req, res) => {

    try {

        const leads = await searchLead(req.params.query);

        res.json(leads);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});


// UPDATE

router.put("/update/:id", async (req, res) => {

    try {

        await updateLead(

            req.params.id,

            req.body

        );

        res.json({
            success: true
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});


// DELETE

router.delete("/delete/:id", async (req, res) => {

    try {

        await deleteLead(req.params.id);

        res.json({
            success: true
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});


// CONVERT

router.put("/convert/:id", async (req, res) => {

    try {

        await convertLead(req.params.id);

        res.json({
            success: true
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

router.get("/all", async (req, res) => {

    try {

        const leads = await getAllLeads();

        res.json(leads);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

export default router;