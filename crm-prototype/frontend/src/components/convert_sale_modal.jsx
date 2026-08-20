import { useState } from "react";
import api from "../services/api";

export default function ConvertSaleModal({

    open,
    setOpen,
    lead,
    onSuccess

}) {

    const [saleAmount, setSaleAmount] = useState("");

    const [paymentDueDate, setPaymentDueDate] =
        useState("");

    const [paymentNotes, setPaymentNotes] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    if (!open) {

        return null;

    }


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        const amount = Number(saleAmount);


        if (

            !saleAmount ||

            Number.isNaN(amount) ||

            amount <= 0

        ) {

            setError(
                "Please enter a valid sale amount."
            );

            return;

        }


        try {

            setLoading(true);


            await api.post(

                `/leads/${lead.id}/convert`,

                {

                    sale_amount: amount,

                    payment_due_date:
                        paymentDueDate || null,

                    payment_notes:
                        paymentNotes || null

                }

            );


            setSaleAmount("");

            setPaymentDueDate("");

            setPaymentNotes("");


            if (onSuccess) {

                await onSuccess();

            }


            setOpen(false);


        }

        catch (error) {

            console.error(
                "Convert sale error:",
                error
            );


            setError(

                error.response?.data?.message ||

                "Failed to convert lead to sale."

            );

        }

        finally {

            setLoading(false);

        }

    };


    const handleClose = () => {

        if (loading) return;

        setError("");

        setSaleAmount("");

        setPaymentDueDate("");

        setPaymentNotes("");

        setOpen(false);

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">


            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">


                {/* HEADER */}

                <div className="mb-6 flex items-start justify-between">


                    <div>

                        <h2 className="text-2xl font-bold">

                            Convert to Sale

                        </h2>


                        <p className="mt-1 text-sm text-gray-500">

                            Enter the sale details for{" "}

                            <span className="font-medium text-gray-700">

                                {lead?.name}

                            </span>

                        </p>

                    </div>


                    <button

                        type="button"

                        onClick={handleClose}

                        disabled={loading}

                        className="
                            rounded-lg
                            px-3
                            py-1
                            text-xl
                            text-gray-500
                            hover:bg-gray-100
                            disabled:cursor-not-allowed
                        "

                    >

                        ×

                    </button>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* SALE AMOUNT */}

                    <div className="mb-5">


                        <label className="mb-2 block text-sm font-medium">

                            Sale Amount *

                        </label>


                        <input

                            type="number"

                            min="1"

                            step="0.01"

                            value={saleAmount}

                            onChange={(event) =>

                                setSaleAmount(
                                    event.target.value
                                )

                            }

                            placeholder="Enter sale amount"

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                            required

                        />

                    </div>


                    {/* PAYMENT DUE DATE */}

                    <div className="mb-5">


                        <label className="mb-2 block text-sm font-medium">

                            Payment Due Date

                            <span className="ml-1 text-gray-400">

                                Optional

                            </span>

                        </label>


                        <input

                            type="date"

                            value={paymentDueDate}

                            onChange={(event) =>

                                setPaymentDueDate(
                                    event.target.value
                                )

                            }

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    {/* PAYMENT NOTES */}

                    <div className="mb-5">


                        <label className="mb-2 block text-sm font-medium">

                            Payment Notes

                            <span className="ml-1 text-gray-400">

                                Optional

                            </span>

                        </label>


                        <textarea

                            value={paymentNotes}

                            onChange={(event) =>

                                setPaymentNotes(
                                    event.target.value
                                )

                            }

                            placeholder="Example: 50% advance, remaining amount after delivery"

                            rows="4"

                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="
                            mb-5
                            rounded-xl
                            bg-red-50
                            p-3
                            text-sm
                            text-red-600
                        ">

                            {error}

                        </div>

                    )}


                    {/* BUTTONS */}

                    <div className="flex justify-end gap-3">


                        <button

                            type="button"

                            onClick={handleClose}

                            disabled={loading}

                            className="
                                rounded-xl
                                border
                                px-5
                                py-3
                                hover:bg-gray-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                        >

                            Cancel

                        </button>


                        <button

                            type="submit"

                            disabled={loading}

                            className="
                                rounded-xl
                                bg-green-600
                                px-5
                                py-3
                                text-white
                                hover:bg-green-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "

                        >

                            {

                                loading

                                    ? "Converting..."

                                    : "Confirm Sale"

                            }

                        </button>


                    </div>


                </form>


            </div>


        </div>

    );

}