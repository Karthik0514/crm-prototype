const leads = [
    {
        name: "Rahul Sharma",
        company: "ABC Pvt Ltd",
        source: "IndiaMART",
        status: "Interested",
    },
    {
        name: "Sneha Reddy",
        company: "Green Solar",
        source: "TradeIndia",
        status: "New",
    },
    {
        name: "Arjun Kumar",
        company: "PowerTech",
        source: "LinkedIn",
        status: "Follow Up",
    },
];

export default function RecentLeads() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold mb-5">
                Recent Leads
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="text-left text-gray-500 border-b">

                        <th className="pb-3">Name</th>
                        <th className="pb-3">Company</th>
                        <th className="pb-3">Source</th>
                        <th className="pb-3">Status</th>

                    </tr>

                </thead>

                <tbody>

                    {leads.map((lead, index) => (

                        <tr key={index} className="border-b last:border-none">

                            <td className="py-4">{lead.name}</td>

                            <td>{lead.company}</td>

                            <td>{lead.source}</td>

                            <td>

                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                                    {lead.status}

                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}