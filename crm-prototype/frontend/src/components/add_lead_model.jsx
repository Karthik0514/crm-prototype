import { X } from "lucide-react";

export default function AddLeadModal({ open, setOpen }) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-[650px] p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Add New Lead
                    </h2>

                    <X
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                    />

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        className="border rounded-lg p-3"
                        placeholder="Customer Name"
                    />

                    <input
                        className="border rounded-lg p-3"
                        placeholder="Company"
                    />

                    <input
                        className="border rounded-lg p-3"
                        placeholder="Phone"
                    />

                    <input
                        className="border rounded-lg p-3"
                        placeholder="Email"
                    />

                    <select className="border rounded-lg p-3">

                        <option>Select Source</option>

                        <option>IndiaMART</option>

                        <option>TradeIndia</option>

                        <option>LinkedIn</option>

                        <option>Google Business</option>

                    </select>

                    <select className="border rounded-lg p-3">

                        <option>Status</option>

                        <option>New</option>

                        <option>Interested</option>

                        <option>Follow Up</option>

                    </select>

                </div>

                <textarea
                    rows="5"
                    placeholder="Lead Notes..."
                    className="border rounded-lg p-3 mt-4 w-full"
                />

                <button
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
                >
                    Save Lead
                </button>

            </div>

        </div>

    );

}