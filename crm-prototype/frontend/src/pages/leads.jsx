import LeadTable from "../components/lead_table";
import { useEffect, useState } from "react";
import api from "../services/api";
import AddLeadModal from "../components/add_lead_model";

export default function Leads() {

    // -----------------------------------------
    // STATE
    // -----------------------------------------

    const [openModal, setOpenModal] = useState(false);

    const [leads, setLeads] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All Status");

    const [sourceFilter, setSourceFilter] = useState("All Sources");


    // -----------------------------------------
    // FETCH LEADS
    // -----------------------------------------

    const fetchLeads = async () => {

        try {

            const response = await api.get("/leads");

            setLeads(response.data);

        }

        catch (err) {

            console.error(
                "Error fetching leads:",
                err
            );

        }

    };


    // -----------------------------------------
    // LOAD LEADS
    // -----------------------------------------

    useEffect(() => {

        fetchLeads();

    }, []);


    // -----------------------------------------
    // FILTER LEADS
    // -----------------------------------------

    const filteredLeads = leads.filter((lead) => {

        const query = search.toLowerCase();

        const matchesSearch =

            (lead.name || "")
                .toLowerCase()
                .includes(query)

            ||

            (lead.company || "")
                .toLowerCase()
                .includes(query)

            ||

            (lead.email || "")
                .toLowerCase()
                .includes(query)

            ||

            (lead.phone || "")
                .toLowerCase()
                .includes(query);


        const matchesStatus =

            statusFilter === "All Status"

            ||

            lead.status === statusFilter;


        const matchesSource =

            sourceFilter === "All Sources"

            ||

            lead.source === sourceFilter;


        return (

            matchesSearch

            &&

            matchesStatus

            &&

            matchesSource

        );

    });


    // -----------------------------------------
    // LEAD STATISTICS
    // -----------------------------------------

    const totalLeads = leads.length;


    const newLeads = leads.filter(

        (lead) => lead.status === "New"

    ).length;


    const interestedLeads = leads.filter(

        (lead) => lead.status === "Interested"

    ).length;


    const followUpLeads = leads.filter(

        (lead) => lead.status === "Follow Up"

    ).length;


    // -----------------------------------------
    // GET UNIQUE SOURCES
    // -----------------------------------------

    const sources = [

        ...new Set(

            leads

                .map((lead) => lead.source)

                .filter(Boolean)

        )

    ];


    // -----------------------------------------
    // UI
    // -----------------------------------------

    return (

        <div>


            {/* ===================================== */}
            {/* PAGE HEADER */}
            {/* ===================================== */}

            <div className="flex justify-between items-center mb-8">


                <div>

                    <h1 className="text-3xl font-bold">

                        Leads

                    </h1>


                    <p className="text-gray-500">

                        Manage and track all customer leads

                    </p>

                </div>


                <button

                    onClick={() => setOpenModal(true)}

                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        transition
                    "

                >

                    + Add Lead

                </button>


            </div>


            {/* ===================================== */}
            {/* STATISTICS */}
            {/* ===================================== */}

            <div className="grid grid-cols-4 gap-6 mb-6">


                {/* TOTAL LEADS */}

                <div className="
                    bg-white
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="text-gray-500">

                        Total Leads

                    </p>


                    <h1 className="
                        text-4xl
                        font-bold
                        mt-2
                    ">

                        {totalLeads}

                    </h1>

                </div>


                {/* NEW LEADS */}

                <div className="
                    bg-white
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="text-gray-500">

                        New Leads

                    </p>


                    <h1 className="
                        text-4xl
                        font-bold
                        text-blue-600
                        mt-2
                    ">

                        {newLeads}

                    </h1>

                </div>


                {/* INTERESTED */}

                <div className="
                    bg-white
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="text-gray-500">

                        Interested

                    </p>


                    <h1 className="
                        text-4xl
                        font-bold
                        text-green-600
                        mt-2
                    ">

                        {interestedLeads}

                    </h1>

                </div>


                {/* FOLLOW UP */}

                <div className="
                    bg-white
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="text-gray-500">

                        Follow Up

                    </p>


                    <h1 className="
                        text-4xl
                        font-bold
                        text-orange-500
                        mt-2
                    ">

                        {followUpLeads}

                    </h1>

                </div>


            </div>


            {/* ===================================== */}
            {/* SEARCH AND FILTERS */}
            {/* ===================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                p-5
                mb-6
            ">


                <div className="flex gap-4">


                    {/* SEARCH */}

                    <input

                        type="text"

                        placeholder="Search Lead..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                        className="
                            border
                            rounded-xl
                            px-4
                            py-3
                            flex-1
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "

                    />


                    {/* STATUS FILTER */}

                    <select

                        value={statusFilter}

                        onChange={(e) =>

                            setStatusFilter(
                                e.target.value
                            )

                        }

                        className="
                            border
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                        "

                    >

                        <option value="All Status">

                            All Status

                        </option>


                        <option value="New">

                            New

                        </option>


                        <option value="Interested">

                            Interested

                        </option>


                        <option value="Follow Up">

                            Follow Up

                        </option>


                        <option value="Converted">

                            Converted

                        </option>


                    </select>


                    {/* SOURCE FILTER */}

                    <select

                        value={sourceFilter}

                        onChange={(e) =>

                            setSourceFilter(
                                e.target.value
                            )

                        }

                        className="
                            border
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                        "

                    >

                        <option value="All Sources">

                            All Sources

                        </option>


                        {

                            sources.map((source) => (

                                <option

                                    key={source}

                                    value={source}

                                >

                                    {source}

                                </option>

                            ))

                        }


                    </select>


                </div>


            </div>


            {/* ===================================== */}
            {/* ADD LEAD MODAL */}
            {/* ===================================== */}

            <AddLeadModal

                open={openModal}

                setOpen={setOpenModal}

                fetchLeads={fetchLeads}

            />


            {/* ===================================== */}
            {/* LEADS TABLE */}
            {/* ===================================== */}

            <LeadTable

                leads={filteredLeads}

                fetchLeads={fetchLeads}

            />


        </div>

    );

}