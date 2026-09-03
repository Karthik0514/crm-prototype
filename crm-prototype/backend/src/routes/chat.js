import express from "express";
import axios from "axios";

import {
    createChatSession,
    getAllChatSessions,
    getChatMessages,
    saveMessage,
    deleteChatSession,
    updateCurrentLead,
    getCurrentLead,
    updatePendingAction,
    getPendingAction,
    clearPendingAction
} from "../services/chatService.js";

import db from "../database/db.js";

const router = express.Router();


// ======================================================
// AI CHAT
// React -> Node -> FastAPI -> Node CRM Tools
// ======================================================

router.post("/", async (req, res) => {

    console.log("\n======================================");
    console.log("Received chat request:");
    console.log(req.body);
    console.log("======================================");

    try {

        const sessionId = req.body.sessionId;


        if (!sessionId) {

            return res.status(400).json({
                error: "sessionId is required."
            });

        }


        // ----------------------------------------------
        // Get current lead
        // ----------------------------------------------

        const currentLead =
            await getCurrentLead(sessionId);


        console.log(
            "Current Lead:",
            currentLead
        );


        // ----------------------------------------------
        // Get pending action
        // ----------------------------------------------

        const pendingAction =
            await getPendingAction(sessionId);


        console.log(
            "Pending Action:",
            pendingAction
        );


        // ----------------------------------------------
        // Copy request
        // ----------------------------------------------

        const fastApiRequest = {
            ...req.body
        };


        // ----------------------------------------------
        // Conversation memory
        // ----------------------------------------------

        fastApiRequest.current_lead =
            currentLead;

        fastApiRequest.pending_action =
            pendingAction;


        // ==================================================
        // FORWARD JWT TO FASTAPI
        // ==================================================

        const authorization =
            req.headers.authorization;


        // ----------------------------------------------
        // Send to FastAPI
        // ----------------------------------------------

        const response = await axios.post(

            "http://127.0.0.1:8000/chat",

            fastApiRequest,

            {

                headers: {

                    Authorization:
                        authorization || ""

                }

            }

        );


        console.log(
            "\nFastAPI Response:"
        );

        console.log(
            response.data
        );


        // ==================================================
        // SAVE LEAD MEMORY
        // ==================================================

        if (response.data.lead_name) {

            await updateCurrentLead(

                sessionId,

                response.data.lead_name

            );


            console.log(

                "✅ Current lead updated:",

                response.data.lead_name

            );

        }


        // ==================================================
        // SAVE PENDING ACTION
        // ==================================================

        if (response.data.pending_action) {

            await updatePendingAction(

                sessionId,

                response.data.pending_action

            );


            console.log(

                "✅ Pending action:",

                response.data.pending_action

            );

        }


        // ==================================================
        // CLEAR PENDING ACTION
        // ==================================================

        if (

            !response.data.pending_action &&

            pendingAction

        ) {

            await clearPendingAction(
                sessionId
            );


            console.log(
                "✅ Pending action cleared"
            );

        }


        // ----------------------------------------------
        // Return to React
        // ----------------------------------------------

        res.json(
            response.data
        );

    }

    catch (err) {

        console.error(
            "\n❌ Chat Error:"
        );


        console.error(

            err.response?.data ||

            err.message

        );


        // Preserve authentication errors

        if (
            err.response?.status === 401
        ) {

            return res.status(401).json({

                error:
                    "Authentication failed."

            });

        }


        res.status(500).json({

            error:
                "AI chat failed."

        });

    }

});


// ======================================================
// CREATE NEW CHAT
// ======================================================

router.post("/new", async (req, res) => {

    try {

        const id =
            await createChatSession();


        res.json({

            id

        });

    }

    catch (err) {

        console.error(
            "Create Chat Error:",
            err
        );


        res.status(500).json({

            error:
                err.message

        });

    }

});


// ======================================================
// GET ALL CHAT SESSIONS
// ======================================================

router.get("/sessions", async (req, res) => {

    try {

        const chats =
            await getAllChatSessions();


        res.json(chats);

    }

    catch (err) {

        console.error(
            "Get Sessions Error:",
            err
        );


        res.status(500).json({

            error:
                err.message

        });

    }

});


// ======================================================
// GET CHAT MESSAGES
// ======================================================

router.get(
    "/session/:id",
    async (req, res) => {

        try {

            const messages =
                await getChatMessages(

                    req.params.id

                );


            res.json(messages);

        }

        catch (err) {

            console.error(
                "Get Messages Error:",
                err
            );


            res.status(500).json({

                error:
                    err.message

            });

        }

    }
);


// ======================================================
// SAVE MESSAGE
// ======================================================

router.post(
    "/message",
    async (req, res) => {

        try {

            const {

                sessionId,
                sender,
                message

            } = req.body;


            if (!sessionId) {

                return res.status(400).json({

                    error:
                        "sessionId is required."

                });

            }


            await saveMessage(

                sessionId,

                sender,

                message

            );


            res.json({

                success: true

            });

        }

        catch (err) {

            console.error(
                "Save Message Error:",
                err
            );


            res.status(500).json({

                error:
                    err.message

            });

        }

    }
);


// ======================================================
// DELETE CHAT
// ======================================================

router.delete(
    "/session/:id",
    async (req, res) => {

        try {

            await deleteChatSession(

                req.params.id

            );


            res.json({

                success: true

            });

        }

        catch (err) {

            console.error(
                "Delete Chat Error:",
                err
            );


            res.status(500).json({

                error:
                    err.message

            });

        }

    }
);


// ======================================================
// GENERATE CHAT TITLE
// ======================================================

router.post(
    "/title",
    async (req, res) => {

        try {

            const {

                id,
                message

            } = req.body;


            if (!id || !message) {

                return res.status(400).json({

                    success: false,

                    error:
                        "id and message are required."

                });

            }


            const ai =
                await axios.post(

                    "http://127.0.0.1:8000/chat-title",

                    {
                        message
                    }

                );


            const title =
                ai.data.title;


            await new Promise(
                (resolve, reject) => {

                    db.run(

                        `
                        UPDATE chat_sessions
                        SET title=?
                        WHERE id=?
                        `,

                        [
                            title,
                            id
                        ],

                        function (err) {

                            if (err) {

                                reject(err);

                            }

                            else {

                                resolve();

                            }

                        }

                    );

                }
            );


            res.json({

                success: true,

                title

            });

        }

        catch (err) {

            console.error(
                "Chat Title Error:",
                err
            );


            res.status(500).json({

                success: false,

                error:
                    err.message

            });

        }

    }
);


export default router;