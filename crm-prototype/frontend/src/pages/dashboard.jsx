import { useEffect, useState } from "react";
import api from "../services/api";

import StatCard from "../components/StatCard";
import RecentLeads from "../components/recent_leads";
import AIInsights from "../components/ai_insights";

export default function Dashboard() {

    const [leads, setLeads] = useState([]);

    // ==================================================
    // GET LOGGED-IN USER
    // ==================================================

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    // ==================================================
    // FETCH LEADS
    // ==================================================

    const fetchLeads = async () => {

        try {

            const response = await api.get("/leads");

            setLeads(response.data);

        } catch (err) {

            console.error(err);

        }

    };


    // ==================================================
    // LOAD DATA
    // ==================================================

    useEffect(() => {

        fetchLeads();

    }, []);


    // ==================================================
    // GREETING
    // ==================================================

    const hour = new Date().getHours();

    let greeting = "Good Evening";
    let emoji = "🌙";

    if (hour >= 5 && hour < 12) {

        greeting = "Good Morning";
        emoji = "☀️";

    } else if (hour >= 12 && hour < 17) {

        greeting = "Good Afternoon";
        emoji = "👋";

    } else if (hour >= 17 && hour < 21) {

        greeting = "Good Evening";
        emoji = "🌇";

    }


    // ==================================================
    // USER NAME
    // ==================================================

    const userName = user?.name || "there";


    // ==================================================
    // STATISTICS
    // ==================================================

    const totalLeads = leads.length;


    const interested = leads.filter(
        lead => lead.status === "Interested"
    ).length;


    const converted = leads.filter(
        lead => lead.status === "Converted"
    ).length;


    const followUps = leads.filter(
        lead => lead.status === "Follow Up"
    ).length;


    const newLeads = leads.filter(
        lead => lead.status === "New"
    ).length;


    const conversionRate =
        totalLeads === 0
            ? 0
            : Math.round(
                (converted / totalLeads) * 100
            );


    // ==================================================
    // RECENT LEADS
    // ==================================================

    const recentLeads = [...leads]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div>


            {/* ========================================= */}
            {/* GREETING */}
            {/* ========================================= */}

            <h1 className="text-3xl font-bold">

                {greeting}, {userName} {emoji}

            </h1>


            <p className="text-gray-500 mt-2">

                {totalLeads === 0
                    ? `Welcome, ${userName}! Start by adding your first lead.`
                    : `You currently have ${totalLeads} active leads in your CRM.`}

            </p>


            {/* ========================================= */}
            {/* STATISTICS */}
            {/* ========================================= */}

            <div className="grid grid-cols-5 gap-6 mt-8">


                <StatCard
                    title="Total Leads"
                    value={totalLeads}
                    color="text-blue-600"
                />


                <StatCard
                    title="Interested"
                    value={interested}
                    color="text-green-600"
                />


                <StatCard
                    title="Follow Ups"
                    value={followUps}
                    color="text-orange-500"
                />


                <StatCard
                    title="Converted"
                    value={converted}
                    color="text-purple-600"
                />


                <StatCard
                    title="Conversion %"
                    value={`${conversionRate}%`}
                    color="text-pink-600"
                />


            </div>


            {/* ========================================= */}
            {/* MAIN CONTENT */}
            {/* ========================================= */}

            <div className="grid grid-cols-3 gap-6 mt-8">


                {/* RECENT LEADS */}

                <div className="col-span-2">

                    <RecentLeads
                        leads={recentLeads}
                    />

                </div>


                {/* AI INSIGHTS */}

                <AIInsights

                    totalLeads={totalLeads}

                    interested={interested}

                    followUps={followUps}

                    converted={converted}

                    newLeads={newLeads}

                />


            </div>


        </div>

    );

}