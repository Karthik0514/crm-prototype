import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    IndianRupee,
    RefreshCw,
    TrendingUp,
    Users,
    X,
} from "lucide-react";

import api from "../services/api";


export default function Sales() {


    // =========================================
    // STATE
    // =========================================

    const [sales, setSales] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedSale, setSelectedSale] =
        useState(null);

    const [paymentStatus, setPaymentStatus] =
        useState("");

    const [amountPaid, setAmountPaid] =
        useState("");

    const [dueDate, setDueDate] =
        useState("");

    const [paymentNotes, setPaymentNotes] =
        useState("");

    const [savingPayment, setSavingPayment] =
        useState(false);


    // =========================================
    // FETCH SALES
    // =========================================

    const fetchSales = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/sales");

            setSales(response.data);

        }

        catch (error) {

            console.error(
                "Failed to fetch sales:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD SALES
    // =========================================

    useEffect(() => {

        fetchSales();

    }, []);


    // =========================================
    // STATISTICS
    // =========================================

    const totalSalesAmount = sales.reduce(

        (total, sale) =>

            total +
            Number(sale.sale_amount || 0),

        0

    );


    const totalPaid = sales.reduce(

        (total, sale) =>

            total +
            Number(sale.amount_paid || 0),

        0

    );


    const outstandingAmount =

        totalSalesAmount -

        totalPaid;


    const totalSales = sales.length;

    const collectedPercent =
        totalSalesAmount > 0
            ? Math.min(100, (totalPaid / totalSalesAmount) * 100)
            : 0;

    const pendingSales = sales.filter(
        (sale) => (sale.payment_status || "Pending") === "Pending"
    ).length;

    const partialSales = sales.filter(
        (sale) => sale.payment_status === "Partial"
    ).length;

    const paidSales = sales.filter(
        (sale) => sale.payment_status === "Paid"
    ).length;

    const averageSale =
        totalSales > 0 ? totalSalesAmount / totalSales : 0;


    // =========================================
    // SOURCE STATS
    // =========================================

    const sourceStats = {};


    sales.forEach((sale) => {

        const source =
            sale.source || "Unknown";


        if (!sourceStats[source]) {

            sourceStats[source] = {

                count: 0,

                amount: 0,

            };

        }


        sourceStats[source].count += 1;

        sourceStats[source].amount +=

            Number(
                sale.sale_amount || 0
            );

    });


    // =========================================
    // OPEN PAYMENT EDITOR
    // =========================================

    const openPaymentEditor = (sale) => {

        setSelectedSale(sale);


        setPaymentStatus(

            sale.payment_status ||
            "Pending"

        );


        setAmountPaid(

            sale.amount_paid || 0

        );


        setDueDate(

            sale.payment_due_date
                ? sale.payment_due_date.split("T")[0]
                : ""

        );


        setPaymentNotes(

            sale.payment_notes || ""

        );

    };


    // =========================================
    // UPDATE PAYMENT
    // =========================================

    const updatePayment = async () => {

        if (!selectedSale) return;


        try {

            setSavingPayment(true);


            await api.put(

                `/sales/${selectedSale.id}/payment`,

                {

                    amount_paid:

                        Number(amountPaid) || 0,


                    payment_status:

                        paymentStatus,


                    payment_due_date:

                        dueDate || null,


                    payment_notes:

                        paymentNotes || null,

                }

            );


            setSelectedSale(null);


            await fetchSales();


        }

        catch (error) {

            console.error(
                "Failed to update payment:",
                error
            );

            alert(
                "Failed to update payment"
            );

        }

        finally {

            setSavingPayment(false);

        }

    };


    // =========================================
    // STATUS COLOR
    // =========================================

    const paymentStatusColor = (status) => {
        if (status === "Paid") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Partial") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-red-100 text-red-700";
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center p-8">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <RefreshCw size={18} className="animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">
                        Loading sales dashboard...
                    </span>
                </div>
            </div>

        );

    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="min-h-full space-y-8 bg-slate-50/60 p-1 sm:p-2">


            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-7 text-white shadow-xl shadow-blue-950/10 sm:px-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
                            <TrendingUp size={13} />
                            Revenue Command Center
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Sales
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/80">
                            Track revenue, payments, outstanding balances, and where your best sales are coming from.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-[10px] uppercase tracking-wider text-blue-200/70">
                                Avg. sale
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                ₹{averageSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-[10px] uppercase tracking-wider text-blue-200/70">
                                Collected
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {collectedPercent.toFixed(0)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* ========================================= */}
            {/* STATISTICS */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Users size={19} />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                            <ArrowUpRight size={11} />
                            Active
                        </span>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Total Sales
                    </p>
                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        {totalSales}
                    </h2>
                </div>


                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <CircleDollarSign size={19} />
                        </div>
                        <TrendingUp size={17} className="text-blue-500" />
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Total Revenue
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl">
                        ₹{totalSalesAmount.toLocaleString()}
                    </h2>
                </div>


                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Banknote size={19} />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">
                            {collectedPercent.toFixed(0)}%
                        </span>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Amount Received
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl">
                        ₹{totalPaid.toLocaleString()}
                    </h2>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${collectedPercent}%` }}
                        />
                    </div>
                </div>


                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <CreditCard size={19} />
                        </div>
                        <ArrowDownRight size={17} className="text-rose-500" />
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Outstanding
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-rose-600 sm:text-3xl">
                        ₹{outstandingAmount.toLocaleString()}
                    </h2>
                </div>


            </div>


            {/* ========================================= */}
            {/* SALES BY SOURCE */}
            {/* ========================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            Sales by Source
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Revenue contribution by acquisition channel
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        {Object.keys(sourceStats).length} channels
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                    {

                        Object.entries(
                            sourceStats
                        ).map(

                            ([source, stats]) => (

                                <div

                                    key={source}

                                    className="
                                        group
                                        rounded-2xl
                                        border border-slate-200
                                        bg-slate-50/50
                                        p-5
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:border-blue-200
                                        hover:bg-white
                                        hover:shadow-md
                                    "

                                >

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {source}
                                        </p>
                                        <ChevronRight
                                            size={15}
                                            className="text-slate-300 transition-transform group-hover:translate-x-1"
                                        />
                                    </div>


                                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">

                                        ₹
                                        {stats.amount.toLocaleString()}

                                    </h3>


                                    <p className="mt-1 text-xs text-slate-400">

                                        {stats.count} Sale
                                        {stats.count !== 1
                                            ? "s"
                                            : ""
                                        }

                                    </p>

                                </div>

                            )

                        )

                    }


                    {

                        Object.keys(
                            sourceStats
                        ).length === 0 && (

                            <p className="text-gray-500">

                                No sales yet.

                            </p>

                        )

                    }


                </div>


            </div>


            {/* ========================================= */}
            {/* SALES TABLE */}
            {/* ========================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                <div className="p-6 border-b">


                    <h2 className="text-xl font-bold">

                        All Sales

                    </h2>

                </div>


                {

                    sales.length === 0

                        ? (

                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <IndianRupee size={23} />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-700">
                                    No sales yet
                                </p>
                                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                                    Confirmed sales will appear here with their payment and due-date details.
                                </p>
                            </div>

                        )

                        : (

                            <div className="overflow-x-auto">


                                <table className="w-full min-w-[980px]">


                                    <thead className="bg-slate-50/80">


                                        <tr>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Customer

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Company

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Source

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Sale Amount

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Paid

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Payment Status

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Due Date

                                            </th>


                                            <th className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                                Action

                                            </th>

                                        </tr>


                                    </thead>


                                    <tbody>


                                        {

                                            sales.map(

                                                (sale) => (

                                                    <tr

                                                        key={sale.id}

                                                        className="
                                                            border-t border-slate-100
                                                            transition-colors
                                                            hover:bg-blue-50/30
                                                        "

                                                    >


                                                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">

                                                            {sale.customer_name}

                                                        </td>


                                                        <td className="px-4 py-4 text-sm text-slate-600">

                                                            {sale.company}

                                                        </td>


                                                        <td className="px-4 py-4 text-sm text-slate-600">

                                                            {sale.source}

                                                        </td>


                                                        <td className="px-4 py-4 text-sm font-bold text-slate-900">

                                                            ₹
                                                            {Number(
                                                                sale.sale_amount
                                                            ).toLocaleString()}

                                                        </td>


                                                        <td className="px-4 py-4 text-sm text-slate-600">

                                                            ₹
                                                            {Number(
                                                                sale.amount_paid
                                                            ).toLocaleString()}

                                                        </td>


                                                        <td className="px-4 py-4 text-sm text-slate-600">


                                                            <span

                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    px-2.5
                                                                    py-1.5
                                                                    text-xs
                                                                    font-semibold
                                                                    ${paymentStatusColor(
                                                                    sale.payment_status
                                                                )}
                                                                `}

                                                            >

                                                                {
                                                                    sale.payment_status
                                                                }

                                                            </span>


                                                        </td>


                                                        <td className="px-4 py-4 text-sm text-slate-600">


                                                            {

                                                                sale.payment_due_date

                                                                    ? new Date(

                                                                        sale.payment_due_date

                                                                    ).toLocaleDateString()

                                                                    : "-"

                                                            }


                                                        </td>


                                                        <td className="p-4 text-center">


                                                            <button

                                                                onClick={() =>

                                                                    openPaymentEditor(
                                                                        sale
                                                                    )

                                                                }

                                                                className="
                                                                    cursor-pointer
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-xl
                                                                    bg-blue-600
                                                                    px-3.5
                                                                    py-2
                                                                    text-xs
                                                                    font-semibold
                                                                    text-white
                                                                    shadow-sm
                                                                    shadow-blue-600/20
                                                                    transition-all
                                                                    hover:-translate-y-0.5
                                                                    hover:bg-blue-700
                                                                    hover:shadow-md
                                                                    active:scale-95
                                                                "

                                                            >

                                                                Update
                                                                <ChevronRight size={13} />
                                                            </button>


                                                        </td>


                                                    </tr>

                                                )

                                            )

                                        }


                                    </tbody>


                                </table>


                            </div>

                        )

                }


            </div>


            {/* ========================================= */}
            {/* PAYMENT MODAL */}
            {/* ========================================= */}

            {

                selectedSale && (

                    <div className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-slate-950/60
                        p-4
                        backdrop-blur-sm
                    ">


                        <div className="
                            w-full
                            max-w-lg
                            rounded-3xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-2xl
                            shadow-slate-950/20
                            sm:p-7
                        ">


                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                        <CreditCard size={12} />
                                        Payment details
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Update Payment
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {selectedSale.customer_name}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedSale(null)}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                    title="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>


                            <div className="space-y-4">


                                <div>


                                    <label className="
                                        mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500
                                    ">

                                        Amount Paid

                                    </label>


                                    <input

                                        type="number"

                                        min="0"

                                        value={amountPaid}

                                        onChange={(e) =>

                                            setAmountPaid(
                                                e.target.value
                                            )

                                        }

                                        className="
                                            w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                        "

                                    />


                                </div>


                                <div>


                                    <label className="
                                        mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500
                                    ">

                                        Payment Status

                                    </label>


                                    <select

                                        value={paymentStatus}

                                        onChange={(e) =>

                                            setPaymentStatus(
                                                e.target.value
                                            )

                                        }

                                        className="
                                            w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                        "

                                    >

                                        <option value="Pending">

                                            Pending

                                        </option>


                                        <option value="Partial">

                                            Partial

                                        </option>


                                        <option value="Paid">

                                            Paid

                                        </option>


                                    </select>


                                </div>


                                <div>


                                    <label className="
                                        mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500
                                    ">

                                        Payment Due Date
                                        <CalendarDays size={13} className="ml-1 inline text-slate-400" />

                                    </label>


                                    <input

                                        type="date"

                                        value={dueDate}

                                        onChange={(e) =>

                                            setDueDate(
                                                e.target.value
                                            )

                                        }

                                        className="
                                            w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                        "

                                    />


                                </div>


                                <div>


                                    <label className="
                                        mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500
                                    ">

                                        Payment Notes

                                    </label>


                                    <textarea

                                        value={paymentNotes}

                                        onChange={(e) =>

                                            setPaymentNotes(
                                                e.target.value
                                            )

                                        }

                                        rows="4"

                                        className="
                                            w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                        "

                                        placeholder="
                                            Add payment information...
                                        "

                                    />


                                </div>


                            </div>


                            <div className="
                                mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5
                            ">


                                <button

                                    onClick={() =>

                                        setSelectedSale(
                                            null
                                        )

                                    }

                                    className="
                                        cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95
                                    "

                                >

                                    Cancel

                                </button>


                                <button

                                    onClick={updatePayment}

                                    disabled={savingPayment}

                                    className="
                                        cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-400
                                    "

                                >

                                    {

                                        savingPayment

                                            ? "Saving..."

                                            : "Save Payment"

                                    }

                                </button>


                            </div>


                        </div>


                    </div>

                )

            }


        </div>

    );

}