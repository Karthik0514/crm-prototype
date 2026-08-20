export default function ChatSidebar({
    sessions,
    currentSession,
    createChat,
    setCurrentSession,
    deleteChat
}) {

    // -----------------------------------------
    // DELETE CHAT
    // -----------------------------------------

    const handleDelete = async (event, sessionId) => {

        event.stopPropagation();

        const confirmed = window.confirm(
            "Are you sure you want to delete this chat?"
        );

        if (!confirmed) return;

        try {

            await deleteChat(sessionId);

        } catch (error) {

            console.error("Delete failed:", error);

        }
    };


    return (

        <div className="w-72 bg-white border rounded-2xl shadow-sm flex flex-col">

            {/* NEW CHAT */}

            <div className="p-5 border-b">

                <button
                    onClick={createChat}
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        rounded-xl
                        py-3
                        transition
                    "
                >
                    + New Chat
                </button>

            </div>


            {/* CHAT SESSIONS */}

            <div className="flex-1 overflow-y-auto">

                {sessions.map((session) => (

                    <div
                        key={session.id}
                        onClick={() => setCurrentSession(session.id)}
                        className={`
                            group
                            flex
                            items-center
                            justify-between
                            px-5
                            py-4
                            border-b
                            cursor-pointer
                            hover:bg-gray-50
                            transition

                            ${currentSession === session.id
                                ? "bg-blue-50"
                                : ""
                            }
                        `}
                    >

                        {/* CHAT INFORMATION */}

                        <div className="flex-1 min-w-0 pr-3">

                            <div className="font-medium truncate">
                                {session.title}
                            </div>

                            <div className="text-xs text-gray-500">
                                {new Date(
                                    session.created_at
                                ).toLocaleDateString()}
                            </div>

                        </div>


                        {/* DELETE BUTTON */}

                        <button
                            type="button"
                            onClick={(event) =>
                                handleDelete(event, session.id)
                            }
                            className="
                                opacity-0
                                group-hover:opacity-100
                                flex
                                items-center
                                justify-center
                                w-8
                                h-8
                                rounded-lg
                                text-red-500
                                hover:bg-red-50
                                hover:text-red-700
                                transition
                            "
                            title="Delete chat"
                        >
                            🗑️
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}