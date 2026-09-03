import {
    Bot,
    Clock3,
    MessageSquare,
    Plus,
    Trash2,
} from "lucide-react";


export default function ChatSidebar({
    sessions,
    currentSession,
    createChat,
    setCurrentSession,
    deleteChat,
}) {


    // -----------------------------------------
    // DELETE CHAT
    // -----------------------------------------

    const handleDelete = async (
        event,
        sessionId
    ) => {

        event.stopPropagation();

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this chat?"
            );

        if (!confirmed) return;

        try {

            await deleteChat(sessionId);

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

        }

    };


    return (

        <aside className="
            flex
            h-full
            min-h-0
            w-full
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_10px_40px_rgba(15,23,42,0.05)]
        ">


            {/* ========================================= */}
            {/* SIDEBAR HEADER */}
            {/* ========================================= */}

            <div className="
                border-b
                border-slate-100
                p-5
            ">

                <div className="
                    mb-4
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


                    <div className="min-w-0">

                        <h2 className="
                            truncate
                            text-sm
                            font-bold
                            text-slate-900
                        ">
                            AI Assistant
                        </h2>

                        <p className="
                            mt-0.5
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wider
                            text-slate-400
                        ">
                            Conversations
                        </p>

                    </div>

                </div>


                {/* NEW CHAT */}

                <button
                    onClick={createChat}
                    className="
                        cursor-pointer
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-blue-600
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-blue-600/15
                        transition
                        duration-200
                        hover:bg-blue-700
                        hover:shadow-blue-600/20
                        active:scale-[0.99]
                    "
                >

                    <Plus size={17} />

                    New conversation

                </button>

            </div>


            {/* ========================================= */}
            {/* SESSION TITLE */}
            {/* ========================================= */}

            <div className="
                flex
                items-center
                justify-between
                px-5
                pb-2
                pt-5
            ">

                <p className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                ">
                    Recent chats
                </p>


                <span className="
                    rounded-full
                    bg-slate-100
                    px-2
                    py-0.5
                    text-[10px]
                    font-bold
                    text-slate-500
                ">
                    {sessions.length}
                </span>

            </div>


            {/* ========================================= */}
            {/* CHAT SESSIONS */}
            {/* ========================================= */}

            <div className="
                min-h-0
                flex-1
                overflow-y-auto
                px-3
                pb-3
                pt-2
            ">

                {sessions.length === 0 ? (

                    <div className="
                        flex
                        h-full
                        flex-col
                        items-center
                        justify-center
                        px-5
                        text-center
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-slate-50
                            text-slate-400
                        ">

                            <MessageSquare
                                size={20}
                            />

                        </div>


                        <p className="
                            mt-4
                            text-sm
                            font-semibold
                            text-slate-700
                        ">
                            No conversations yet
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            leading-5
                            text-slate-400
                        ">
                            Start a new conversation
                            with your AI sales assistant.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-1">

                        {sessions.map(
                            (session) => {

                                const active =
                                    currentSession ===
                                    session.id;


                                return (

                                    <div
                                        key={session.id}
                                        onClick={() =>
                                            setCurrentSession(
                                                session.id
                                            )
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            cursor-pointer
                                            items-center
                                            gap-3
                                            rounded-2xl
                                            px-3
                                            py-3
                                            transition
                                            duration-150
                                            ${active
                                                ? "bg-blue-50"
                                                : "hover:bg-slate-50"
                                            }
                                        `}
                                    >

                                        {/* ACTIVE INDICATOR */}

                                        {active && (

                                            <div className="
                                                absolute
                                                bottom-2
                                                left-0
                                                top-2
                                                w-0.5
                                                rounded-full
                                                bg-blue-600
                                            " />

                                        )}


                                        {/* ICON */}

                                        <div className={`
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            ${active
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-slate-100 text-slate-500"
                                            }
                                        `}>

                                            <MessageSquare
                                                size={15}
                                            />

                                        </div>


                                        {/* INFO */}

                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">

                                            <p className={`
                                                truncate
                                                text-xs
                                                font-semibold
                                                ${active
                                                    ? "text-blue-900"
                                                    : "text-slate-700"
                                                }
                                            `}>
                                                {session.title ||
                                                    "New Chat"}
                                            </p>


                                            <div className="
                                                mt-1
                                                flex
                                                items-center
                                                gap-1
                                                text-[10px]
                                                text-slate-400
                                            ">

                                                <Clock3
                                                    size={10}
                                                />

                                                {new Date(
                                                    session.created_at
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )}

                                            </div>

                                        </div>


                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            onClick={(
                                                event
                                            ) =>
                                                handleDelete(
                                                    event,
                                                    session.id
                                                )
                                            }
                                            className="
                                                cursor-pointer
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                text-slate-300
                                                opacity-0
                                                transition
                                                group-hover:opacity-100
                                                hover:bg-red-50
                                                hover:text-red-500
                                            "
                                            title="Delete chat"
                                        >

                                            <Trash2
                                                size={14}
                                            />

                                        </button>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>


            {/* ========================================= */}
            {/* SIDEBAR FOOTER */}
            {/* ========================================= */}

            <div className="
                border-t
                border-slate-100
                p-4
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-slate-50
                    px-3
                    py-2.5
                ">

                    <span className="
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-500
                    " />

                    <span className="
                        text-[10px]
                        font-semibold
                        text-slate-500
                    ">
                        AI assistant ready
                    </span>

                </div>

            </div>

        </aside>

    );

}