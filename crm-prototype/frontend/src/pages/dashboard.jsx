import { useEffect, useMemo, useState } from "react";

import {
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronRight,
    Clock3,
    DollarSign,
    Plus,
    Target,
    TrendingUp,
    Users,
    WalletCards,
} from "lucide-react";

import api from "../services/api";


/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(value) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

}


function getInitials(name = "") {

    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("")
        || "?"
    );

}


function getAvatarStyle(name = "") {

    const styles = [
        "bg-blue-50 text-blue-700 border-blue-100",
        "bg-emerald-50 text-emerald-700 border-emerald-100",
        "bg-violet-50 text-violet-700 border-violet-100",
        "bg-amber-50 text-amber-700 border-amber-100",
        "bg-cyan-50 text-cyan-700 border-cyan-100",
    ];

    const index =
        [...name].reduce(
            (sum, char) =>
                sum + char.charCodeAt(0),
            0
        ) % styles.length;

    return styles[index];

}


function getStatusStyle(status) {

    const styles = {

        New:
            "bg-blue-50 text-blue-700 ring-blue-100",

        Interested:
            "bg-emerald-50 text-emerald-700 ring-emerald-100",

        "Follow Up":
            "bg-amber-50 text-amber-700 ring-amber-100",

        Converted:
            "bg-violet-50 text-violet-700 ring-violet-100",

    };

    return (
        styles[status]
        || "bg-slate-50 text-slate-600 ring-slate-100"
    );

}


