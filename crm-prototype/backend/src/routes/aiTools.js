import express from "express";

import {
    searchLead,
    getAllLeads
} from "../services/leadService.js";

import {
    updateLead,
    deleteLead,
    convertLead
} from "../services/leadActions.js";

const router = express.Router();


// ============================================================
// NORMALIZE CRM STATUS
// ============================================================

function normalizeStatus(status) {

    if (!status) {
        return status;
    }

    const normalized = String(status)
        .trim()
        .toLowerCase();

    const statuses = {
        "new": "New",
        "interested": "Interested",
        "follow up": "Follow Up",
        "follow-up": "Follow Up",
        "followup": "Follow Up",
        "converted": "Converted"
    };

    return statuses[normalized] || status;
}


// ============================================================
// SEARCH
// ============================================================

router.get("/search/:query", async (req, res) => {

    try {

        const query = req.params.query;

        console.log(
            "🔎 AI TOOL SEARCH:",
            query
        );

        const leads =
            await searchLead(query);

        console.log(
            "🔎 AI TOOL SEARCH RESULTS:",
            leads
        );

        return res.json(leads);

    } catch (err) {

        console.error(
            "❌ AI TOOL SEARCH ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Failed to search leads"
        });
    }

});


// ============================================================
// UPDATE
// ============================================================

router.put("/update/:id", async (req, res) => {

    try {

        const leadId =
            req.params.id;

        const leadData = {
            ...req.body
        };


        // Normalize status
        if (
            leadData.status !== undefined
        ) {

            leadData.status =
                normalizeStatus(
                    leadData.status
                );

        }


        console.log(
            "✏️ AI TOOL UPDATE:",
            leadId,
            leadData
        );


        await updateLead(
            leadId,
            leadData
        );


        console.log(
            "✅ AI TOOL UPDATE SUCCESS:",
            leadId
        );


        return res.json({

            success: true,

            message:
                "Lead updated successfully",

            lead_id:
                Number(leadId),

            status:
                leadData.status

        });

    } catch (err) {

        console.error(
            "❌ AI TOOL UPDATE ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                err?.message ||
                "Failed to update lead"

        });

    }

});


// ============================================================
// DELETE
// ============================================================

router.delete("/delete/:id", async (req, res) => {

    try {

        const leadId =
            req.params.id;

        console.log(
            "🗑️ AI TOOL DELETE:",
            leadId
        );


        await deleteLead(
            leadId
        );


        console.log(
            "✅ AI TOOL DELETE SUCCESS:",
            leadId
        );


        return res.json({

            success: true,

            message:
                "Lead deleted successfully",

            lead_id:
                Number(leadId)

        });

    } catch (err) {

        console.error(
            "❌ AI TOOL DELETE ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                err?.message ||
                "Failed to delete lead"

        });

    }

});


// ============================================================
// CONVERT
// ============================================================

router.put("/convert/:id", async (req, res) => {

    try {

        const leadId =
            req.params.id;

        console.log(
            "🎉 AI TOOL CONVERT:",
            leadId
        );


        await convertLead(
            leadId
        );


        console.log(
            "✅ AI TOOL CONVERT SUCCESS:",
            leadId
        );


        return res.json({

            success: true,

            message:
                "Lead converted successfully",

            lead_id:
                Number(leadId)

        });

    } catch (err) {

        console.error(
            "❌ AI TOOL CONVERT ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                err?.message ||
                "Failed to convert lead"

        });

    }

});


// ============================================================
// GET ALL LEADS
// ============================================================

router.get("/all", async (req, res) => {

    try {

        const leads =
            await getAllLeads();

        return res.json(
            leads
        );

    } catch (err) {

        console.error(
            "❌ AI TOOL GET ALL ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                err?.message ||
                "Failed to get leads"

        });

    }

});


export default router;