import { Eye, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const statusColors = {

    New: "bg-blue-100 text-blue-700",

    Interested: "bg-green-100 text-green-700",

    "Follow Up": "bg-orange-100 text-orange-700",

    Converted: "bg-purple-100 text-purple-700",

};


export default function LeadTable({

    leads,

    fetchLeads

}) {


    const navigate = useNavigate();


    // -----------------------------------------
    // CONVERT SALE MODAL
    // -----------------------------------------

    const [selectedLead, setSelectedLead] = useState(null);

    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);


    // -----------------------------------------
    // OPEN MODAL
    // -----------------------------------------

    const openConvertModal = (lead) => {

        setSelectedLead(lead);

        setAmount("");

    };


    // -----------------------------------------
    // CLOSE MODAL
    // -----------------------------------------

    const closeConvertModal = () => {

        setSelectedLead(null);

        setAmount("");

    };


    // -----------------------------------------
    // CONVERT TO SALE
    // -----------------------------------------

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

        }

        catch (error) {

            console.error(

                "Error converting lead:",

                error
            );


            alert(

                error.response?.data?.error

                ||

                "Failed to convert lead to sale."

            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <>


            {/* ===================================== */}
            {/* LEADS TABLE */}
            {/* ===================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                overflow-hidden
            ">


                <table className="w-full">


                    {/* TABLE HEADER */}

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left p-4">

                                Name

                            </th>


                            <th className="text-left">

                                Company

                            </th>


                            <th className="text-left">

                                Phone

                            </th>


                            <th className="text-left">

                                Source

                            </th>


                            <th className="text-left">

                                Status

                            </th>


                            <th className="text-center">

                                Action

                            </th>

                        </tr>

                    </thead>


                    {/* TABLE BODY */}

                    <tbody>


                        {(leads || []).map((lead) => (

                            <tr

                                key={lead.id}

                                className="
                                    border-t
                                    hover:bg-gray-50
                                    transition
                                "

                            >


                                {/* NAME */}

                                <td className="p-4">

                                    {lead.name}

                                </td>


                                {/* COMPANY */}

                                <td>

                                    {lead.company}

                                </td>


                                {/* PHONE */}

                                <td>

                                    {lead.phone}

                                </td>


                                {/* SOURCE */}

                                <td>

                                    {lead.source}

                                </td>


                                {/* STATUS */}

                                <td>

                                    <span

                                        className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            text-sm
                                            ${statusColors[lead.status]

                                            ||

                                            "bg-gray-100 text-gray-700"

                                            }
                                        `}

                                    >

                                        {lead.status}

                                    </span>

                                </td>


                                {/* ACTIONS */}

                                <td className="text-center">


                                    <div className="
                                        flex
                                        justify-center
                                        items-center
                                        gap-2
                                    ">


                                        {/* VIEW LEAD */}

                                        <button

                                            onClick={() =>

                                                navigate(

                                                    `/lead/${lead.id}`

                                                )

                                            }

                                            className="
                                                p-2
                                                rounded-lg
                                                hover:bg-blue-100
                                                hover:text-blue-600
                                                transition
                                            "

                                            title="View lead"

                                        >

                                            <Eye size={18} />

                                        </button>


                                        {/* CONVERT TO SALE */}

                                        {lead.status !== "Converted" && (

                                            <button

                                                onClick={() =>

                                                    openConvertModal(lead)

                                                }

                                                className="
                                                    p-2
                                                    rounded-lg
                                                    text-green-600
                                                    hover:bg-green-100
                                                    transition
                                                "

                                                title="Convert to Sale"

                                            >

                                                <CheckCircle size={18} />

                                            </button>

                                        )}


                                    </div>


                                </td>


                            </tr>

                        ))}


                    </tbody>


                </table>


                {/* EMPTY STATE */}

                {(!leads || leads.length === 0) && (

                    <div className="
                        p-10
                        text-center
                        text-gray-500
                    ">

                        No leads found.

                    </div>

                )}


            </div>


            {/* ===================================== */}
            {/* CONVERT TO SALE MODAL */}
            {/* ===================================== */}

            {selectedLead && (

                <div className="
                    fixed
                    inset-0
                    bg-black/40
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">


                    <div className="
                        bg-white
                        w-full
                        max-w-md
                        rounded-2xl
                        shadow-xl
                        p-6
                    ">


                        <h2 className="
                            text-xl
                            font-bold
                        ">

                            Convert to Sale

                        </h2>


                        <p className="
                            text-gray-500
                            mt-2
                        ">

                            Enter the confirmed sale amount for{" "}

                            <span className="font-semibold">

                                {selectedLead.name}

                            </span>

                            .

                        </p>


                        {/* AMOUNT */}

                        <div className="mt-6">


                            <label className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            ">

                                Sale Amount

                            </label>


                            <input

                                type="number"

                                min="1"

                                step="0.01"

                                value={amount}

                                onChange={(e) =>

                                    setAmount(e.target.value)

                                }

                                placeholder="Enter sale amount"

                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-green-500
                                "

                            />


                        </div>


                        {/* BUTTONS */}

                        <div className="
                            flex
                            justify-end
                            gap-3
                            mt-6
                        ">


                            <button

                                onClick={closeConvertModal}

                                disabled={loading}

                                className="
                                    px-5
                                    py-2
                                    rounded-xl
                                    border
                                    hover:bg-gray-50
                                    transition
                                "

                            >

                                Cancel

                            </button>


                            <button

                                onClick={convertToSale}

                                disabled={loading}

                                className="
                                    bg-green-600
                                    hover:bg-green-700
                                    text-white
                                    px-5
                                    py-2
                                    rounded-xl
                                    transition
                                    disabled:opacity-50
                                "

                            >

                                {

                                    loading

                                        ? "Converting..."

                                        : "Confirm Sale"

                                }

                            </button>


                        </div>


                    </div>


                </div>

            )}


        </>

    );

}