/* ============================================================
   KPI CARD
============================================================ */

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
}) {

    return (

        <div className="
            group
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            transition
            duration-200
            hover:-translate-y-0.5
            hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]
        ">

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div>

                    <p className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-slate-400
                    ">
                        {title}
                    </p>

                    <p className="
                        mt-3
                        text-3xl
                        font-bold
                        tracking-tight
                        text-slate-950
                    ">
                        {value}
                    </p>

                    <p className="
                        mt-2
                        text-xs
                        text-slate-400
                    ">
                        {subtitle}
                    </p>

                </div>


                <div className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    ${iconClass}
                `}>

                    <Icon
                        size={19}
                        strokeWidth={2}
                    />

                </div>

            </div>

        </div>

    );

}


/* ============================================================
   DASHBOARD
============================================================ */

export default function Dashboard() {

    const [leads, setLeads] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);


    /* ========================================================
       USER
    ======================================================== */

    const storedUser =
        localStorage.getItem("user");

    let user = null;

    try {

        user =
            storedUser
                ? JSON.parse(storedUser)
                : null;

    } catch {

        user = null;

    }


    /* ========================================================
       FETCH DASHBOARD DATA
    ======================================================== */

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            const [
                leadsResponse,
                salesResponse,
            ] = await Promise.all([

                api.get("/leads"),

                api.get("/sales"),

            ]);


            setLeads(
                Array.isArray(leadsResponse.data)
                    ? leadsResponse.data
                    : []
            );


            setSales(
                Array.isArray(salesResponse.data)
                    ? salesResponse.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );


            /* ---------------------------------------------
               FALLBACK TO LEADS
            --------------------------------------------- */

            try {

                const response =
                    await api.get("/leads");

                setLeads(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (leadError) {

                console.error(
                    "Failed to load leads:",
                    leadError
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboard();


        const interval =
            setInterval(
                fetchDashboard,
                15000
            );


        return () =>
            clearInterval(interval);

    }, []);


    /* ========================================================
       LEAD METRICS
    ======================================================== */

    const totalLeads =
        leads.length;


    const newLeads =
        leads.filter(
            (lead) =>
                lead.status === "New"
        ).length;


    const interested =
        leads.filter(
            (lead) =>
                lead.status === "Interested"
        ).length;


    const followUps =
        leads.filter(
            (lead) =>
                lead.status === "Follow Up"
        ).length;


    const converted =
        leads.filter(
            (lead) =>
                lead.status === "Converted"
        ).length;


    const conversionRate =
        totalLeads === 0
            ? 0
            : Math.round(
                (converted /
                    totalLeads) *
                100
            );


    /* ========================================================
       SALES METRICS
    ======================================================== */

    const totalRevenue =
        useMemo(
            () =>
                sales.reduce(
                    (
                        total,
                        sale
                    ) =>
                        total +
                        Number(
                            sale.sale_amount ||
                            0
                        ),
                    0
                ),
            [sales]
        );


    const totalPaid =
        useMemo(
            () =>
                sales.reduce(
                    (
                        total,
                        sale
                    ) =>
                        total +
                        Number(
                            sale.amount_paid ||
                            0
                        ),
                    0
                ),
            [sales]
        );


    const outstanding =
        Math.max(
            totalRevenue -
            totalPaid,
            0
        );


    const pendingPayments =
        sales.filter(
            (sale) =>
                sale.payment_status ===
                "Pending"
                ||
                sale.payment_status ===
                "Partial"
                ||
                sale.payment_status ===
                "Overdue"
        ).length;


    const collectionRate =
        totalRevenue === 0
            ? 0
            : Math.min(
                Math.round(
                    (totalPaid /
                        totalRevenue) *
                    100
                ),
                100
            );


    /* ========================================================
       PIPELINE
    ======================================================== */

    const pipeline = [

        {
            label: "New",
            count: newLeads,
            percent:
                totalLeads
                    ? Math.round(
                        (newLeads /
                            totalLeads) *
                        100
                    )
                    : 0,
            icon: Users,
            bar: "bg-blue-500",
            text: "text-blue-600",
            bg: "bg-blue-50",
        },

        {
            label: "Interested",
            count: interested,
            percent:
                totalLeads
                    ? Math.round(
                        (interested /
                            totalLeads) *
                        100
                    )
                    : 0,
            icon: Target,
            bar: "bg-emerald-500",
            text: "text-emerald-600",
            bg: "bg-emerald-50",
        },

        {
            label: "Follow Up",
            count: followUps,
            percent:
                totalLeads
                    ? Math.round(
                        (followUps /
                            totalLeads) *
                        100
                    )
                    : 0,
            icon: Clock3,
            bar: "bg-amber-500",
            text: "text-amber-600",
            bg: "bg-amber-50",
        },

        {
            label: "Converted",
            count: converted,
            percent:
                totalLeads
                    ? Math.round(
                        (converted /
                            totalLeads) *
                        100
                    )
                    : 0,
            icon: CheckCircle2,
            bar: "bg-violet-500",
            text: "text-violet-600",
            bg: "bg-violet-50",
        },

    ];


    /* ========================================================
       RECENT LEADS
    ======================================================== */

    const recentLeads =
        [...leads]
            .sort(
                (a, b) =>
                    Number(b.id || 0) -
                    Number(a.id || 0)
            )
            .slice(0, 6);


    /* ========================================================
       LEAD SOURCES
    ======================================================== */

    const sourceStats =
        useMemo(() => {

            const stats = {};

            leads.forEach(
                (lead) => {

                    const source =
                        lead.source?.trim()
                        || "Unknown";


                    if (!stats[source]) {

                        stats[source] = 0;

                    }


                    stats[source] += 1;

                }
            );


            return Object.entries(
                stats
            )
                .sort(
                    (
                        [, a],
                        [, b]
                    ) => b - a
                )
                .slice(0, 5);

        }, [leads]);


    const maxSourceCount =
        sourceStats.length
            ? Math.max(
                ...sourceStats.map(
                    ([, count]) =>
                        count
                )
            )
            : 1;


    /* ========================================================
       GREETING
    ======================================================== */

    const hour =
        new Date().getHours();


    let greeting =
        "Good Evening";


    if (
        hour >= 5 &&
        hour < 12
    ) {

        greeting =
            "Good Morning";

    } else if (
        hour >= 12 &&
        hour < 17
    ) {

        greeting =
            "Good Afternoon";

    }


    const userName =
        user?.name
            ?.split(" ")[0]
        || "there";


    /* ========================================================
       PAGE
    ======================================================== */

    return (

        <div className="
            min-h-full
            w-full
        ">

            <div className="
                mx-auto
                w-full
                max-w-[1500px]
                space-y-6
            ">


                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    bg-slate-950
                    px-6
                    py-7
                    text-white
                    shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                    sm:px-8
                    sm:py-8
                ">


                    {/* DECORATION */}

                    {/* HERO DECORATION */}

                    <div
                        className="
        pointer-events-none
        absolute
        -right-20
        -top-28
        h-72
        w-72
        rounded-full
        bg-blue-500/20
        blur-3xl
    "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-36
        right-40
        h-72
        w-72
        rounded-full
        bg-violet-500/10
        blur-3xl
    "
                    />

                    <div className="
                        relative
                        flex
                        flex-col
                        justify-between
                        gap-7
                        lg:flex-row
                        lg:items-center
                    ">


                        <div>

                            <div className="
                                mb-3
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-blue-200
                            ">

                                <span className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-400
                                " />

                                CRM Overview

                            </div>


                            <h1 className="
                                text-3xl
                                font-bold
                                tracking-tight
                                sm:text-4xl
                            ">

                                {greeting},{" "}
                                {userName}

                            </h1>


                            <p className="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-300
                            ">

                                Here's your sales
                                command center.
                                Track your pipeline,
                                customers, and revenue
                                from one place.

                            </p>

                        </div>


                        {/* HERO ACTIONS */}

                        <div className="
                            flex
                            shrink-0
                            flex-wrap
                            gap-3
                        ">


                            <a
                                href="/leads"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/10
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    backdrop-blur
                                    transition
                                    hover:bg-white/15
                                "
                            >

                                <Users size={17} />

                                View Leads

                            </a>


                            <a
                                href="/leads"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    bg-blue-600
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-900/20
                                    transition
                                    hover:bg-blue-500
                                "
                            >

                                <Plus size={17} />

                                Add Lead

                            </a>

                        </div>

                    </div>


                    {/* HERO SNAPSHOT */}

                    <div className="
                        relative
                        mt-7
                        grid
                        grid-cols-2
                        gap-3
                        border-t
                        border-white/10
                        pt-5
                        sm:grid-cols-4
                    ">


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                            ">
                                Pipeline
                            </p>

                            <p className="
                                mt-1
                                text-xl
                                font-bold
                            ">
                                {totalLeads}
                            </p>

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                            ">
                                Conversion
                            </p>

                            <p className="
                                mt-1
                                text-xl
                                font-bold
                            ">
                                {conversionRate}%
                            </p>

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                            ">
                                Revenue
                            </p>

                            <p className="
                                mt-1
                                text-xl
                                font-bold
                            ">
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </p>

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                            ">
                                Collected
                            </p>

                            <p className="
                                mt-1
                                text-xl
                                font-bold
                            ">
                                {formatCurrency(
                                    totalPaid
                                )}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* KPI CARDS */}
                {/* ================================================= */}

                <section className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                ">


                    <StatCard
                        title="Total Leads"
                        value={totalLeads}
                        subtitle={`${newLeads} new prospects`}
                        icon={Users}
                        iconClass="
                            bg-blue-50
                            text-blue-600
                        "
                    />


                    <StatCard
                        title="Interested"
                        value={interested}
                        subtitle={`${followUps} need follow-up`}
                        icon={Target}
                        iconClass="
                            bg-emerald-50
                            text-emerald-600
                        "
                    />


                    <StatCard
                        title="Converted"
                        value={converted}
                        subtitle={`${conversionRate}% conversion rate`}
                        icon={CheckCircle2}
                        iconClass="
                            bg-violet-50
                            text-violet-600
                        "
                    />


                    <StatCard
                        title="Revenue"
                        value={formatCurrency(
                            totalRevenue
                        )}
                        subtitle={`${formatCurrency(
                            outstanding
                        )} outstanding`}
                        icon={DollarSign}
                        iconClass="
                            bg-amber-50
                            text-amber-600
                        "
                    />

                </section>


                {/* ================================================= */}
                {/* PIPELINE + REVENUE */}
                {/* ================================================= */}

                <section className="
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-5
                ">


                    {/* PIPELINE */}

                    <div className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                        xl:col-span-3
                    ">


                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                ">
                                    Sales Pipeline
                                </p>

                                <h2 className="
                                    mt-1
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Lead journey
                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                ">
                                    See where your prospects
                                    are right now.
                                </p>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-slate-50
                                text-slate-500
                            ">
                                <TrendingUp size={18} />
                            </div>

                        </div>


                        <div className="
                            mt-7
                            space-y-5
                        ">

                            {pipeline.map(
                                (stage) => {

                                    const Icon =
                                        stage.icon;


                                    return (

                                        <div
                                            key={stage.label}
                                        >

                                            <div className="
                                                mb-2
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            ">


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className={`
                                                        flex
                                                        h-8
                                                        w-8
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${stage.bg}
                                                        ${stage.text}
                                                    `}>
                                                        <Icon
                                                            size={15}
                                                        />
                                                    </div>


                                                    <span className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                    ">
                                                        {stage.label}
                                                    </span>

                                                </div>


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <span className="
                                                        text-sm
                                                        font-bold
                                                        text-slate-800
                                                    ">
                                                        {stage.count}
                                                    </span>

                                                    <span className="
                                                        text-[10px]
                                                        font-medium
                                                        text-slate-400
                                                    ">
                                                        {stage.percent}%
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="
                                                h-2
                                                overflow-hidden
                                                rounded-full
                                                bg-slate-100
                                            ">

                                                <div
                                                    className={`
                                                        h-full
                                                        rounded-full
                                                        transition-all
                                                        duration-700
                                                        ${stage.bar}
                                                    `}
                                                    style={{
                                                        width:
                                                            `${stage.percent}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>


                        {/* PIPELINE FOOTER */}

                        <div className="
                            mt-7
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-2xl
                            bg-slate-50
                            px-4
                            py-3
                        ">


                            <div className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-slate-500
                                ">
                                    <BriefcaseBusiness
                                        size={15}
                                    />
                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                    ">
                                        {sales.length}{" "}
                                        sale
                                        {sales.length === 1
                                            ? ""
                                            : "s"}{" "}
                                        recorded
                                    </p>

                                    <p className="
                                        mt-0.5
                                        truncate
                                        text-[10px]
                                        text-slate-400
                                    ">
                                        {pendingPayments}{" "}
                                        payment
                                        {pendingPayments === 1
                                            ? ""
                                            : "s"}{" "}
                                        requiring attention
                                    </p>

                                </div>

                            </div>


                            <a
                                href="/sales"
                                className="
                                    inline-flex
                                    shrink-0
                                    items-center
                                    gap-1
                                    text-xs
                                    font-bold
                                    text-blue-600
                                    hover:text-blue-700
                                "
                            >
                                View sales
                                <ArrowUpRight
                                    size={14}
                                />
                            </a>

                        </div>

                    </div>


                    {/* REVENUE */}

                    <div className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                        xl:col-span-2
                    ">


                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                ">
                                    Revenue
                                </p>

                                <h2 className="
                                    mt-1
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Financial snapshot
                                </h2>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                            ">
                                <WalletCards size={18} />
                            </div>

                        </div>


                        <div className="
                            mt-7
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50
                            p-5
                        ">

                            <p className="
                                text-xs
                                font-medium
                                text-slate-400
                            ">
                                Total sales value
                            </p>


                            <p className="
                                mt-1
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-950
                            ">
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </p>


                            <div className="mt-5">

                                <div className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    text-[11px]
                                ">

                                    <span className="
                                        font-semibold
                                        text-slate-600
                                    ">
                                        Collected
                                    </span>

                                    <span className="
                                        font-bold
                                        text-emerald-600
                                    ">
                                        {collectionRate}%
                                    </span>

                                </div>


                                <div className="
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-200
                                ">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-emerald-500
                                            transition-all
                                            duration-700
                                        "
                                        style={{
                                            width:
                                                `${collectionRate}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-3
                        ">


                            <div className="
                                rounded-2xl
                                border
                                border-slate-100
                                p-4
                            ">

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                ">
                                    Collected
                                </p>

                                <p className="
                                    mt-2
                                    text-lg
                                    font-bold
                                    text-emerald-600
                                ">
                                    {formatCurrency(
                                        totalPaid
                                    )}
                                </p>

                            </div>


                            <div className="
                                rounded-2xl
                                border
                                border-slate-100
                                p-4
                            ">

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                ">
                                    Outstanding
                                </p>

                                <p className="
                                    mt-2
                                    text-lg
                                    font-bold
                                    text-amber-600
                                ">
                                    {formatCurrency(
                                        outstanding
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* RECENT LEADS + SOURCES */}
                {/* ================================================= */}

                <section className="
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-3
                ">


                    {/* RECENT LEADS */}

                    <div className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                        xl:col-span-2
                    ">


                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-100
                            px-6
                            py-5
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                ">
                                    Activity
                                </p>

                                <h2 className="
                                    mt-1
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Recent leads
                                </h2>

                            </div>


                            <a
                                href="/leads"
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-bold
                                    text-blue-600
                                    hover:text-blue-700
                                "
                            >
                                View all
                                <ChevronRight
                                    size={14}
                                />
                            </a>

                        </div>


                        {recentLeads.length === 0 ? (

                            <div className="
                                px-6
                                py-14
                                text-center
                            ">

                                <div className="
                                    mx-auto
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-slate-50
                                    text-slate-400
                                ">
                                    <Users size={20} />
                                </div>


                                <h3 className="
                                    mt-4
                                    text-sm
                                    font-bold
                                    text-slate-700
                                ">
                                    No leads yet
                                </h3>


                                <p className="
                                    mx-auto
                                    mt-1
                                    max-w-xs
                                    text-xs
                                    leading-5
                                    text-slate-400
                                ">
                                    Add your first lead
                                    to start building
                                    your sales pipeline.
                                </p>

                            </div>

                        ) : (

                            <div className="
                                divide-y
                                divide-slate-100
                            ">

                                {recentLeads.map(
                                    (lead) => (

                                        <a
                                            key={lead.id}
                                            href={`/lead/${lead.id}`}
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                                px-6
                                                py-4
                                                transition
                                                hover:bg-slate-50
                                            "
                                        >


                                            <div className={`
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                text-[11px]
                                                font-bold
                                                ${getAvatarStyle(
                                                lead.name
                                            )}
                                            `}>
                                                {getInitials(
                                                    lead.name
                                                )}
                                            </div>


                                            <div className="
                                                min-w-0
                                                flex-1
                                            ">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-slate-800
                                                ">
                                                    {lead.name ||
                                                        "Unnamed Lead"}
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    truncate
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    {lead.company ||
                                                        "No company"}
                                                </p>

                                            </div>


                                            <div className="
                                                hidden
                                                sm:block
                                            ">

                                                <span className={`
                                                    inline-flex
                                                    rounded-full
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-bold
                                                    ring-1
                                                    ring-inset
                                                    ${getStatusStyle(
                                                    lead.status
                                                )}
                                                `}>
                                                    {lead.status ||
                                                        "Unknown"}
                                                </span>

                                            </div>


                                            <ChevronRight
                                                size={16}
                                                className="
                                                    shrink-0
                                                    text-slate-300
                                                "
                                            />

                                        </a>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* SOURCES */}

                    <div className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                    ">


                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                ">
                                    Acquisition
                                </p>

                                <h2 className="
                                    mt-1
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Lead sources
                                </h2>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-50
                                text-blue-600
                            ">
                                <Users size={18} />
                            </div>

                        </div>


                        {sourceStats.length === 0 ? (

                            <div className="
                                py-12
                                text-center
                                text-xs
                                text-slate-400
                            ">
                                No source data yet.
                            </div>

                        ) : (

                            <div className="
                                mt-7
                                space-y-5
                            ">

                                {sourceStats.map(
                                    (
                                        [
                                            source,
                                            count,
                                        ],
                                        index
                                    ) => (

                                        <div
                                            key={source}
                                        >

                                            <div className="
                                                mb-2
                                                flex
                                                items-center
                                                justify-between
                                            ">

                                                <span className="
                                                    max-w-[70%]
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-slate-600
                                                ">
                                                    {source}
                                                </span>


                                                <span className="
                                                    text-xs
                                                    font-bold
                                                    text-slate-800
                                                ">
                                                    {count}
                                                </span>

                                            </div>


                                            <div className="
                                                h-2
                                                overflow-hidden
                                                rounded-full
                                                bg-slate-100
                                            ">

                                                <div
                                                    className={`
                                                        h-full
                                                        rounded-full
                                                        ${index === 0
                                                            ? "bg-blue-500"
                                                            : index === 1
                                                                ? "bg-indigo-400"
                                                                : index === 2
                                                                    ? "bg-emerald-400"
                                                                    : index === 3
                                                                        ? "bg-amber-400"
                                                                        : "bg-slate-400"
                                                        }
                                                    `}
                                                    style={{
                                                        width:
                                                            `${(
                                                                count /
                                                                maxSourceCount
                                                            ) *
                                                            100}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        <div className="
                            mt-7
                            rounded-2xl
                            bg-slate-50
                            p-4
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-slate-500
                                ">
                                    <TrendingUp
                                        size={16}
                                    />
                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        truncate
                                        text-xs
                                        font-bold
                                        text-slate-700
                                    ">
                                        {sourceStats[0]?.[0]
                                            || "No source"}
                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        text-slate-400
                                    ">
                                        Top lead source
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-col
                    gap-3
                    pb-2
                    text-xs
                    text-slate-400
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p>

                        {loading
                            ? "Refreshing CRM data..."
                            : "CRM data is up to date."}

                    </p>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-500
                        " />

                        Live dashboard

                    </div>

                </div>

            </div>

        </div>

    );

}