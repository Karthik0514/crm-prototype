import LeadTable from "../components/lead_table";
import { useEffect, useState } from "react";
import api from "../services/api";
import AddLeadModal from "../components/add_lead_model";
export default function Leads() {
    const [openModal, setOpenModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
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
    const filteredLeads = leads.filter((lead) => {

        const query = search.toLowerCase();

        return (
            (lead.name || "").toLowerCase().includes(query) ||
            (lead.company || "").toLowerCase().includes(query) ||
            (lead.email || "").toLowerCase().includes(query) ||
            (lead.phone || "").toLowerCase().includes(query)
        );

    });
    const totalLeads = leads.length;

    const newLeads = leads.filter(
        (lead) => lead.status === "New"
    ).length;

    const interestedLeads = leads.filter(
        (lead) => lead.status === "Interested"
    ).length;

    const followUpLeads = leads.filter(
        (lead) => lead.status === "Follow Up"
    ).length;
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
            <div className="grid grid-cols-4 gap-6 mb-6">

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Total Leads
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        {totalLeads}
                    </h1>

                </div>

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        New Leads
                    </p>

                    <h1 className="text-4xl font-bold text-blue-600 mt-2">
                        {newLeads}
                    </h1>

                </div>

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Interested
                    </p>

                    <h1 className="text-4xl font-bold text-green-600 mt-2">
                        {interestedLeads}
                    </h1>

                </div>

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Follow Up
                    </p>

                    <h1 className="text-4xl font-bold text-orange-500 mt-2">
                        {followUpLeads}
                    </h1>

                </div>

            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">

                <div className="flex gap-4">

                    <input
                        type="text"
                        placeholder="Search Lead..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

            <LeadTable leads={filteredLeads} />
        </div>
    );
}