import { useEffect, useState } from "react";

export default function Campaigns() {

    const [campaigns, setCampaigns] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);


    const [form, setForm] = useState({

        name: "",
        channel: "WhatsApp",
        audience: "",
        total: ""

    });


    // ==========================================
    // LOAD CAMPAIGNS
    // ==========================================

    const loadCampaigns = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/campaigns"
            );

            const data = await response.json();

            setCampaigns(data);

        }

        catch (error) {

            console.error(
                "Failed to load campaigns:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCampaigns();

    }, []);


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {

            name,
            value

        } = event.target;


        setForm({

            ...form,

            [name]: value

        });

    };


    // ==========================================
    // CREATE CAMPAIGN
    // ==========================================

    const createCampaign = async (event) => {

        event.preventDefault();


        try {

            const response = await fetch(

                "http://localhost:5000/api/campaigns",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(form)

                }

            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.error ||
                    "Failed to create campaign"
                );

                return;

            }


            setForm({

                name: "",
                channel: "WhatsApp",
                audience: "",
                total: ""

            });


            setShowForm(false);


            loadCampaigns();

        }

        catch (error) {

            console.error(error);

            alert(
                "Failed to create campaign"
            );

        }

    };


    // ==========================================
    // DELETE CAMPAIGN
    // ==========================================

    const deleteCampaign = async (id) => {

        const confirmed = window.confirm(

            "Delete this campaign?"

        );


        if (!confirmed) return;


        try {

            await fetch(

                `http://localhost:5000/api/campaigns/${id}`,

                {

                    method: "DELETE"

                }

            );


            loadCampaigns();

        }

        catch (error) {

            console.error(
                "Delete failed:",
                error
            );

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div>


            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">

                        Campaigns

                    </h1>


                    <p className="text-gray-500 mt-1">

                        Manage your sales outreach campaigns

                    </p>

                </div>


                <button

                    onClick={() =>
                        setShowForm(true)
                    }

                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-2
                        rounded-xl
                        transition
                    "

                >

                    + New Campaign

                </button>

            </div>


            {/* CREATE CAMPAIGN MODAL */}

            {

                showForm && (

                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/40
                            flex
                            items-center
                            justify-center
                            z-50
                        "
                    >

                        <div
                            className="
                                bg-white
                                rounded-2xl
                                shadow-xl
                                p-6
                                w-full
                                max-w-md
                            "
                        >


                            <h2 className="text-2xl font-bold mb-5">

                                Create Campaign

                            </h2>


                            <form
                                onSubmit={createCampaign}
                                className="space-y-4"
                            >


                                <input

                                    type="text"

                                    name="name"

                                    value={form.name}

                                    onChange={handleChange}

                                    placeholder="Campaign name"

                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "

                                />


                                <select

                                    name="channel"

                                    value={form.channel}

                                    onChange={handleChange}

                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "

                                >

                                    <option>

                                        WhatsApp

                                    </option>

                                    <option>

                                        Email

                                    </option>

                                </select>


                                <input

                                    type="text"

                                    name="audience"

                                    value={form.audience}

                                    onChange={handleChange}

                                    placeholder="Audience (e.g. IndiaMART leads)"

                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "

                                />


                                <input

                                    type="number"

                                    name="total"

                                    value={form.total}

                                    onChange={handleChange}

                                    placeholder="Number of recipients"

                                    min="1"

                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "

                                />


                                <div className="flex gap-3 pt-2">


                                    <button

                                        type="button"

                                        onClick={() =>
                                            setShowForm(false)
                                        }

                                        className="
                                            flex-1
                                            border
                                            rounded-xl
                                            py-3
                                            hover:bg-gray-50
                                        "

                                    >

                                        Cancel

                                    </button>


                                    <button

                                        type="submit"

                                        className="
                                            flex-1
                                            bg-blue-600
                                            text-white
                                            rounded-xl
                                            py-3
                                            hover:bg-blue-700
                                        "

                                    >

                                        Create

                                    </button>


                                </div>


                            </form>

                        </div>

                    </div>

                )

            }


            {/* CAMPAIGNS */}


            {

                loading ? (

                    <p className="text-gray-500">

                        Loading campaigns...

                    </p>

                )

                    : campaigns.length === 0 ? (

                        <div
                            className="
                            bg-white
                            border
                            rounded-2xl
                            p-10
                            text-center
                        "
                        >

                            <h2 className="text-xl font-semibold">

                                No campaigns yet

                            </h2>


                            <p className="text-gray-500 mt-2">

                                Create your first outreach campaign.

                            </p>

                        </div>

                    )

                        : (

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                                {

                                    campaigns.map(campaign => {

                                        const progress =

                                            campaign.total > 0

                                                ? Math.min(

                                                    100,

                                                    (
                                                        campaign.sent /
                                                        campaign.total
                                                    ) * 100

                                                )

                                                : 0;


                                        return (

                                            <div

                                                key={campaign.id}

                                                className="
                                            bg-white
                                            border
                                            rounded-2xl
                                            p-6
                                            shadow-sm
                                        "

                                            >


                                                <div
                                                    className="
                                                flex
                                                justify-between
                                                gap-4
                                            "
                                                >


                                                    <div>


                                                        <h2
                                                            className="
                                                        font-bold
                                                        text-xl
                                                    "
                                                        >

                                                            {campaign.name}

                                                        </h2>


                                                        <p className="text-gray-500">

                                                            {campaign.channel}

                                                        </p>


                                                        <p className="text-sm text-gray-500">

                                                            Audience:{" "}

                                                            {

                                                                campaign.audience

                                                            }

                                                        </p>


                                                    </div>


                                                    <button

                                                        onClick={() =>

                                                            deleteCampaign(

                                                                campaign.id

                                                            )

                                                        }

                                                        className="
                                                    text-red-500
                                                    hover:text-red-700
                                                "

                                                        title="Delete campaign"

                                                    >

                                                        🗑️

                                                    </button>


                                                </div>


                                                {/* PROGRESS */}


                                                <div
                                                    className="
                                                bg-gray-200
                                                rounded-full
                                                h-3
                                                mt-5
                                                overflow-hidden
                                            "
                                                >

                                                    <div

                                                        className="
                                                    bg-blue-600
                                                    h-3
                                                    rounded-full
                                                    transition-all
                                                "

                                                        style={{

                                                            width:

                                                                `${progress}%`

                                                        }}

                                                    />

                                                </div>


                                                <div
                                                    className="
                                                flex
                                                justify-between
                                                mt-3
                                                text-sm
                                            "
                                                >

                                                    <span>

                                                        {

                                                            campaign.sent

                                                        }

                                                        /

                                                        {

                                                            campaign.total

                                                        }

                                                        {" "}Sent

                                                    </span>


                                                    <span
                                                        className="
                                                    text-gray-500
                                                "
                                                    >

                                                        {

                                                            Math.round(

                                                                progress

                                                            )

                                                        }

                                                        %

                                                    </span>


                                                </div>


                                            </div>

                                        );

                                    })

                                }


                            </div>

                        )

            }


        </div>

    );

}