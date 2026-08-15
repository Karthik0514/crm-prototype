export default function ChatWindow({

    messages

}) {

    return (

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {messages.length === 0 && (

                <div className="text-center text-gray-500 mt-20">

                    <h2 className="text-2xl font-semibold">

                        👋 Welcome to Konaseema CRM AI

                    </h2>

                    <p className="mt-3">

                        Start a new conversation with your AI Sales Assistant.

                    </p>

                </div>

            )}

            {messages.map((message, index) => (

                <div

                    key={index}

                    className={`flex ${message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}

                >

                    <div

                        className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}

                    >

                        {message.text}

                    </div>

                </div>

            ))}

        </div>

    );

}