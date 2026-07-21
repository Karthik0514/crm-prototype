import { useEffect, useState } from "react";
import api from "../services/api";

import StatCard from "../components/StatCard";
import RecentLeads from "../components/recent_leads";
import AIInsights from "../components/ai_insights";

export default function Dashboard() {

    const [leads, setLeads] = useState([]);

    const fetchLeads = async () => {
        try {
            const response = await api.get("/leads");
            setLeads(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Greeting

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

    // Statistics

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
            : Math.round((converted / totalLeads) * 100);

    // Recent Leads

    const recentLeads = [...leads]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    return (
        <div>

            <h1 className="text-3xl font-bold">
                {greeting} {emoji}
            </h1>

            <p className="text-gray-500 mt-2">
                {totalLeads === 0
                    ? "Welcome! Start by adding your first lead."
                    : `You currently have ${totalLeads} active leads in your CRM.`}
            </p>

            {/* Statistics */}

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

            {/* Main Content */}

            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="col-span-2">

                    <RecentLeads
                        leads={recentLeads}
                    />

                </div>

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