import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
const leads = [
    {
        id: 1,
        name: "Rahul Sharma",
        company: "ABC Pvt Ltd",
        phone: "9876543210",
        source: "IndiaMART",
        status: "Interested",
    },
    {
        id: 2,
        name: "Sneha Reddy",
        company: "Green Solar",
        phone: "9988776655",
        source: "TradeIndia",
        status: "New",
    },
    {
        id: 3,
        name: "Arjun Kumar",
        company: "PowerTech",
        phone: "9123456789",
        source: "LinkedIn",
        status: "Follow Up",
    },
];

const statusColors = {
    New: "bg-blue-100 text-blue-700",
    Interested: "bg-green-100 text-green-700",
    "Follow Up": "bg-orange-100 text-orange-700",
    Converted: "bg-purple-100 text-purple-700",
};

export default function LeadTable() {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-50">

                    <tr>

                        <th className="text-left p-4">Name</th>
                        <th className="text-left">Company</th>
                        <th className="text-left">Phone</th>
                        <th className="text-left">Source</th>
                        <th className="text-left">Status</th>
                        <th className="text-center">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {leads.map((lead) => (

                        <tr
                            key={lead.id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="p-4">{lead.name}</td>

                            <td>{lead.company}</td>

                            <td>{lead.phone}</td>

                            <td>{lead.source}</td>

                            <td>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${statusColors[lead.status]
                                        }`}
                                >
                                    {lead.status}
                                </span>

                            </td>

                            <td className="text-center">

                                <button
                                    onClick={() => navigate(`/lead/${lead.id}`)}
                                    className="p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition"
                                >
                                    <Eye size={18} />
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}