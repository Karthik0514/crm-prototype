
import {
    ArrowUp,
    Paperclip,
    Sparkles,
} from "lucide-react";


export default function ChatInput({
    input,
    setInput,
    sendMessage,
}) {

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    };


    // Open the computer's file picker
    const handleAttachmentClick = () => {

        document
            .getElementById("chat-file-upload")
            ?.click();

    };


    // Handle selected file
    const handleFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        console.log("Selected file:", file);

        // TODO:
        // Upload/process the file here.
        // For now, the file is selected from the computer
        // and available through this variable.

    };


    return (
        <div className="border-t border-slate-100 bg-white p-4 sm:p-5">

            <div
                className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-2
                    shadow-sm
                    transition
                    focus-within:border-blue-300
                    focus-within:bg-white
                    focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.08)]
                "
            >

                {/* INPUT */}

                <textarea
                    value={input}
                    onChange={(event) =>
                        setInput(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your AI sales assistant anything..."
                    rows={1}
                    className="
                        block
                        min-h-[48px]
                        max-h-32
                        w-full
                        resize-none
                        border-0
                        bg-transparent
                        px-3
                        py-3
                        text-sm
                        leading-6
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                    "
                />


                {/* BOTTOM CONTROLS */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        px-1
                        pb-1
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                        "
                    >

                        {/* HIDDEN FILE INPUT */}

                        <input
                            id="chat-file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />


                        {/* ATTACHMENT */}

                        <button
                            type="button"
                            onClick={handleAttachmentClick}
                            className="
                                flex
                                h-8
                                w-8
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-xl
                                text-slate-400
                                transition
                                hover:bg-white
                                hover:text-slate-600
                                active:scale-95
                            "
                            title="Attach a file"
                        >

                            <Paperclip size={16} />

                        </button>


                        {/* AI STATUS */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-1.5
                                rounded-xl
                                px-2
                                py-1.5
                                text-[10px]
                                font-medium
                                text-slate-400
                                sm:flex
                            "
                        >

                            <Sparkles
                                size={12}
                                className="text-blue-500"
                            />

                            AI-powered CRM assistant

                        </div>

                    </div>


                    {/* SEND BUTTON */}

                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            shadow-md
                            shadow-blue-600/20
                            transition
                            duration-150
                            hover:bg-blue-700
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:bg-slate-200
                            disabled:text-slate-400
                            disabled:shadow-none
                        "
                        title="Send message"
                    >

                        <ArrowUp
                            size={17}
                            strokeWidth={2.5}
                        />

                    </button>

                </div>

            </div>


            {/* HINT */}

            <p
                className="
                    mt-2
                    text-center
                    text-[10px]
                    text-slate-400
                "
            >
                Enter to send · Shift + Enter for a new line
            </p>

        </div>
    );
}

