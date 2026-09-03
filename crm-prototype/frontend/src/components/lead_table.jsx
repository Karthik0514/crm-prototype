import {
    Eye,
    CheckCircle,
    Building2,
    Mail,
    Phone,
    UserRound,
    ArrowUpRight,
    X,
    IndianRupee,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const statusStyles = {
    New: {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
    },
    Interested: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
    },
    "Follow Up": {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
    },
    Converted: {
        badge: "bg-violet-50 text-violet-700 border-violet-200",
        dot: "bg-violet-500",
    },
};


function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "?";
}


function getAvatarStyle(name = "") {
    const styles = [
        "bg-blue-50 text-blue-700 border-blue-100",
        "bg-emerald-50 text-emerald-700 border-emerald-100",
        "bg-violet-50 text-violet-700 border-violet-100",
        "bg-amber-50 text-amber-700 border-amber-100",
        "bg-cyan-50 text-cyan-700 border-cyan-100",
    ];

    const index = [...name].reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0
    ) % styles.length;

    return styles[index];
}


export default function LeadTable({
    leads,
    fetchLeads
}) {

    const navigate = useNavigate();

    const [selectedLead, setSelectedLead] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);


    const openConvertModal = (lead) => {
        setSelectedLead(lead);
        setAmount("");
    };


    const closeConvertModal = () => {
        if (loading) return;

        setSelectedLead(null);
        setAmount("");
    };


    const convertToSale = async () => {

        if (!selectedLead) {
            return;
        }

        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid sale amount.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                `/leads/${selectedLead.id}/convert`,
                {
                    amount: Number(amount)
                }
            );

            alert("Lead converted to sale successfully!");

            closeConvertModal();

            if (fetchLeads) {
                fetchLeads();
            }

        } catch (error) {

            console.error(
                "Error converting lead:",
                error
            );

            alert(
                error.response?.data?.error
                ||
                "Failed to convert lead to sale."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <section className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            ">

                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto md:block">

                    <table className="w-full min-w-[850px]">

                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Lead
                                </th>

                                <th className="
                                    px-4
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Company
                                </th>

                                <th className="
                                    px-4
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Contact
                                </th>

                                <th className="
                                    px-4
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Source
                                </th>

                                <th className="
                                    px-4
                                    py-4
                                    text-left
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Status
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-right
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-slate-400
                                ">
                                    Actions
                                </th>

                            </tr>
                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {(leads || []).map((lead) => {

                                const status =
                                    statusStyles[lead.status]
                                    || {
                                        badge: "bg-slate-50 text-slate-700 border-slate-200",
                                        dot: "bg-slate-400",
                                    };

                                return (
                                    <tr
                                        key={lead.id}
                                        className="
                                            group
                                            transition-colors
                                            hover:bg-slate-50/70
                                        "
                                    >

                                        {/* LEAD */}
                                        <td className="px-6 py-4">

                                            <button
                                                onClick={() => navigate(`/lead/${lead.id}`)}
                                                className="
                                                    cursor-pointer
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-left
                                                    group/name
                                                "
                                            >

                                                <div className={`
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    border
                                                    text-sm
                                                    font-bold
                                                    ${getAvatarStyle(lead.name)}
                                                `}>
                                                    {getInitials(lead.name)}
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-slate-900
                                                        group-hover/name:text-blue-600
                                                        transition-colors
                                                    ">
                                                        {lead.name || "Unnamed Lead"}
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        max-w-[220px]
                                                        truncate
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        {lead.email || "No email provided"}
                                                    </p>

                                                </div>

                                            </button>

                                        </td>


                                        {/* COMPANY */}
                                        <td className="px-4 py-4">

                                            <div className="flex items-center gap-2.5">

                                                <div className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-slate-100
                                                    text-slate-500
                                                ">
                                                    <Building2 size={15} />
                                                </div>

                                                <span className="
                                                    max-w-[190px]
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {lead.company || "—"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* CONTACT */}
                                        <td className="px-4 py-4">

                                            <div className="space-y-1.5">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-slate-600
                                                ">
                                                    <Phone size={13} className="text-slate-400" />
                                                    <span>{lead.phone || "—"}</span>
                                                </div>

                                                {lead.email && (
                                                    <div className="
                                                        flex
                                                        max-w-[180px]
                                                        items-center
                                                        gap-2
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        <Mail size={13} />
                                                        <span className="truncate">
                                                            {lead.email}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>

                                        </td>


                                        {/* SOURCE */}
                                        <td className="px-4 py-4">

                                            <span className="
                                                inline-flex
                                                max-w-[150px]
                                                items-center
                                                truncate
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                px-2.5
                                                py-1.5
                                                text-xs
                                                font-medium
                                                text-slate-600
                                            ">
                                                {lead.source || "Unknown"}
                                            </span>

                                        </td>


                                        {/* STATUS */}
                                        <td className="px-4 py-4">

                                            <span className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                border
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                ${status.badge}
                                            `}>
                                                <span className={`
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    ${status.dot}
                                                `} />
                                                {lead.status || "Unknown"}
                                            </span>

                                        </td>


                                        {/* ACTIONS */}
                                        <td className="px-6 py-4">

                                            <div className="
                                                flex
                                                items-center
                                                justify-end
                                                gap-1.5
                                            ">

                                                <button
                                                    onClick={() => navigate(`/lead/${lead.id}`)}
                                                    className="
                                                        cursor-pointer
                                                        inline-flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        border
                                                        border-transparent
                                                        text-slate-400
                                                        transition
                                                        hover:border-blue-100
                                                        hover:bg-blue-50
                                                        hover:text-blue-600
                                                    "
                                                    title="View lead"
                                                    aria-label={`View ${lead.name || "lead"}`}
                                                >
                                                    <Eye size={17} />
                                                </button>


                                                {lead.status !== "Converted" && (
                                                    <button
                                                        onClick={() => openConvertModal(lead)}
                                                        className="
                                                        cursor-pointer
                                                            inline-flex
                                                            h-9
                                                            items-center
                                                            gap-1.5
                                                            rounded-xl
                                                            border
                                                            border-emerald-100
                                                            bg-emerald-50
                                                            px-3
                                                            text-xs
                                                            font-semibold
                                                            text-emerald-700
                                                            transition
                                                            hover:border-emerald-200
                                                            hover:bg-emerald-100
                                                        "
                                                        title="Convert to Sale"
                                                    >
                                                        <CheckCircle size={15} />
                                                        Convert
                                                    </button>
                                                )}



                                            </div>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE CARDS */}
                <div className="divide-y divide-slate-100 md:hidden">

                    {(leads || []).map((lead) => {

                        const status =
                            statusStyles[lead.status]
                            || {
                                badge: "bg-slate-50 text-slate-700 border-slate-200",
                                dot: "bg-slate-400",
                            };

                        return (
                            <div
                                key={lead.id}
                                className="p-5"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <button
                                        onClick={() => navigate(`/lead/${lead.id}`)}
                                        className="cursor-pointer flex min-w-0 items-center gap-3 text-left"
                                    >

                                        <div className={`
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            text-sm
                                            font-bold
                                            ${getAvatarStyle(lead.name)}
                                        `}>
                                            {getInitials(lead.name)}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {lead.name || "Unnamed Lead"}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {lead.company || "No company"}
                                            </p>
                                        </div>

                                    </button>

                                    <span className={`
                                        inline-flex
                                        shrink-0
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        px-2.5
                                        py-1.5
                                        text-[11px]
                                        font-semibold
                                        ${status.badge}
                                    `}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                        {lead.status || "Unknown"}
                                    </span>

                                </div>


                                <div className="
                                    mt-4
                                    grid
                                    grid-cols-1
                                    gap-2
                                    rounded-2xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Phone size={13} className="text-slate-400" />
                                        {lead.phone || "No phone"}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Mail size={13} className="text-slate-400" />
                                        <span className="truncate">
                                            {lead.email || "No email"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Building2 size={13} className="text-slate-400" />
                                        <span className="truncate">
                                            {lead.source || "Unknown source"}
                                        </span>
                                    </div>

                                </div>


                                <div className="mt-4 flex gap-2">

                                    <button
                                        onClick={() => navigate(`/lead/${lead.id}`)}
                                        className="
                                            cursor-pointer
                                            inline-flex
                                            flex-1
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-slate-700
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >
                                        <Eye size={15} />
                                        View Lead
                                    </button>

                                    {lead.status !== "Converted" && (
                                        <button
                                            onClick={() => openConvertModal(lead)}
                                            className="
                                                cursor-pointer
                                                inline-flex
                                                flex-1
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-emerald-600
                                                px-3
                                                py-2.5
                                                text-xs
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-emerald-700
                                            "
                                        >
                                            <CheckCircle size={15} />
                                            Convert
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* EMPTY STATE */}
                {(!leads || leads.length === 0) && (
                    <div className="px-6 py-16 text-center">

                        <div className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-slate-100
                            text-slate-400
                        ">
                            <UserRound size={24} />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-800">
                            No leads found
                        </h3>

                        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                            Try adjusting your search or filters, or add a new lead to your CRM.
                        </p>

                    </div>
                )}

            </section>


            {/* CONVERT TO SALE MODAL */}
            {selectedLead && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-slate-950/50
                        p-4
                        backdrop-blur-sm
                    "
                    onClick={closeConvertModal}
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-2xl
                        "
                        onClick={(event) => event.stopPropagation()}
                    >

                        <div className="
                            flex
                            items-start
                            justify-between
                            border-b
                            border-slate-100
                            px-6
                            py-5
                        ">

                            <div className="flex items-center gap-3">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-emerald-50
                                    text-emerald-600
                                ">
                                    <CheckCircle size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">
                                        Convert to Sale
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Confirm this lead as a customer.
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={closeConvertModal}
                                disabled={loading}
                                className="
                                    cursor-pointer
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="p-6">

                            <div className="
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-slate-100
                                bg-slate-50
                                p-4
                            ">

                                <div className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    text-xs
                                    font-bold
                                    ${getAvatarStyle(selectedLead.name)}
                                `}>
                                    {getInitials(selectedLead.name)}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {selectedLead.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                        {selectedLead.company || "No company"}
                                    </p>
                                </div>

                            </div>


                            <div className="mt-6">

                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                ">
                                    Confirmed Sale Amount
                                </label>

                                <div className="relative">

                                    <IndianRupee
                                        size={17}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter sale amount"
                                        autoFocus
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            py-3.5
                                            pl-11
                                            pr-4
                                            text-sm
                                            font-medium
                                            text-slate-900
                                            outline-none
                                            transition
                                            placeholder:text-slate-400
                                            focus:border-emerald-400
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-emerald-50
                                        "
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    This will mark the lead as Converted and create the sale record.
                                </p>

                            </div>

                        </div>


                        <div className="
                            flex
                            justify-end
                            gap-2
                            border-t
                            border-slate-100
                            bg-slate-50
                            px-6
                            py-4
                        ">

                            <button
                                onClick={closeConvertModal}
                                disabled={loading}
                                className="
                                    cursor-pointer
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={convertToSale}
                                disabled={loading}
                                className="
                                    cursor-pointer
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-emerald-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-emerald-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <CheckCircle size={16} />
                                {loading ? "Converting..." : "Confirm Sale"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}
