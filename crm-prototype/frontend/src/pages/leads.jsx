import LeadTable from "../components/lead_table";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Filter,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Target,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import api from "../services/api";
import AddLeadModal from "../components/add_lead_model";

export default function Leads() {
    const [openModal, setOpenModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [sourceFilter, setSourceFilter] = useState("All Sources");

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await api.get("/leads");
            setLeads(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching leads:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = useMemo(() => {
        const query = search.trim().toLowerCase();

        return leads.filter((lead) => {
            const matchesSearch =
                !query ||
                (lead.name || "").toLowerCase().includes(query) ||
                (lead.company || "").toLowerCase().includes(query) ||
                (lead.email || "").toLowerCase().includes(query) ||
                (lead.phone || "").toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All Status" || lead.status === statusFilter;

            const matchesSource =
                sourceFilter === "All Sources" || lead.source === sourceFilter;

            return matchesSearch && matchesStatus && matchesSource;
        });
    }, [leads, search, statusFilter, sourceFilter]);

    const totalLeads = leads.length;
    const newLeads = leads.filter((lead) => lead.status === "New").length;
    const interestedLeads = leads.filter(
        (lead) => lead.status === "Interested"
    ).length;
    const followUpLeads = leads.filter(
        (lead) => lead.status === "Follow Up"
    ).length;
    const convertedLeads = leads.filter(
        (lead) => lead.status === "Converted"
    ).length;

    const activeLeads = totalLeads - convertedLeads;
    const conversionRate = totalLeads
        ? Math.round((convertedLeads / totalLeads) * 100)
        : 0;

    const sources = [
        ...new Set(
            leads.map((lead) => lead.source).filter(Boolean)
        ),
    ];

    const hasFilters =
        search.trim() ||
        statusFilter !== "All Status" ||
        sourceFilter !== "All Sources";

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All Status");
        setSourceFilter("All Sources");
    };

    const selectStatus = (status) => {
        setStatusFilter(status);
        setSearch("");
    };

    return (
        <div className="min-h-full bg-slate-50">
            <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                {/* ===================================================== */}
                {/* HEADER */}
                {/* ===================================================== */}
                <section className="mb-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                <Sparkles size={13} />
                                Sales Pipeline
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Leads
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Manage prospects, track engagement, and move opportunities toward conversion.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={fetchLeads}
                                disabled={loading}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={() => setOpenModal(true)}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 active:scale-[0.99]"
                            >
                                <Plus size={18} />
                                Add Lead
                            </button>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/* OVERVIEW */}
                {/* ===================================================== */}
                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <button
                        type="button"
                        onClick={() => selectStatus("All Status")}
                        className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusFilter === "All Status" && !search && sourceFilter === "All Sources"
                            ? "border-blue-200 ring-2 ring-blue-50"
                            : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Users size={19} />
                            </div>
                            <ArrowUpRight
                                size={17}
                                className="text-slate-300 transition group-hover:text-blue-500"
                            />
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">
                            Total Leads
                        </p>
                        <div className="mt-1 flex items-end justify-between gap-3">
                            <p className="text-3xl font-bold tracking-tight text-slate-950">
                                {totalLeads}
                            </p>
                            <span className="text-xs font-semibold text-slate-400">
                                {activeLeads} active
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => selectStatus("New")}
                        className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusFilter === "New"
                            ? "border-blue-200 ring-2 ring-blue-50"
                            : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                <UserPlus size={19} />
                            </div>
                            <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-600">
                                NEW
                            </span>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">
                            New Leads
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-sky-600">
                            {newLeads}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => selectStatus("Interested")}
                        className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusFilter === "Interested"
                            ? "border-emerald-200 ring-2 ring-emerald-50"
                            : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Target size={19} />
                            </div>
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
                                HOT
                            </span>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">
                            Interested
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">
                            {interestedLeads}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => selectStatus("Follow Up")}
                        className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusFilter === "Follow Up"
                            ? "border-amber-200 ring-2 ring-amber-50"
                            : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <RefreshCw size={19} />
                            </div>
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-600">
                                FOLLOW UP
                            </span>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">
                            Follow Up
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-amber-600">
                            {followUpLeads}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => selectStatus("Converted")}
                        className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusFilter === "Converted"
                            ? "border-violet-200 ring-2 ring-violet-50"
                            : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <CheckCircle2 size={19} />
                            </div>
                            <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-600">
                                {conversionRate}%
                            </span>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">
                            Converted
                        </p>
                        <div className="mt-1 flex items-end justify-between gap-3">
                            <p className="text-3xl font-bold tracking-tight text-violet-600">
                                {convertedLeads}
                            </p>
                            <span className="text-xs font-semibold text-slate-400">
                                conversion rate
                            </span>
                        </div>
                    </button>
                </section>

                {/* ===================================================== */}
                {/* SEARCH / FILTER TOOLBAR */}
                {/* ===================================================== */}
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search by name, company, email or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-[180px]">
                                <Filter
                                    size={15}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                >
                                    <option value="All Status">All Status</option>
                                    <option value="New">New</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Follow Up">Follow Up</option>
                                    <option value="Converted">Converted</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>

                            <div className="relative min-w-[180px]">
                                <select
                                    value={sourceFilter}
                                    onChange={(e) => setSourceFilter(e.target.value)}
                                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                >
                                    <option value="All Sources">All Sources</option>
                                    {sources.map((source) => (
                                        <option key={source} value={source}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <X size={15} />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="font-semibold text-slate-800">
                                {filteredLeads.length}
                            </span>
                            {filteredLeads.length === 1 ? "lead" : "leads"} shown
                            {hasFilters && (
                                <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                                    Filters active
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            CRM data synced
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/* LEADS TABLE */}
                {/* ===================================================== */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Lead Pipeline
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Review and manage every prospect in your CRM.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                {totalLeads} total
                            </span>
                            <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 text-emerald-600">
                                <CheckCircle2 size={12} />
                                {convertedLeads} converted
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((row) => (
                                    <div
                                        key={row}
                                        className="h-16 animate-pulse rounded-xl bg-slate-100"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Users size={24} />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                No leads found
                            </h3>
                            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                                Try changing your search or filters, or create a new lead to start building your pipeline.
                            </p>
                            <div className="mt-5 flex justify-center gap-2">
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Clear filters
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Lead
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <LeadTable
                                leads={filteredLeads}
                                fetchLeads={fetchLeads}
                            />
                        </div>
                    )}
                </section>

                <p className="mt-4 text-center text-xs text-slate-400">
                    Click a lead to open its full profile and CRM activity.
                </p>
            </div>

            <AddLeadModal
                open={openModal}
                setOpen={setOpenModal}
                fetchLeads={fetchLeads}
            />
        </div>
    );
}
