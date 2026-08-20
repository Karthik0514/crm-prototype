import { useState, useEffect } from "react";
import api from "../services/api";

import ChatSidebar from "../components/ai/chat_sidebar";
import ChatWindow from "../components/ai/chat_window";
import ChatInput from "../components/ai/chat_input";
import AITools from "../components/ai/ai_tools";


export default function AIAssistant() {

    const [messages, setMessages] = useState([]);

    const [sessions, setSessions] = useState([]);

    const [currentSession, setCurrentSession] = useState(null);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);


    // ------------------------------------
    // Quick Prompt
    // ------------------------------------

    const quickPrompt = (text) => {

        setInput(text);

    };


    // ------------------------------------
    // Load Chat Sessions
    // ------------------------------------

    const loadSessions = async () => {

        try {

            const response = await api.get("/chat/sessions");

            setSessions(response.data);

        }

        catch (err) {

            console.error(err);

        }

    };


    // ------------------------------------
    // Create New Chat
    // ------------------------------------

    const createChat = async () => {

        try {

            const response = await api.post("/chat/new");

            await loadSessions();

            setCurrentSession(response.data.id);

            setMessages([]);

        }

        catch (err) {

            console.error(err);

        }

    };


    // ------------------------------------
    // Delete Chat
    // ------------------------------------

    const deleteChat = async (sessionId) => {

        try {

            await api.delete(

                `/chat/session/${sessionId}`

            );


            // Remove the chat immediately
            // from the sidebar

            setSessions(previousSessions =>

                previousSessions.filter(

                    session => session.id !== sessionId

                )

            );


            // If the deleted chat is the
            // currently open chat

            if (currentSession === sessionId) {

                setCurrentSession(null);

                setMessages([]);

                setInput("");

            }


            console.log(

                "Chat deleted successfully:",

                sessionId

            );

        }

        catch (err) {

            console.error(

                "Failed to delete chat:",

                err

            );

            alert(

                "Could not delete the chat. Please try again."

            );

        }

    };


    // ------------------------------------
    // Load Existing Chat
    // ------------------------------------

    const loadChat = async (id) => {

        try {

            setLoading(true);

            setCurrentSession(id);

            const response = await api.get(

                `/chat/session/${id}`

            );


            const formatted = response.data.map(msg => ({

                sender: msg.sender,

                text: msg.message

            }));


            setMessages(formatted);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };


    // ------------------------------------
    // Send Message
    // ------------------------------------

    const sendMessage = async () => {

        if (!input.trim()) return;

        const currentMessage = input;

        let sessionId = currentSession;


        try {

            // --------------------------------
            // Create chat automatically
            // if one doesn't exist
            // --------------------------------

            if (!sessionId) {

                const newChat = await api.post(

                    "/chat/new"

                );


                sessionId = newChat.data.id;

                setCurrentSession(sessionId);

                await loadSessions();


                // Generate chat title

                await api.post(

                    "/chat/title",

                    {

                        id: sessionId,

                        message: currentMessage

                    }

                );


                await loadSessions();

            }


            // --------------------------------
            // Build conversation history
            // --------------------------------

            const history = [

                ...messages.map(msg => ({

                    role:

                        msg.sender === "user"

                            ? "user"

                            : "assistant",

                    content: msg.text

                })),

                {

                    role: "user",

                    content: currentMessage

                }

            ];


            // --------------------------------
            // Show user message immediately
            // --------------------------------

            setMessages(prev => [

                ...prev,

                {

                    sender: "user",

                    text: currentMessage

                }

            ]);


            setInput("");


            // --------------------------------
            // Save user message
            // --------------------------------

            await api.post(

                "/chat/message",

                {

                    sessionId,

                    sender: "user",

                    message: currentMessage

                }

            );


            // --------------------------------
            // Send message to AI
            // --------------------------------

            const response = await api.post(

                "/chat",

                {

                    sessionId,

                    messages: history

                }

            );


            const aiResponse = response.data.response;


            // --------------------------------
            // Update title if needed
            // --------------------------------

            const currentChat = sessions.find(

                s => s.id === sessionId

            );


            if (

                currentChat &&

                currentChat.title === "New Chat"

            ) {

                await api.post(

                    "/chat/title",

                    {

                        id: sessionId,

                        message: currentMessage

                    }

                );


                await loadSessions();

            }


            // --------------------------------
            // Show AI response
            // --------------------------------

            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text: aiResponse

                }

            ]);


            // --------------------------------
            // Save AI response
            // --------------------------------

            await api.post(

                "/chat/message",

                {

                    sessionId,

                    sender: "ai",

                    message: aiResponse

                }

            );

        }

        catch (err) {

            console.error(err);


            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text: "Sorry, I couldn't contact the AI service."

                }

            ]);

        }

    };


    // ------------------------------------
    // Initial Load
    // ------------------------------------

    useEffect(() => {

        loadSessions();

    }, []);


    return (

        <div>

            <h1 className="text-3xl font-bold">

                AI Sales Assistant

            </h1>


            <p className="text-gray-500 mt-2">

                AI-powered CRM assistant with persistent conversations.

            </p>


            <div className="grid grid-cols-12 gap-6 mt-8 h-[750px]">


                {/* ===================================== */}
                {/* LEFT SIDEBAR */}
                {/* ===================================== */}

                <div className="col-span-3">

                    <ChatSidebar

                        sessions={sessions}

                        currentSession={currentSession}

                        createChat={createChat}

                        setCurrentSession={loadChat}

                        deleteChat={deleteChat}

                    />

                </div>


                {/* ===================================== */}
                {/* CHAT */}
                {/* ===================================== */}

                <div className="col-span-6 bg-white rounded-2xl shadow-sm border flex flex-col">

                    {

                        loading ? (

                            <div className="flex-1 flex items-center justify-center">

                                <div className="text-gray-500">

                                    Loading conversation...

                                </div>

                            </div>

                        ) : (

                            <ChatWindow

                                messages={messages}

                            />

                        )

                    }


                    <ChatInput

                        input={input}

                        setInput={setInput}

                        sendMessage={sendMessage}

                    />

                </div>


                {/* ===================================== */}
                {/* AI TOOLS */}
                {/* ===================================== */}

                <div className="col-span-3">

                    <AITools

                        quickPrompt={quickPrompt}

                    />


                    <div className="bg-white rounded-2xl border shadow-sm p-5 mt-6">

                        <h2 className="font-semibold mb-4">

                            Suggested Prompts

                        </h2>


                        <div className="space-y-3 text-sm">


                            <button

                                onClick={() =>
                                    quickPrompt(
                                        "Summarize today's leads."
                                    )
                                }

                                className="w-full text-left hover:text-blue-600"

                            >

                                • Summarize today's leads

                            </button>


                            <button

                                onClick={() =>
                                    quickPrompt(
                                        "Show all interested leads."
                                    )
                                }

                                className="w-full text-left hover:text-blue-600"

                            >

                                • Show interested leads

                            </button>


                            <button

                                onClick={() =>
                                    quickPrompt(
                                        "Generate follow-up email."
                                    )
                                }

                                className="w-full text-left hover:text-blue-600"

                            >

                                • Generate follow-up email

                            </button>


                            <button

                                onClick={() =>
                                    quickPrompt(
                                        "Generate WhatsApp follow-up."
                                    )
                                }

                                className="w-full text-left hover:text-blue-600"

                            >

                                • WhatsApp follow-up

                            </button>


                            <button

                                onClick={() =>
                                    quickPrompt(
                                        "Create sales call script."
                                    )
                                }

                                className="w-full text-left hover:text-blue-600"

                            >

                                • Sales call script

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}