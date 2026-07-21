const campaigns = [
    {
        name: "Solar Promotion",
        channel: "WhatsApp",
        audience: "IndiaMART",
        sent: 520,
        total: 1000,
    },
    {
        name: "Industrial Boilers",
        channel: "Email",
        audience: "LinkedIn",
        sent: 120,
        total: 300,
    },
];

export default function Campaigns() {
    return (
        <div>

            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Campaigns
                </h1>

                <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
                    + New Campaign
                </button>

            </div>

            <div className="grid grid-cols-2 gap-6">

                {campaigns.map(c => (

                    <div
                        key={c.name}
                        className="bg-white border rounded-2xl p-6"
                    >

                        <h2 className="font-bold text-xl">
                            {c.name}
                        </h2>

                        <p>{c.channel}</p>

                        <p>{c.audience}</p>

                        <div className="bg-gray-200 rounded-full h-3 mt-4">

                            <div
                                className="bg-blue-600 h-3 rounded-full"
                                style={{
                                    width: `${(c.sent / c.total) * 100}%`,
                                }}
                            />

                        </div>

                        <p className="mt-2">
                            {c.sent}/{c.total} Sent
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}