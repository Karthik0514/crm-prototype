const tenders = [
    {
        title: "Solar Installation - Govt School",
        value: "₹18 Lakhs",
        deadline: "12 Aug",
    },
    {
        title: "Industrial Rooftop Project",
        value: "₹52 Lakhs",
        deadline: "22 Aug",
    },
];

export default function Tenders() {
    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Tender Opportunities
            </h1>

            <div className="space-y-5">

                {tenders.map((t) => (

                    <div
                        key={t.title}
                        className="bg-white border rounded-xl p-6 flex justify-between items-center"
                    >

                        <div>

                            <h2 className="font-bold">
                                {t.title}
                            </h2>

                            <p>{t.value}</p>

                            <p>Deadline: {t.deadline}</p>

                        </div>

                        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
                            Analyze
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}