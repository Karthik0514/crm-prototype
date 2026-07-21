export default function Settings() {
    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Settings
            </h1>

            <div className="bg-white rounded-xl border p-6 space-y-5">

                <input
                    className="border p-3 rounded-xl w-full"
                    placeholder="Company Name"
                />

                <input
                    className="border p-3 rounded-xl w-full"
                    placeholder="IndiaMART API Key"
                />

                <input
                    className="border p-3 rounded-xl w-full"
                    placeholder="TradeIndia API Key"
                />

                <input
                    className="border p-3 rounded-xl w-full"
                    placeholder="LinkedIn API Key"
                />

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                    Save Settings
                </button>

            </div>

        </div>
    );
}