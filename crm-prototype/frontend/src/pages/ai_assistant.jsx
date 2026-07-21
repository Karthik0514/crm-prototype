export default function AIAssistant() {
    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                AI Sales Assistant
            </h1>

            <div className="grid grid-cols-3 gap-6">

                <div className="col-span-2 bg-white rounded-xl border p-6">

                    <div className="h-[450px] overflow-auto">

                        <div className="mb-5">

                            <div className="bg-blue-100 p-3 rounded-xl w-fit ml-auto">
                                Analyze Rahul Sharma
                            </div>

                        </div>

                        <div className="bg-gray-100 p-4 rounded-xl w-fit">

                            <p>Lead Score: <b>92%</b></p>

                            <p>Buying Intent: High</p>

                            <p>Recommended Action:</p>

                            <ul className="list-disc ml-5">

                                <li>Call today</li>

                                <li>Send proposal</li>

                                <li>Offer commercial pricing</li>

                            </ul>

                        </div>

                    </div>

                    <input
                        className="border rounded-xl p-3 w-full mt-5"
                        placeholder="Ask AI anything..."
                    />

                </div>

                <div className="bg-white border rounded-xl p-5">

                    <h2 className="font-bold mb-4">

                        AI Tools

                    </h2>

                    <button className="w-full bg-blue-600 text-white p-3 rounded-xl mb-3">
                        Analyze Lead
                    </button>

                    <button className="w-full bg-green-600 text-white p-3 rounded-xl mb-3">
                        Generate Email
                    </button>

                    <button className="w-full bg-orange-600 text-white p-3 rounded-xl mb-3">
                        WhatsApp Reply
                    </button>

                    <button className="w-full bg-purple-600 text-white p-3 rounded-xl">
                        Call Script
                    </button>

                </div>

            </div>

        </div>
    );
}