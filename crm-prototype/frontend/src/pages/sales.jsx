import { useEffect, useState } from "react";

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

            <div className="p-8">

                Loading sales...

            </div>

        );

    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="space-y-8">


            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div>

                <h1 className="text-3xl font-bold">

                    Sales

                </h1>


                <p className="text-gray-500">

                    Track confirmed sales and payments

                </p>

            </div>


            {/* ========================================= */}
            {/* STATISTICS */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">

                        Total Sales

                    </p>


                    <h2 className="text-4xl font-bold mt-2">

                        {totalSales}

                    </h2>

                </div>


                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">

                        Total Revenue

                    </p>


                    <h2 className="text-3xl font-bold text-blue-600 mt-2">

                        ₹
                        {totalSalesAmount.toLocaleString()}

                    </h2>

                </div>


                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">

                        Amount Received

                    </p>


                    <h2 className="text-3xl font-bold text-green-600 mt-2">

                        ₹
                        {totalPaid.toLocaleString()}

                    </h2>

                </div>


                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <p className="text-gray-500">

                        Outstanding

                    </p>


                    <h2 className="text-3xl font-bold text-red-600 mt-2">

                        ₹
                        {outstandingAmount.toLocaleString()}

                    </h2>

                </div>


            </div>


            {/* ========================================= */}
            {/* SALES BY SOURCE */}
            {/* ========================================= */}

            <div className="bg-white border rounded-2xl p-6 shadow-sm">


                <h2 className="text-xl font-bold mb-5">

                    Sales by Source

                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                    {

                        Object.entries(
                            sourceStats
                        ).map(

                            ([source, stats]) => (

                                <div

                                    key={source}

                                    className="
                                        border
                                        rounded-xl
                                        p-5
                                    "

                                >

                                    <p className="text-gray-500">

                                        {source}

                                    </p>


                                    <h3 className="text-2xl font-bold mt-2">

                                        ₹
                                        {stats.amount.toLocaleString()}

                                    </h3>


                                    <p className="text-sm text-gray-500 mt-1">

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

            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">


                <div className="p-6 border-b">


                    <h2 className="text-xl font-bold">

                        All Sales

                    </h2>

                </div>


                {

                    sales.length === 0

                        ? (

                            <div className="p-8 text-gray-500">

                                No sales have been recorded yet.

                            </div>

                        )

                        : (

                            <div className="overflow-x-auto">


                                <table className="w-full">


                                    <thead className="bg-gray-50">


                                        <tr>

                                            <th className="text-left p-4">

                                                Customer

                                            </th>


                                            <th className="text-left p-4">

                                                Company

                                            </th>


                                            <th className="text-left p-4">

                                                Source

                                            </th>


                                            <th className="text-left p-4">

                                                Sale Amount

                                            </th>


                                            <th className="text-left p-4">

                                                Paid

                                            </th>


                                            <th className="text-left p-4">

                                                Payment Status

                                            </th>


                                            <th className="text-left p-4">

                                                Due Date

                                            </th>


                                            <th className="text-center p-4">

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
                                                            border-t
                                                            hover:bg-gray-50
                                                        "

                                                    >


                                                        <td className="p-4 font-medium">

                                                            {sale.customer_name}

                                                        </td>


                                                        <td className="p-4">

                                                            {sale.company}

                                                        </td>


                                                        <td className="p-4">

                                                            {sale.source}

                                                        </td>


                                                        <td className="p-4 font-semibold">

                                                            ₹
                                                            {Number(
                                                                sale.sale_amount
                                                            ).toLocaleString()}

                                                        </td>


                                                        <td className="p-4">

                                                            ₹
                                                            {Number(
                                                                sale.amount_paid
                                                            ).toLocaleString()}

                                                        </td>


                                                        <td className="p-4">


                                                            <span

                                                                className={`
                                                                    px-3
                                                                    py-1
                                                                    rounded-full
                                                                    text-sm
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


                                                        <td className="p-4">


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
                                                                    bg-blue-600
                                                                    hover:bg-blue-700
                                                                    text-white
                                                                    px-4
                                                                    py-2
                                                                    rounded-lg
                                                                "

                                                            >

                                                                Update

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
                        bg-black
                        bg-opacity-50
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    ">


                        <div className="
                            bg-white
                            rounded-2xl
                            p-6
                            w-full
                            max-w-lg
                        ">


                            <h2 className="text-2xl font-bold mb-1">

                                Update Payment

                            </h2>


                            <p className="text-gray-500 mb-6">

                                {selectedSale.customer_name}

                            </p>


                            <div className="space-y-4">


                                <div>


                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-2
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
                                            w-full
                                            border
                                            rounded-xl
                                            px-4
                                            py-3
                                        "

                                    />


                                </div>


                                <div>


                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-2
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
                                            w-full
                                            border
                                            rounded-xl
                                            px-4
                                            py-3
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
                                        block
                                        text-sm
                                        font-medium
                                        mb-2
                                    ">

                                        Payment Due Date

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
                                            w-full
                                            border
                                            rounded-xl
                                            px-4
                                            py-3
                                        "

                                    />


                                </div>


                                <div>


                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-2
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
                                            w-full
                                            border
                                            rounded-xl
                                            px-4
                                            py-3
                                        "

                                        placeholder="
                                            Add payment information...
                                        "

                                    />


                                </div>


                            </div>


                            <div className="
                                flex
                                justify-end
                                gap-3
                                mt-6
                            ">


                                <button

                                    onClick={() =>

                                        setSelectedSale(
                                            null
                                        )

                                    }

                                    className="
                                        px-5
                                        py-3
                                        rounded-xl
                                        border
                                    "

                                >

                                    Cancel

                                </button>


                                <button

                                    onClick={updatePayment}

                                    disabled={savingPayment}

                                    className="
                                        bg-blue-600
                                        hover:bg-blue-700
                                        disabled:bg-blue-400
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
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