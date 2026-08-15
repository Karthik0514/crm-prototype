export default function ChatInput({

    input,
    setInput,
    sendMessage

}) {

    return (

        <div className="border-t p-5 flex gap-3">

            <input

                value={input}

                onChange={(e) => setInput(e.target.value)}

                onKeyDown={(e) => {

                    if (e.key === "Enter")

                        sendMessage();

                }}

                placeholder="Ask AI anything..."

                className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"

            />

            <button

                onClick={sendMessage}

                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"

            >

                Send

            </button>

        </div>

    );

}