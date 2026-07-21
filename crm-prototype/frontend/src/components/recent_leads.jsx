import { useNavigate } from "react-router-dom";

export default function RecentLeads({ leads }) {

    const navigate = useNavigate();

    const getStatusColor = (status) => {

        switch (status) {

            case "Interested":
                return "bg-green-100 text-green-700";

            case "New":
                return "bg-blue-100 text-blue-700";

            case "Follow Up":
                return "bg-yellow-100 text-yellow-700";

            case "Converted":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-gray-100 text-gray-700";
        }

    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-semibold">
                    Recent Leads
                </h2>

                <span className="text-sm text-gray-500">
                    {leads.length} Recent Lead{leads.length !== 1 ? "s" : ""}
                </span>

            </div>

            {leads.length === 0 ? (

                <div className="text-center py-10 text-gray-500">
                    No leads available.
                </div>

            ) : (

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

                        {leads.map((lead) => (

                            <tr
                                key={lead.id}
                                onClick={() => navigate(`/leads/${lead.id}`)}
                                className="border-b last:border-none hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                            >

                                <td className="py-4 font-medium">
                                    {lead.name}
                                </td>

                                <td>
                                    {lead.company}
                                </td>

                                <td>
                                    {lead.source}
                                </td>

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}
                                    >
                                        {lead.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}