import { useState } from "react";
import api from "../services/api";
export default function AIAssistant() {

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! I'm your AI Sales Assistant. I can analyze leads, generate emails, create WhatsApp messages, prepare call scripts, and answer CRM-related questions."
        }
    ]);

    const [input, setInput] = useState("");

    const sendMessage = async () => {

        if (!input.trim()) return;

        const currentMessage = input;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: currentMessage
            }
        ]);

        setInput("");

        try {

            const response = await api.post("/chat", {
                message: currentMessage
            });

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data.response
                }
            ]);

        } catch (err) {

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

    return (

        <div>

            <h1 className="text-3xl font-bold">
                AI Sales Assistant
            </h1>

            <p className="text-gray-500 mt-2">
                Ask questions, generate content and get AI-powered sales assistance.
            </p>

            <div className="grid grid-cols-4 gap-6 mt-8">

                {/* Chat */}

                <div className="col-span-3 bg-white rounded-2xl shadow-sm border flex flex-col h-[700px]">

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`flex ${message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`max-w-[70%] rounded-2xl px-5 py-3 ${message.sender === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >

                                    {message.text}

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="border-t p-5 flex gap-3">

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            placeholder="Ask AI anything..."
                            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-6 rounded-xl"
                        >

                            Send

                        </button>

                    </div>

                </div>

                {/* Sidebar */}

                <div className="bg-white rounded-2xl shadow-sm border p-5">

                    <h2 className="font-semibold text-lg mb-5">

                        AI Tools

                    </h2>

                    <div className="space-y-3">

                        <button
                            onClick={() => quickPrompt("Analyze this lead.")}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-xl p-3"
                        >
                            📊 Analyze Lead
                        </button>

                        <button
                            onClick={() => quickPrompt("Generate a professional sales email.")}
                            className="w-full bg-green-600 hover:bg-green-700 transition-all text-white rounded-xl p-3"
                        >
                            📧 Generate Email
                        </button>

                        <button
                            onClick={() => quickPrompt("Generate a WhatsApp follow-up message.")}
                            className="w-full bg-orange-500 hover:bg-orange-600 transition-all text-white rounded-xl p-3"
                        >
                            💬 WhatsApp Reply
                        </button>

                        <button
                            onClick={() => quickPrompt("Generate a sales call script.")}
                            className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white rounded-xl p-3"
                        >
                            📞 Call Script
                        </button>

                    </div>

                    <hr className="my-6" />

                    <h3 className="font-semibold mb-3">

                        Suggested Prompts

                    </h3>

                    <div className="space-y-2 text-sm">

                        <button
                            onClick={() => quickPrompt("Summarize today's leads.")}
                            className="w-full text-left hover:text-blue-600"
                        >
                            • Summarize today's leads
                        </button>

                        <button
                            onClick={() => quickPrompt("Give me sales tips for interested leads.")}
                            className="w-full text-left hover:text-blue-600"
                        >
                            • Sales tips
                        </button>

                        <button
                            onClick={() => quickPrompt("Write a follow-up email.")}
                            className="w-full text-left hover:text-blue-600"
                        >
                            • Write a follow-up email
                        </button>

                        <button
                            onClick={() => quickPrompt("Generate a quotation introduction.")}
                            className="w-full text-left hover:text-blue-600"
                        >
                            • Generate quotation introduction
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}