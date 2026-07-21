import StatCard from "../components/StatCard";
import RecentLeads from "../components/recent_leads";
import AIInsights from "../components/ai_insights";

export default function Dashboard() {
    return (
        <div>

            <h1 className="text-3xl font-bold">
                Good Afternoon 👋
            </h1>

            <p className="text-gray-500 mt-2">
                Welcome back to Konaseema CRM
            </p>

            <div className="grid grid-cols-4 gap-6 mt-8">

                <StatCard
                    title="Total Leads"
                    value="156"
                    color="text-blue-600"
                />

                <StatCard
                    title="Interested"
                    value="42"
                    color="text-green-600"
                />

                <StatCard
                    title="Converted"
                    value="18"
                    color="text-purple-600"
                />

                <StatCard
                    title="Follow Ups"
                    value="11"
                    color="text-orange-500"
                />

            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="col-span-2">

                    <RecentLeads />

                </div>

                <AIInsights />

            </div>

        </div>
    );
}