import { useEffect, useState } from "react";
import { X, FileText, Save } from "lucide-react";
import api from "../services/api";

export default function AddNoteModal({
    open,
    setOpen,
    lead,
    onSuccess,
}) {
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setNote("");
            setError("");
        }
    }, [open]);

    if (!open || !lead) return null;

    const handleSave = async () => {
        const trimmedNote = note.trim();

        if (!trimmedNote) {
            setError("Please enter a note.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const existingNotes = lead.notes?.trim() || "";

            const updatedNotes = existingNotes
                ? `${existingNotes}\n\n${trimmedNote}`
                : trimmedNote;

            await api.put(`/leads/${lead.id}`, {
                name: lead.name,
                company: lead.company,
                phone: lead.phone,
                email: lead.email,
                source: lead.source,
                status: lead.status,
                notes: updatedNotes,
            });

            if (onSuccess) {
                await onSuccess();
            }

            setOpen(false);
            setNote("");

        } catch (err) {
            console.error("Failed to add note:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to save note. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (saving) return;

        setOpen(false);
        setNote("");
        setError("");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onMouseDown={handleClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200"
                onMouseDown={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText
                                size={20}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Add Note
                            </h2>

                            <p className="text-sm text-gray-500 mt-0.5">
                                Add a note to {lead.name}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}
                <div className="p-6">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Note
                    </label>

                    <textarea
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter your note..."
                        rows={6}
                        autoFocus
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {error && (
                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-60"
                    >
                        <Save size={17} />

                        {saving ? "Saving..." : "Save Note"}
                    </button>

                </div>

            </div>
        </div>
    );
}