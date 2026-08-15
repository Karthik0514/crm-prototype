export default function ChatSidebar({

    sessions,
    currentSession,
    createChat,
    setCurrentSession

}) {

    return (

        <div className="w-72 bg-white border rounded-2xl shadow-sm flex flex-col">

            <div className="p-5 border-b">

                <button
                    onClick={createChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                >
                    + New Chat
                </button>

            </div>

            <div className="flex-1 overflow-y-auto">

                {sessions.map(session => (

                    <button
                        key={session.id}
                        onClick={() => setCurrentSession(session.id)}
                        className={`w-full text-left px-5 py-4 border-b hover:bg-gray-50 transition

                        ${currentSession === session.id
                                ? "bg-blue-50"
                                : ""
                            }`}
                    >

                        <div className="font-medium">

                            {session.title}

                        </div>

                        <div className="text-xs text-gray-500">

                            {new Date(session.created_at).toLocaleDateString()}

                        </div>

                    </button>

                ))}

            </div>

        </div>

    );

}