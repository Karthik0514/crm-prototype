import LeadTable from "../components/lead_table";
import { useEffect, useState } from "react";
import api from "../services/api";
import AddLeadModal from "../components/add_lead_model";
export default function Leads() {
    const [openModal, setOpenModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const fetchLeads = async () => {
        try {
            const response = await api.get("/leads");
            setLeads(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);
    return (
        <div>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Leads
                    </h1>

                    <p className="text-gray-500">
                        Manage and track all customer leads
                    </p>

                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Add Lead
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">

                <div className="flex gap-4">

                    <input
                        placeholder="Search Lead..."
                        className="border rounded-xl px-4 py-3 flex-1"
                    />

                    <select className="border rounded-xl px-4">

                        <option>All Status</option>

                        <option>New</option>

                        <option>Interested</option>

                        <option>Follow Up</option>

                        <option>Converted</option>

                    </select>

                    <select className="border rounded-xl px-4">

                        <option>All Sources</option>

                        <option>IndiaMART</option>

                        <option>TradeIndia</option>

                        <option>LinkedIn</option>

                        <option>Google</option>

                    </select>

                </div>

            </div>
            <AddLeadModal
                open={openModal}
                setOpen={setOpenModal}
                fetchLeads={fetchLeads}
            />

            <LeadTable leads={leads} />

        </div>
    );
}