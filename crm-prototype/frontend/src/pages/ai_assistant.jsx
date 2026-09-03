import { useState, useEffect } from "react";

import {
    Bot,
    Sparkles,
} from "lucide-react";

import api from "../services/api";

import ChatSidebar from "../components/ai/chat_sidebar";
import ChatWindow from "../components/ai/chat_window";
import ChatInput from "../components/ai/chat_input";


export default function AIAssistant() {


    // =========================================================
    // STATE
    // =========================================================

    const [messages, setMessages] = useState([]);

    const [sessions, setSessions] = useState([]);

    const [currentSession, setCurrentSession] =
        useState(null);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================================================
    // QUICK PROMPT
    // =========================================================

    const quickPrompt = (text) => {

        setInput(text);

    };


    // =========================================================
    // LOAD CHAT SESSIONS
    // =========================================================

    const loadSessions = async () => {

        try {

            const response =
                await api.get("/chat/sessions");

            setSessions(response.data);

        } catch (err) {

            console.error(
                "Failed to load chat sessions:",
                err
            );

        }

    };


    // =========================================================
    // CREATE NEW CHAT
    // =========================================================

    const createChat = async () => {

        try {

            const response =
                await api.post("/chat/new");


            await loadSessions();


            setCurrentSession(
                response.data.id
            );


            setMessages([]);

            setInput("");

        } catch (err) {

            console.error(
                "Failed to create chat:",
                err
            );

        }

    };


    // =========================================================
    // DELETE CHAT
    // =========================================================

    const deleteChat = async (sessionId) => {

        try {

            await api.delete(
                `/chat/session/${sessionId}`
            );


            // ---------------------------------------------
            // Remove deleted chat immediately
            // ---------------------------------------------

            setSessions(
                previousSessions =>
                    previousSessions.filter(
                        session =>
                            session.id !== sessionId
                    )
            );


            // ---------------------------------------------
            // If deleted chat is currently open
            // ---------------------------------------------

            if (
                currentSession === sessionId
            ) {

                setCurrentSession(null);

                setMessages([]);

                setInput("");

            }


            console.log(
                "Chat deleted successfully:",
                sessionId
            );

        } catch (err) {

            console.error(
                "Failed to delete chat:",
                err
            );


            alert(
                "Could not delete the chat. Please try again."
            );

        }

    };


    // =========================================================
    // LOAD EXISTING CHAT
    // =========================================================

    const loadChat = async (id) => {

        try {

            setLoading(true);


            setCurrentSession(id);


            const response =
                await api.get(
                    `/chat/session/${id}`
                );


            const formatted =
                response.data.map(
                    msg => ({

                        sender:
                            msg.sender,

                        text:
                            msg.message,

                    })
                );


            setMessages(formatted);

        } catch (err) {

            console.error(
                "Failed to load conversation:",
                err
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = async () => {

        if (!input.trim()) return;


        const currentMessage =
            input;


        let sessionId =
            currentSession;


        try {


            // =================================================
            // CREATE CHAT AUTOMATICALLY
            // IF ONE DOESN'T EXIST
            // =================================================

            if (!sessionId) {

                const newChat =
                    await api.post(
                        "/chat/new"
                    );


                sessionId =
                    newChat.data.id;


                setCurrentSession(
                    sessionId
                );


                await loadSessions();


                // ---------------------------------------------
                // Generate chat title
                // ---------------------------------------------

                await api.post(
                    "/chat/title",
                    {
                        id: sessionId,
                        message: currentMessage,
                    }
                );


                await loadSessions();

            }


            // =================================================
            // BUILD CONVERSATION HISTORY
            // =================================================

            const history = [

                ...messages.map(
                    msg => ({

                        role:
                            msg.sender === "user"
                                ? "user"
                                : "assistant",

                        content:
                            msg.text,

                    })
                ),

                {
                    role: "user",
                    content: currentMessage,
                },

            ];


            // =================================================
            // SHOW USER MESSAGE IMMEDIATELY
            // =================================================

            setMessages(
                previousMessages => [

                    ...previousMessages,

                    {
                        sender: "user",
                        text: currentMessage,
                    },

                ]
            );


            setInput("");


            // =================================================
            // SAVE USER MESSAGE
            // =================================================

            await api.post(
                "/chat/message",
                {
                    sessionId,
                    sender: "user",
                    message: currentMessage,
                }
            );


            // =================================================
            // SEND MESSAGE TO AI
            // =================================================

            const response =
                await api.post(
                    "/chat",
                    {
                        sessionId,
                        messages: history,
                    }
                );


            const aiResponse =
                response.data.response;


            // =================================================
            // UPDATE CHAT TITLE
            // =================================================

            const currentChat =
                sessions.find(
                    session =>
                        session.id ===
                        sessionId
                );


            if (
                currentChat &&
                currentChat.title ===
                "New Chat"
            ) {

                await api.post(
                    "/chat/title",
                    {
                        id: sessionId,
                        message: currentMessage,
                    }
                );


                await loadSessions();

            }


            // =================================================
            // SHOW AI RESPONSE
            // =================================================

            setMessages(
                previousMessages => [

                    ...previousMessages,

                    {
                        sender: "ai",
                        text: aiResponse,
                    },

                ]
            );


            // =================================================
            // SAVE AI RESPONSE
            // =================================================

            await api.post(
                "/chat/message",
                {
                    sessionId,
                    sender: "ai",
                    message: aiResponse,
                }
            );

        } catch (err) {

            console.error(
                "AI request failed:",
                err
            );


            setMessages(
                previousMessages => [

                    ...previousMessages,

                    {
                        sender: "ai",
                        text:
                            "Sorry, I couldn't contact the AI service.",
                    },

                ]
            );

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadSessions();

    }, []);


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="
            min-h-full
            w-full
            bg-slate-50
            p-4
            sm:p-6
        ">

            <div className="
                mx-auto
                w-full
                max-w-[1600px]
            ">


                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div className="
                    mb-5
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">


                    {/* TITLE */}

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-2xl
                                bg-slate-950
                                text-white
                                shadow-sm
                            ">

                                <Bot
                                    size={19}
                                    strokeWidth={2}
                                />

                            </div>


                            <div>

                                <h1 className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                ">
                                    AI Assistant
                                </h1>


                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                ">
                                    Your intelligent CRM copilot
                                </p>

                            </div>

                        </div>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">
                            Analyze leads, manage follow-ups,
                            and accelerate sales with AI.
                        </p>

                    </div>


                    {/* AI STATUS */}

                    <div className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-100
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-600
                        shadow-sm
                    ">

                        <span className="
                            h-2
                            w-2
                            rounded-full
                            bg-emerald-500
                        " />

                        AI Online

                        <Sparkles
                            size={13}
                            className="text-blue-500"
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* AI WORKSPACE */}
                {/* ================================================= */}

                <div className="
                    grid
                    h-[calc(100vh-190px)]
                    min-h-[650px]
                    grid-cols-12
                    gap-4
                ">


                    {/* ============================================= */}
                    {/* LEFT — CHAT SIDEBAR */}
                    {/* ============================================= */}

                    <div className="
                        col-span-12
                        min-h-0
                        lg:col-span-3
                    ">

                        <ChatSidebar
                            sessions={sessions}
                            currentSession={currentSession}
                            createChat={createChat}
                            setCurrentSession={loadChat}
                            deleteChat={deleteChat}
                        />

                    </div>


                    {/* ============================================= */}
                    {/* CENTER — AI CHAT */}
                    {/* ============================================= */}

                    <div className="
                        col-span-12
                        flex
                        min-h-0
                        flex-col
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                        lg:col-span-9
                    ">


                        {/* ========================================= */}
                        {/* CHAT HEADER */}
                        {/* ========================================= */}

                        <div className="
                            flex
                            shrink-0
                            items-center
                            justify-between
                            border-b
                            border-slate-100
                            bg-white
                            px-5
                            py-4
                        ">


                            <div className="
                                flex
                                items-center
                                gap-3
                            ">


                                {/* AI ICON */}

                                <div className="
                                    relative
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-50
                                    text-blue-600
                                ">

                                    <Bot
                                        size={19}
                                        strokeWidth={2}
                                    />


                                    {/* ONLINE DOT */}

                                    <span className="
                                        absolute
                                        -bottom-0.5
                                        -right-0.5
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        border-2
                                        border-white
                                        bg-emerald-500
                                    " />

                                </div>


                                <div>

                                    <p className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    ">
                                        Konaseema AI
                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        text-slate-400
                                    ">
                                        Intelligent CRM assistant
                                    </p>

                                </div>

                            </div>


                            {/* MESSAGE COUNT */}

                            <div className="
                                rounded-xl
                                bg-slate-50
                                px-3
                                py-1.5
                                text-[10px]
                                font-semibold
                                text-slate-400
                            ">

                                {messages.length}{" "}
                                message
                                {messages.length === 1
                                    ? ""
                                    : "s"}

                            </div>

                        </div>


                        {/* ========================================= */}
                        {/* CHAT CONTENT */}
                        {/* ========================================= */}

                        {loading ? (

                            <div className="
                                flex
                                flex-1
                                items-center
                                justify-center
                                bg-slate-50
                            ">

                                <div className="
                                    text-center
                                ">


                                    <div className="
                                        mx-auto
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-blue-50
                                        text-blue-600
                                    ">

                                        <Sparkles
                                            size={22}
                                        />

                                    </div>


                                    <p className="
                                        mt-4
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                        Loading conversation
                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    ">
                                        Getting your CRM context ready...
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <ChatWindow
                                messages={messages}
                            />

                        )}


                        {/* ========================================= */}
                        {/* CHAT INPUT */}
                        {/* ========================================= */}

                        <ChatInput
                            input={input}
                            setInput={setInput}
                            sendMessage={sendMessage}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}