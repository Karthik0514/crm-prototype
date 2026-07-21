import { X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function AddLeadModal({ open,
    setOpen,
    fetchLeads,
    editingLead = null
 }) {

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        phone: "",
        email: "",
        source: "",
        status: "",
        notes: ""
    });
    useEffect(() => {

        if (!open) return;

        if (editingLead) {

            setFormData({
                name: editingLead.name,
                company: editingLead.company,
                phone: editingLead.phone,
                email: editingLead.email,
                source: editingLead.source,
                status: editingLead.status,
                notes: editingLead.notes
            });

        } else {

            setFormData({
                name: "",
                company: "",
                phone: "",
                email: "",
                source: "",
                status: "",
                notes: ""
            });

        }

    }, [open, editingLead]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {

        try {

            if (editingLead) {

                await api.put(
                    `/leads/${editingLead.id}`,
                    formData
                );

            } else {

                await api.post(
                    "/leads",
                    formData
                );

            }

            await fetchLeads();
            setFormData({
                name: "",
                company: "",
                phone: "",
                email: "",
                source: "",
                status: "",
                notes: ""
            });
            setOpen(false);

        } catch (err) {

            console.error(err);

        }

    };
    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-[650px] p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        {editingLead ? "Edit Lead" : "Add New Lead"}
                    </h2>

                    <X
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                    />

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        placeholder="Customer Name"
                    />

                    <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        placeholder="Company"
                    />
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        placeholder="Phone"
                    />

                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        placeholder="Email"
                    />

                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    >

                        <option value="">Select Source</option>
                        <option value="IndiaMART">IndiaMART</option>
                        <option value="TradeIndia">TradeIndia</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Google Business">Google Business</option>
                    </select>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    >
                        <option value="">Select Status</option>
                        <option value="New">New</option>
                        <option value="Interested">Interested</option>
                        <option value="Follow Up">Follow Up</option>
                    </select>

                </div>

                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Lead Notes..."
                    className="border rounded-lg p-3 mt-4 w-full"
                />
               
                <button
                    onClick={handleSave}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                    {editingLead ? "Update Lead" : "Save Lead"}
                </button>
            </div>

        </div>

    );

}