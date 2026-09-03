import {
    ArrowLeft,
    ArrowUpRight,
    Building2,
    CalendarDays,
    Check,
    CreditCard,
    CheckCircle2,
    ChevronDown,
    CircleUserRound,
    Clock3,
    FileText,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Pencil,
    Phone,
    Plus,
    Sparkles,
    Target,
    Trash2,
    TrendingUp,
    UserRound,
    X,
    Zap,
} from "lucide-react";

import ConvertSaleModal from "../components/convert_sale_modal";
import AddLeadModal from "../components/add_lead_model";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";


// ============================================================
// STATUS COLORS
// ============================================================

function getStatusStyle(status) {
    switch (status) {
        case "Interested":
            return {
                dot: "bg-emerald-500",
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            };

        case "Follow Up":
            return {
                dot: "bg-amber-500",
                badge: "bg-amber-50 text-amber-700 border-amber-200",
            };

        case "Converted":
            return {
                dot: "bg-blue-500",
                badge: "bg-blue-50 text-blue-700 border-blue-200",
            };

        default:
            return {
                dot: "bg-slate-400",
                badge: "bg-slate-50 text-slate-700 border-slate-200",
            };
    }
}


// ============================================================
// PRIORITY COLORS
// ============================================================

function getPriorityStyle(priority) {
    switch (priority) {
        case "Hot":
            return {
                badge:
                    "bg-red-50 text-red-700 border-red-200",
                dot: "bg-red-500",
            };

        case "Warm":
            return {
                badge:
                    "bg-amber-50 text-amber-700 border-amber-200",
                dot: "bg-amber-500",
            };

        default:
            return {
                badge:
                    "bg-blue-50 text-blue-700 border-blue-200",
                dot: "bg-blue-500",
            };
    }
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function LeadDetails() {

    const { id } = useParams();
    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [lead, setLead] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [sale, setSale] = useState(null);

    const [loading, setLoading] = useState(true);

    const [emailData, setEmailData] = useState(null);
    const [whatsAppData, setWhatsAppData] = useState(null);
    const [callScript, setCallScript] = useState(null);

    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
    const [loadingCallScript, setLoadingCallScript] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [convertModalOpen, setConvertModalOpen] =
        useState(false);

    const [menuOpen, setMenuOpen] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [noteOpen, setNoteOpen] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [savingNote, setSavingNote] = useState(false);


    // ========================================================
    // FETCH LEAD + AI ANALYSIS
    // ========================================================

    const refreshLead = async () => {

        try {

            setLoading(true);

            const leadResponse =
                await api.get(`/leads/${id}`);

            const currentLead = leadResponse.data;

            setLead(currentLead);

            // Converted leads use the customer/sale view only.
            // Do not load or display AI lead-analysis data for them.
            if (currentLead.status === "Converted") {

                setAnalysis(null);

                try {
                    const salesResponse = await api.get("/sales");
                    const sales = Array.isArray(salesResponse.data)
                        ? salesResponse.data
                        : [];

                    const convertedSale = sales.find(
                        (item) => Number(item.lead_id) === Number(id)
                    );

                    setSale(convertedSale || null);
                } catch (saleError) {
                    console.error(
                        "Failed to load converted sale:",
                        saleError
                    );
                    setSale(null);
                }

                return;
            }

            setSale(null);

            const aiResponse =
                await api.get(`/leads/${id}/analyze`);

            setAnalysis(aiResponse.data);

        } catch (err) {

            console.error(
                "Failed to load lead:",
                err
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        refreshLead();

    }, [id]);


    // ========================================================
    // GENERATE EMAIL
    // ========================================================

    const generateEmail = async () => {

        try {

            setLoadingEmail(true);

            const response =
                await api.get(
                    `/leads/${id}/email`
                );

            setEmailData(response.data);

        } catch (err) {

            console.error(
                "Failed to generate email:",
                err
            );

        } finally {

            setLoadingEmail(false);

        }
    };


    // ========================================================
    // GENERATE WHATSAPP
    // ========================================================

    const generateWhatsApp = async () => {

        try {

            setLoadingWhatsApp(true);

            const response =
                await api.get(
                    `/leads/${id}/whatsapp`
                );

            setWhatsAppData(response.data);

        } catch (err) {

            console.error(
                "Failed to generate WhatsApp:",
                err
            );

        } finally {

            setLoadingWhatsApp(false);

        }
    };


    // ========================================================
    // GENERATE CALL SCRIPT
    // ========================================================

    const generateCallScript = async () => {

        try {

            setLoadingCallScript(true);

            const response =
                await api.get(
                    `/leads/${id}/call-script`
                );

            setCallScript(response.data);

        } catch (err) {

            console.error(
                "Failed to generate call script:",
                err
            );

        } finally {

            setLoadingCallScript(false);

        }
    };


    // ========================================================
    // DELETE LEAD
    // ========================================================

    const deleteLead = async () => {

        try {

            await api.delete(
                `/leads/${id}`
            );

            setDeleteModalOpen(false);

            navigate("/leads");

        } catch (err) {

            console.error(
                "Failed to delete lead:",
                err
            );

        }

    };


    // ========================================================
    // ADD NOTE
    // ========================================================

    const saveNote = async () => {

        const trimmedNote =
            noteText.trim();

        if (!trimmedNote || !lead) {
            return;
        }


        try {

            setSavingNote(true);


            const existingNotes =
                lead.notes?.trim() || "";


            const updatedNotes =
                existingNotes
                    ? `${existingNotes}\n\n${trimmedNote}`
                    : trimmedNote;


            await api.put(
                `/leads/${id}`,
                {
                    name: lead.name,
                    company: lead.company,
                    phone: lead.phone,
                    email: lead.email,
                    source: lead.source,
                    status: lead.status,
                    notes: updatedNotes,
                }
            );


            setNoteText("");
            setNoteOpen(false);

            await refreshLead();

        } catch (err) {

            console.error(
                "Failed to save note:",
                err
            );

        } finally {

            setSavingNote(false);

        }
    };


    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {

        return (

            <div className="min-h-[70vh] bg-slate-50">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="animate-pulse space-y-6">

                        <div className="h-5 bg-slate-200 rounded w-28" />

                        <div className="bg-white rounded-3xl border border-slate-200 p-8">

                            <div className="h-8 bg-slate-200 rounded w-72" />

                            <div className="h-4 bg-slate-200 rounded w-48 mt-4" />

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-slate-200" />

                            <div className="h-72 bg-white rounded-3xl border border-slate-200" />

                        </div>

                    </div>

                </div>

            </div>

        );
    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    const isConverted = lead?.status === "Converted";


    if (!lead || (!isConverted && !analysis)) {

        return (

            <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">

                        <UserRound
                            size={24}
                            className="text-slate-400"
                        />

                    </div>

                    <h2 className="text-lg font-semibold text-slate-900">
                        Lead not found
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        This lead may have been deleted.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/leads")
                        }
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            text-white
                            text-sm
                            font-medium
                            hover:bg-blue-700
                            transition
                        "
                    >
                        <ArrowLeft size={16} />
                        Back to Leads
                    </button>

                </div>

            </div>

        );
    }


    // ========================================================
    // CONVERTED CUSTOMER VIEW
    // ========================================================

    // IMPORTANT: Everything below this point is the existing lead UI.
    // It is intentionally untouched for non-converted leads.
    if (isConverted) {

        const saleAmount = Number(sale?.sale_amount || 0);
        const amountPaid = Number(sale?.amount_paid || 0);
        const outstanding = Math.max(saleAmount - amountPaid, 0);

        const paymentStatus = sale?.payment_status || "Pending";

        const paymentStatusClasses =
            paymentStatus === "Paid"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : paymentStatus === "Partial"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : paymentStatus === "Overdue"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-slate-50 text-slate-700 border-slate-200";

        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate("/leads")}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-6"
                    >
                        <ArrowLeft size={17} className="group-hover:-translate-x-0.5 transition" />
                        Back to Leads
                    </button>

                    <section className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative p-7 lg:p-8">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={30} className="text-emerald-600" />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-950">
                                                {lead.name}
                                            </h1>

                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Converted Customer
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                            {lead.company && (
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Building2 size={15} />
                                                    {lead.company}
                                                </div>
                                            )}

                                            {lead.source && (
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Zap size={15} />
                                                    {lead.source}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-emerald-700 mt-3">
                                            This lead has successfully moved from prospect to customer.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                                    >
                                        <Pencil size={15} />
                                        Edit Customer
                                    </button>
                                </div>
                            </div>

                            <div className="mt-7 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Phone size={16} className="text-slate-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Phone</p>
                                        <p className="text-sm font-medium text-slate-800 truncate">{lead.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Mail size={16} className="text-slate-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Email</p>
                                        <p className="text-sm font-medium text-slate-800 truncate">{lead.email || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <CalendarDays size={16} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Created</p>
                                        <p className="text-sm font-medium text-slate-800">{formatDate(lead.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Customer Status</p>
                                        <p className="text-sm font-semibold text-emerald-600">Converted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                        <div className="lg:col-span-2 space-y-6">

                            <section className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <CreditCard size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Sale Overview</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Customer transaction details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                            <p className="text-xs font-medium text-slate-500">Sale Amount</p>
                                            <p className="text-2xl font-bold text-slate-950 mt-2">
                                                {sale ? `₹${saleAmount.toLocaleString("en-IN")}` : "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                            <p className="text-xs font-medium text-slate-500">Amount Paid</p>
                                            <p className="text-2xl font-bold text-emerald-600 mt-2">
                                                {sale ? `₹${amountPaid.toLocaleString("en-IN")}` : "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                            <p className="text-xs font-medium text-slate-500">Outstanding</p>
                                            <p className={`text-2xl font-bold mt-2 ${outstanding > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                                {sale ? `₹${outstanding.toLocaleString("en-IN")}` : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-2xl border border-slate-100 divide-y divide-slate-100">
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <CreditCard size={17} className="text-slate-400" />
                                                <span className="text-sm text-slate-500">Payment Status</span>
                                            </div>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${paymentStatusClasses}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {paymentStatus}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <CalendarDays size={17} className="text-slate-400" />
                                                <span className="text-sm text-slate-500">Payment Due</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">
                                                {sale?.payment_due_date ? formatDate(sale.payment_due_date) : "No due date"}
                                            </span>
                                        </div>

                                        {sale?.payment_notes && (
                                            <div className="px-5 py-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Payment Notes</p>
                                                <p className="text-sm leading-6 text-slate-600 whitespace-pre-wrap">{sale.payment_notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {!sale && (
                                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                            This lead is converted, but the associated sale record could not be loaded.
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                                <FileText size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-semibold text-slate-900">Customer Notes</h2>
                                                <p className="text-xs text-slate-400 mt-0.5">Internal notes about this customer</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { setNoteText(""); setNoteOpen(true); }}
                                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                                        >
                                            <Plus size={14} />
                                            Add Note
                                        </button>
                                    </div>

                                    <div className="mt-5">
                                        {lead.notes?.trim() ? (
                                            <div className="relative rounded-2xl bg-amber-50/60 border border-amber-100 p-5">
                                                <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-amber-400" />
                                                <p className="pl-3 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{lead.notes}</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                                                <FileText size={22} className="mx-auto text-slate-300" />
                                                <p className="text-sm font-medium text-slate-600 mt-3">No notes yet</p>
                                                <p className="text-xs text-slate-400 mt-1">Add the first note for this customer.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-7">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <TrendingUp size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Customer Journey</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">From prospect to customer</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            ["Lead Created", "Lead entered the CRM", true],
                                            ["Sales Engagement", "Lead progressed through the sales process", true],
                                            ["Converted", "Lead successfully became a customer", true],
                                        ].map(([title, description, done]) => (
                                            <div key={title} className="flex items-start gap-4">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200"}`}>
                                                    <CheckCircle2 size={17} className={done ? "text-emerald-600" : "text-slate-400"} />
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <UserRound size={18} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Customer Snapshot</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Current CRM information</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-slate-500">Status</span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Converted
                                            </span>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-slate-500">Source</span>
                                            <span className="text-sm font-medium text-slate-800 text-right">{lead.source || "—"}</span>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-slate-500">Company</span>
                                            <span className="text-sm font-medium text-slate-800 text-right">{lead.company || "—"}</span>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-slate-500">Created</span>
                                            <span className="text-sm font-medium text-slate-800">{formatDate(lead.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Zap size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Customer Actions</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Manage this customer</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate("/sales")}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                                    >
                                        <CreditCard size={16} />
                                        View Sales
                                        <ArrowUpRight size={15} />
                                    </button>

                                    <button
                                        onClick={() => { setNoteText(""); setNoteOpen(true); }}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition mt-3"
                                    >
                                        <FileText size={16} />
                                        Add Customer Note
                                    </button>

                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition mt-3"
                                    >
                                        <Pencil size={16} />
                                        Edit Customer
                                    </button>
                                </div>
                            </section>

                            <section className="bg-white border border-red-100 rounded-3xl">
                                <div className="p-5">
                                    <button
                                        onClick={() => setDeleteModalOpen(true)}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 text-sm font-semibold hover:bg-red-50 transition"
                                    >
                                        <Trash2 size={16} />
                                        Delete Customer Record
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>

                    <section className="sticky bottom-4 z-30 mt-6 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.10)] p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs text-slate-400">Customer account</p>
                                    <p className="text-sm font-semibold text-slate-800 max-w-[220px] truncate">{lead.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => { setNoteText(""); setNoteOpen(true); }}
                                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <FileText size={15} />
                                    Add Note
                                </button>
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <Pencil size={15} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => navigate("/sales")}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                                >
                                    <CreditCard size={15} />
                                    View Sale
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <AddLeadModal
                    open={editOpen}
                    setOpen={setEditOpen}
                    fetchLeads={refreshLead}
                    editingLead={lead}
                />

                {noteOpen && (
                    <div
                        className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setNoteOpen(false)}
                    >
                        <div
                            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <FileText size={18} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-900">Add Customer Note</h2>
                                        <p className="text-xs text-slate-400">{lead.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setNoteOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Write an internal note about this customer..."
                                    rows={6}
                                    autoFocus
                                    className="w-full resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    onClick={() => { setNoteText(""); setNoteOpen(false); }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNote}
                                    disabled={savingNote || !noteText.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check size={15} />
                                    {savingNote ? "Saving..." : "Save Note"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModalOpen && (
                    <div
                        className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        <div
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                                        <Trash2 size={19} className="text-red-600" />
                                    </div>
                                    <button onClick={() => setDeleteModalOpen(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50">
                                        <X size={18} />
                                    </button>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-950 mt-5">Delete this customer?</h2>
                                <p className="text-sm text-slate-500 leading-6 mt-2">
                                    You're about to permanently delete <span className="font-semibold text-slate-700">{lead.name}</span>. This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-2 mt-7">
                                    <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button onClick={deleteLead} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                                        <Trash2 size={15} />
                                        Delete Customer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }


    // ========================================================
    // DERIVED DATA
    // ========================================================

    const statusStyle =
        getStatusStyle(lead.status);

    const priorityStyle =
        getPriorityStyle(analysis.priority);


    const score =
        Number(analysis.lead_score || 0);


    const scoreWidth =
        Math.min(
            Math.max(score, 0),
            100
        );


    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-6 py-8">


                {/* ================================================= */}
                {/* BACK */}
                {/* ================================================= */}

                <button
                    onClick={() =>
                        navigate("/leads")
                    }
                    className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-slate-500
                        hover:text-slate-900
                        transition
                        mb-6
                    "
                >

                    <ArrowLeft
                        size={17}
                        className="
                            group-hover:-translate-x-0.5
                            transition
                        "
                    />

                    Back to Leads

                </button>


                {/* ================================================= */}
                {/* LEAD HERO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-visible
                        bg-white
                        border
                        border-slate-200
                        rounded-3xl
                        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                    "
                >

                    <div className="p-7 lg:p-8">

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">


                            {/* LEFT */}
                            <div className="flex items-start gap-5">

                                <div
                                    className="
                                        w-16
                                        h-16
                                        rounded-2xl
                                        bg-blue-50
                                        border
                                        border-blue-100
                                        flex
                                        items-center
                                        justify-center
                                        flex-shrink-0
                                    "
                                >

                                    <CircleUserRound
                                        size={30}
                                        className="text-blue-600"
                                    />

                                </div>


                                <div>

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-950">
                                            {lead.name}
                                        </h1>


                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-1.5
                                                rounded-full
                                                border
                                                text-xs
                                                font-semibold
                                                ${statusStyle.badge}
                                            `}
                                        >

                                            <span
                                                className={`
                                                    w-1.5
                                                    h-1.5
                                                    rounded-full
                                                    ${statusStyle.dot}
                                                `}
                                            />

                                            {lead.status}

                                        </span>

                                    </div>


                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">

                                        {lead.company && (

                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">

                                                <Building2
                                                    size={15}
                                                />

                                                {lead.company}

                                            </div>

                                        )}


                                        {lead.source && (

                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">

                                                <Zap
                                                    size={15}
                                                />

                                                {lead.source}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* RIGHT ACTIONS */}
                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() =>
                                        setEditOpen(true)
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-slate-50
                                        hover:border-slate-300
                                        transition
                                    "
                                >

                                    <Pencil size={15} />

                                    Edit Lead

                                </button>


                                <div className="relative">

                                    <button
                                        onClick={() =>
                                            setMenuOpen(
                                                !menuOpen
                                            )
                                        }
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            flex
                                            items-center
                                            justify-center
                                            text-slate-500
                                            hover:bg-slate-50
                                            hover:text-slate-900
                                            transition
                                        "
                                        aria-label="More actions"
                                    >

                                        <MoreHorizontal
                                            size={19}
                                        />

                                    </button>


                                    {menuOpen && (

                                        <>

                                            <button
                                                className="fixed inset-0 z-10 cursor-default"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                aria-label="Close menu"
                                            />

                                            <div
                                                className="
                                                    absolute
                                                    right-0
                                                    top-12
                                                    z-20
                                                    w-48
                                                    bg-white
                                                    border
                                                    border-slate-200
                                                    rounded-xl
                                                    shadow-xl
                                                    p-1.5
                                                "
                                            >

                                                <button
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setEditOpen(true);
                                                    }}
                                                    className="
                                                        w-full
                                                        flex
                                                        items-center
                                                        gap-3
                                                        px-3
                                                        py-2.5
                                                        rounded-lg
                                                        text-sm
                                                        text-slate-700
                                                        hover:bg-slate-50
                                                        text-left
                                                    "
                                                >

                                                    <Pencil size={15} />

                                                    Edit lead

                                                </button>


                                                <div className="h-px bg-slate-100 my-1" />


                                                <button
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="
                                                        w-full
                                                        flex
                                                        items-center
                                                        gap-3
                                                        px-3
                                                        py-2.5
                                                        rounded-lg
                                                        text-sm
                                                        text-red-600
                                                        hover:bg-red-50
                                                        text-left
                                                    "
                                                >

                                                    <Trash2 size={15} />

                                                    Delete lead

                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* CONTACT STRIP */}

                        <div
                            className="
                                mt-7
                                pt-6
                                border-t
                                border-slate-100
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-5
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">

                                    <Phone
                                        size={16}
                                        className="text-slate-500"
                                    />

                                </div>

                                <div className="min-w-0">

                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                                        Phone
                                    </p>

                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {lead.phone || "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">

                                    <Mail
                                        size={16}
                                        className="text-slate-500"
                                    />

                                </div>

                                <div className="min-w-0">

                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                                        Email
                                    </p>

                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {lead.email || "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">

                                    <CalendarDays
                                        size={16}
                                        className="text-slate-500"
                                    />

                                </div>

                                <div>

                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                                        Created
                                    </p>

                                    <p className="text-sm font-medium text-slate-800">
                                        {formatDate(
                                            lead.created_at
                                        )}
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">

                                    <Target
                                        size={16}
                                        className="text-slate-500"
                                    />

                                </div>

                                <div>

                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                                        Priority
                                    </p>

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            text-sm
                                            font-semibold
                                            ${priorityStyle.badge
                                                .split(" ")
                                                .filter(
                                                    item =>
                                                        item.startsWith(
                                                            "text-"
                                                        )
                                                )
                                                .join(" ")
                                            }
                                        `}
                                    >

                                        <span
                                            className={`
                                                w-1.5
                                                h-1.5
                                                rounded-full
                                                ${priorityStyle.dot}
                                            `}
                                        />

                                        {analysis.priority}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* MAIN GRID */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-3
                        gap-6
                        mt-6
                    "
                >


                    {/* ============================================= */}
                    {/* LEFT / MAIN */}
                    {/* ============================================= */}

                    <div className="lg:col-span-2 space-y-6">


                        {/* ========================================= */}
                        {/* AI INSIGHT */}
                        {/* ========================================= */}

                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                                overflow-hidden
                            "
                        >

                            <div className="p-6">

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-blue-50
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <Sparkles
                                                size={19}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="font-semibold text-slate-900">
                                                AI Lead Insight
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Powered by CRM intelligence
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className="
                                            hidden
                                            sm:inline-flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            font-medium
                                            text-blue-600
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            rounded-full
                                        "
                                    >

                                        <Zap size={12} />

                                        AI Analysis

                                    </span>

                                </div>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        md:grid-cols-3
                                        gap-5
                                        mt-7
                                    "
                                >

                                    {/* SCORE */}

                                    <div
                                        className="
                                            md:col-span-1
                                            rounded-2xl
                                            bg-slate-50
                                            border
                                            border-slate-100
                                            p-5
                                        "
                                    >

                                        <div className="flex items-start justify-between">

                                            <div>

                                                <p className="text-xs font-medium text-slate-500">
                                                    Lead Score
                                                </p>

                                                <div className="flex items-end gap-1 mt-2">

                                                    <span className="text-4xl font-bold tracking-tight text-slate-950">
                                                        {score}
                                                    </span>

                                                    <span className="text-sm text-slate-400 mb-1">
                                                        / 100
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">

                                                <TrendingUp
                                                    size={17}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                        </div>


                                        <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">

                                            <div
                                                className="
                                                    h-full
                                                    bg-blue-600
                                                    rounded-full
                                                    transition-all
                                                    duration-500
                                                "
                                                style={{
                                                    width: `${scoreWidth}%`,
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* BUYING INTENT */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-100
                                            p-5
                                        "
                                    >

                                        <p className="text-xs font-medium text-slate-500">
                                            Buying Intent
                                        </p>

                                        <div className="flex items-center gap-2 mt-3">

                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">

                                                <Target
                                                    size={16}
                                                    className="text-emerald-600"
                                                />

                                            </div>

                                            <span className="font-semibold text-slate-900">
                                                {analysis.buying_intent}
                                            </span>

                                        </div>

                                        <p className="text-xs text-slate-400 mt-3 leading-5">
                                            Based on the lead's available CRM information.
                                        </p>

                                    </div>


                                    {/* SUMMARY */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-100
                                            p-5
                                        "
                                    >

                                        <p className="text-xs font-medium text-slate-500">
                                            AI Summary
                                        </p>

                                        <p className="text-sm text-slate-700 leading-6 mt-3">
                                            {analysis.summary}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* NEXT ACTION */}

                            <div
                                className="
                                    px-6
                                    py-5
                                    bg-slate-50
                                    border-t
                                    border-slate-100
                                "
                            >

                                <div className="flex items-start gap-3">

                                    <div
                                        className="
                                            w-9
                                            h-9
                                            rounded-xl
                                            bg-white
                                            border
                                            border-slate-200
                                            flex
                                            items-center
                                            justify-center
                                            flex-shrink-0
                                        "
                                    >

                                        <ArrowUpRight
                                            size={17}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Recommended next action
                                        </p>

                                        <p className="text-sm font-medium text-slate-800 mt-1">
                                            {analysis.next_action}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ========================================= */}
                        {/* NOTES */}
                        {/* ========================================= */}

                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                            "
                        >

                            <div className="p-6">

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">

                                            <FileText
                                                size={18}
                                                className="text-amber-600"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="font-semibold text-slate-900">
                                                Notes
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Internal notes about this lead
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        onClick={() =>
                                            setNoteOpen(
                                                !noteOpen
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-3.5
                                            py-2
                                            rounded-xl
                                            bg-slate-900
                                            text-white
                                            text-xs
                                            font-semibold
                                            hover:bg-slate-800
                                            transition
                                        "
                                    >

                                        {noteOpen ? (
                                            <X size={14} />
                                        ) : (
                                            <Plus size={14} />
                                        )}

                                        {noteOpen
                                            ? "Close"
                                            : "Add Note"}

                                    </button>

                                </div>


                                {/* NOTE COMPOSER */}

                                {noteOpen && (

                                    <div
                                        className="
                                            mt-5
                                            p-4
                                            rounded-2xl
                                            bg-slate-50
                                            border
                                            border-slate-200
                                        "
                                    >

                                        <textarea
                                            value={noteText}
                                            onChange={(e) =>
                                                setNoteText(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Write an internal note about this lead..."
                                            rows={4}
                                            className="
                                                w-full
                                                resize-none
                                                bg-white
                                                border
                                                border-slate-200
                                                rounded-xl
                                                px-4
                                                py-3
                                                text-sm
                                                text-slate-800
                                                placeholder:text-slate-400
                                                outline-none
                                                focus:border-blue-500
                                                focus:ring-4
                                                focus:ring-blue-50
                                            "
                                        />

                                        <div className="flex justify-end gap-2 mt-3">

                                            <button
                                                onClick={() => {
                                                    setNoteText("");
                                                    setNoteOpen(false);
                                                }}
                                                className="
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                    hover:bg-white
                                                    transition
                                                "
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={saveNote}
                                                disabled={
                                                    savingNote ||
                                                    !noteText.trim()
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    bg-blue-600
                                                    text-white
                                                    text-sm
                                                    font-semibold
                                                    hover:bg-blue-700
                                                    disabled:opacity-50
                                                    disabled:cursor-not-allowed
                                                    transition
                                                "
                                            >

                                                {savingNote ? (
                                                    <>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={15} />
                                                        Save Note
                                                    </>
                                                )}

                                            </button>

                                        </div>

                                    </div>

                                )}


                                {/* EXISTING NOTES */}

                                <div className="mt-5">

                                    {lead.notes?.trim() ? (

                                        <div
                                            className="
                                                relative
                                                rounded-2xl
                                                bg-amber-50/60
                                                border
                                                border-amber-100
                                                p-5
                                            "
                                        >

                                            <div
                                                className="
                                                    absolute
                                                    left-0
                                                    top-5
                                                    bottom-5
                                                    w-1
                                                    rounded-r-full
                                                    bg-amber-400
                                                "
                                            />

                                            <p className="pl-3 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                                                {lead.notes}
                                            </p>

                                        </div>

                                    ) : (

                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-dashed
                                                border-slate-200
                                                p-8
                                                text-center
                                            "
                                        >

                                            <FileText
                                                size={22}
                                                className="mx-auto text-slate-300"
                                            />

                                            <p className="text-sm font-medium text-slate-600 mt-3">
                                                No notes yet
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">
                                                Add the first note for this lead.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </section>


                        {/* ========================================= */}
                        {/* AI GENERATED CONTENT */}
                        {/* ========================================= */}

                        {(emailData ||
                            whatsAppData ||
                            callScript) && (

                                <section
                                    className="
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-3xl
                                    shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                                    overflow-hidden
                                "
                                >

                                    <div className="p-6 border-b border-slate-100">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                                                <Sparkles
                                                    size={18}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                            <div>

                                                <h2 className="font-semibold text-slate-900">
                                                    Generated Content
                                                </h2>

                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    AI-generated sales assistance
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="p-6 space-y-5">

                                        {emailData && (

                                            <div className="rounded-2xl border border-slate-200 overflow-hidden">

                                                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">

                                                    <Mail
                                                        size={17}
                                                        className="text-blue-600"
                                                    />

                                                    <div>

                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                                            Email
                                                        </p>

                                                        <h3 className="font-semibold text-slate-900 mt-0.5">
                                                            {emailData.subject}
                                                        </h3>

                                                    </div>

                                                </div>

                                                <div className="p-5 text-sm leading-7 text-slate-700">

                                                    <p className="font-semibold text-slate-900">
                                                        {emailData.greeting}
                                                    </p>

                                                    <p className="mt-4 whitespace-pre-wrap">
                                                        {emailData.body}
                                                    </p>

                                                    <p className="mt-4 font-medium text-slate-900">
                                                        {emailData.closing}
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {whatsAppData && (

                                            <div className="rounded-2xl border border-emerald-200 overflow-hidden">

                                                <div className="px-5 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-3">

                                                    <MessageSquare
                                                        size={17}
                                                        className="text-emerald-600"
                                                    />

                                                    <div>

                                                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                                                            WhatsApp
                                                        </p>

                                                        <h3 className="font-semibold text-slate-900 mt-0.5">
                                                            Follow-up message
                                                        </h3>

                                                    </div>

                                                </div>

                                                <div className="p-5">

                                                    <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                                                        {whatsAppData.message}
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {callScript && (

                                            <div className="rounded-2xl border border-violet-200 overflow-hidden">

                                                <div className="px-5 py-4 bg-violet-50/70 border-b border-violet-100 flex items-center gap-3">

                                                    <Phone
                                                        size={17}
                                                        className="text-violet-600"
                                                    />

                                                    <div>

                                                        <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                                                            Call Script
                                                        </p>

                                                        <h3 className="font-semibold text-slate-900 mt-0.5">
                                                            Sales conversation
                                                        </h3>

                                                    </div>

                                                </div>

                                                <div className="p-5">

                                                    <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                                                        {callScript.script}
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </section>

                            )}

                    </div>


                    {/* ============================================= */}
                    {/* RIGHT SIDEBAR */}
                    {/* ============================================= */}

                    <div className="space-y-6">


                        {/* ========================================= */}
                        {/* LEAD SNAPSHOT */}
                        {/* ========================================= */}

                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                            "
                        >

                            <div className="p-6">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                                        <UserRound
                                            size={18}
                                            className="text-slate-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="font-semibold text-slate-900">
                                            Lead Snapshot
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Current CRM information
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Status
                                        </span>

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                px-2.5
                                                py-1
                                                rounded-full
                                                border
                                                text-xs
                                                font-semibold
                                                ${statusStyle.badge}
                                            `}
                                        >

                                            <span
                                                className={`
                                                    w-1.5
                                                    h-1.5
                                                    rounded-full
                                                    ${statusStyle.dot}
                                                `}
                                            />

                                            {lead.status}

                                        </span>

                                    </div>


                                    <div className="h-px bg-slate-100" />


                                    <div className="flex items-center justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Source
                                        </span>

                                        <span className="text-sm font-medium text-slate-800 text-right">
                                            {lead.source || "—"}
                                        </span>

                                    </div>


                                    <div className="h-px bg-slate-100" />


                                    <div className="flex items-center justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Company
                                        </span>

                                        <span className="text-sm font-medium text-slate-800 text-right">
                                            {lead.company || "—"}
                                        </span>

                                    </div>


                                    <div className="h-px bg-slate-100" />


                                    <div className="flex items-center justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Created
                                        </span>

                                        <span className="text-sm font-medium text-slate-800">
                                            {formatDate(
                                                lead.created_at
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ========================================= */}
                        {/* AI ACTIONS */}
                        {/* ========================================= */}

                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                            "
                        >

                            <div className="p-6">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                                        <Sparkles
                                            size={18}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="font-semibold text-slate-900">
                                            AI Actions
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Generate sales content
                                        </p>

                                    </div>

                                </div>


                                <div className="space-y-2.5 mt-6">

                                    <button
                                        onClick={generateEmail}
                                        disabled={loadingEmail}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            hover:border-blue-200
                                            hover:bg-blue-50/50
                                            hover:text-blue-700
                                            transition
                                            disabled:opacity-60
                                        "
                                    >

                                        <span className="flex items-center gap-3">

                                            <Mail
                                                size={17}
                                                className="text-blue-600"
                                            />

                                            {loadingEmail
                                                ? "Generating..."
                                                : "Generate Email"}

                                        </span>

                                        <ArrowUpRight
                                            size={15}
                                            className="text-slate-300"
                                        />

                                    </button>


                                    <button
                                        onClick={generateWhatsApp}
                                        disabled={loadingWhatsApp}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            hover:border-emerald-200
                                            hover:bg-emerald-50/50
                                            hover:text-emerald-700
                                            transition
                                            disabled:opacity-60
                                        "
                                    >

                                        <span className="flex items-center gap-3">

                                            <MessageSquare
                                                size={17}
                                                className="text-emerald-600"
                                            />

                                            {loadingWhatsApp
                                                ? "Generating..."
                                                : "Generate WhatsApp"}

                                        </span>

                                        <ArrowUpRight
                                            size={15}
                                            className="text-slate-300"
                                        />

                                    </button>


                                    <button
                                        onClick={generateCallScript}
                                        disabled={loadingCallScript}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            hover:border-violet-200
                                            hover:bg-violet-50/50
                                            hover:text-violet-700
                                            transition
                                            disabled:opacity-60
                                        "
                                    >

                                        <span className="flex items-center gap-3">

                                            <Phone
                                                size={17}
                                                className="text-violet-600"
                                            />

                                            {loadingCallScript
                                                ? "Generating..."
                                                : "Generate Call Script"}

                                        </span>

                                        <ArrowUpRight
                                            size={15}
                                            className="text-slate-300"
                                        />

                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* ========================================= */}
                        {/* CONVERSION */}
                        {/* ========================================= */}

                        {lead.status !== "Converted" && (

                            <section
                                className="
                                    relative
                                    overflow-hidden
                                    bg-slate-900
                                    rounded-3xl
                                    shadow-[0_12px_35px_rgba(15,23,42,0.15)]
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-12
                                        -top-12
                                        w-32
                                        h-32
                                        rounded-full
                                        bg-blue-500/20
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        -left-12
                                        -bottom-16
                                        w-36
                                        h-36
                                        rounded-full
                                        bg-indigo-500/10
                                    "
                                />


                                <div className="relative p-6">

                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">

                                        <TrendingUp
                                            size={18}
                                            className="text-blue-300"
                                        />

                                    </div>


                                    <h2 className="font-semibold text-white mt-5">
                                        Ready to close?
                                    </h2>

                                    <p className="text-sm text-slate-400 leading-6 mt-2">
                                        Convert this lead into a sale when the deal is ready.
                                    </p>


                                    <button
                                        onClick={() =>
                                            setConvertModalOpen(true)
                                        }
                                        className="
                                            w-full
                                            mt-5
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-blue-600
                                            text-white
                                            text-sm
                                            font-semibold
                                            hover:bg-blue-500
                                            transition
                                        "
                                    >

                                        Convert to Sale

                                        <ArrowUpRight
                                            size={16}
                                        />

                                    </button>

                                </div>

                            </section>

                        )}


                        {/* ========================================= */}
                        {/* CONVERTED STATE */}
                        {/* ========================================= */}

                        {lead.status === "Converted" && (

                            <section
                                className="
                                    bg-emerald-50
                                    border
                                    border-emerald-200
                                    rounded-3xl
                                "
                            >

                                <div className="p-6">

                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">

                                        <CheckCircle2
                                            size={19}
                                            className="text-emerald-600"
                                        />

                                    </div>

                                    <h2 className="font-semibold text-emerald-900 mt-4">
                                        Lead Converted
                                    </h2>

                                    <p className="text-sm text-emerald-700 leading-6 mt-2">
                                        This lead has already been converted into a sale.
                                    </p>

                                </div>

                            </section>

                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* BOTTOM ACTION BAR */}
                {/* ================================================= */}

                <section
                    className="
                        sticky
                        bottom-4
                        z-30
                        mt-6
                        bg-white/95
                        backdrop-blur-xl
                        border
                        border-slate-200
                        rounded-2xl
                        shadow-[0_12px_40px_rgba(15,23,42,0.10)]
                        p-3
                    "
                >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div className="flex items-center gap-3 px-2">

                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">

                                <CircleUserRound
                                    size={16}
                                    className="text-blue-600"
                                />

                            </div>

                            <div className="hidden sm:block">

                                <p className="text-xs text-slate-400">
                                    Current lead
                                </p>

                                <p className="text-sm font-semibold text-slate-800 max-w-[220px] truncate">
                                    {lead.name}
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-2 flex-wrap">

                            <button
                                onClick={() =>
                                    setNoteOpen(true)
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3.5
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                    transition
                                "
                            >

                                <FileText size={15} />

                                Add Note

                            </button>


                            <button
                                onClick={() =>
                                    setEditOpen(true)
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3.5
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                    transition
                                "
                            >

                                <Pencil size={15} />

                                Edit

                            </button>


                            {lead.status !== "Converted" && (

                                <button
                                    onClick={() =>
                                        setConvertModalOpen(true)
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        bg-blue-600
                                        text-white
                                        text-sm
                                        font-semibold
                                        hover:bg-blue-700
                                        shadow-sm
                                        transition
                                    "
                                >

                                    <TrendingUp size={15} />

                                    Convert to Sale

                                </button>

                            )}

                        </div>

                    </div>

                </section>

            </div>


            {/* ==================================================== */}
            {/* EDIT MODAL */}
            {/* ==================================================== */}

            <AddLeadModal
                open={editOpen}
                setOpen={setEditOpen}
                fetchLeads={refreshLead}
                editingLead={lead}
            />


            {/* ==================================================== */}
            {/* CONVERT MODAL */}
            {/* ==================================================== */}

            <ConvertSaleModal
                open={convertModalOpen}
                setOpen={setConvertModalOpen}
                lead={lead}
                onSuccess={() => {
                    refreshLead();
                }}
            />


            {/* ==================================================== */}
            {/* DELETE CONFIRMATION */}
            {/* ==================================================== */}

            {deleteModalOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        bg-slate-950/40
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                    onClick={() =>
                        setDeleteModalOpen(false)
                    }
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            bg-white
                            rounded-3xl
                            shadow-2xl
                            border
                            border-slate-200
                            overflow-hidden
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="p-6">

                            <div className="flex items-start justify-between">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-red-50
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Trash2
                                        size={19}
                                        className="text-red-600"
                                    />

                                </div>


                                <button
                                    onClick={() =>
                                        setDeleteModalOpen(false)
                                    }
                                    className="
                                        w-9
                                        h-9
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-400
                                        hover:bg-slate-50
                                        hover:text-slate-700
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>


                            <h2 className="text-lg font-semibold text-slate-950 mt-5">
                                Delete this lead?
                            </h2>

                            <p className="text-sm text-slate-500 leading-6 mt-2">
                                You're about to permanently delete{" "}
                                <span className="font-semibold text-slate-700">
                                    {lead.name}
                                </span>
                                . This action cannot be undone.
                            </p>


                            <div className="flex justify-end gap-2 mt-7">

                                <button
                                    onClick={() =>
                                        setDeleteModalOpen(false)
                                    }
                                    className="
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={deleteLead}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        bg-red-600
                                        text-white
                                        text-sm
                                        font-semibold
                                        hover:bg-red-700
                                    "
                                >

                                    <Trash2 size={15} />

                                    Delete Lead

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}