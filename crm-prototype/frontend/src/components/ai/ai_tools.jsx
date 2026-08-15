export default function AITools({ quickPrompt }) {

    const tools = [

        {
            title: "Analyze Lead",
            emoji: "📊",
            color: "bg-blue-600",
            prompt: "Analyze this lead."
        },

        {
            title: "Generate Email",
            emoji: "📧",
            color: "bg-green-600",
            prompt: "Generate a professional sales email."
        },

        {
            title: "WhatsApp Reply",
            emoji: "💬",
            color: "bg-orange-500",
            prompt: "Generate a WhatsApp follow-up message."
        },

        {
            title: "Call Script",
            emoji: "📞",
            color: "bg-purple-600",
            prompt: "Generate a sales call script."
        }

    ];

    return (

        <div className="bg-white rounded-2xl border shadow-sm p-5">

            <h2 className="font-semibold text-lg mb-5">

                AI Tools

            </h2>

            <div className="space-y-3">

                {tools.map(tool => (

                    <button

                        key={tool.title}

                        onClick={() => quickPrompt(tool.prompt)}

                        className={`w-full ${tool.color} hover:opacity-90 text-white rounded-xl p-3`}

                    >

                        {tool.emoji} {tool.title}

                    </button>

                ))}

            </div>

        </div>

    );

}