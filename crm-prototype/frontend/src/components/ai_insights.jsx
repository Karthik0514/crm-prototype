export default function AIInsights({
    interested,
    followUps,
    converted,
    newLeads
}) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold mb-5">
                AI Insights
            </h2>

            <div className="space-y-4">

                <div className="bg-blue-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        🔥 Priority Leads
                    </h3>

                    <p className="text-gray-600 mt-2">

                        {interested === 0
                            ? "No high-priority leads at the moment."
                            : `${interested} interested lead${interested !== 1 ? "s are" : " is"} ready for immediate follow-up.`}

                    </p>

                </div>

                <div className="bg-orange-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        📞 Follow-up Reminder
                    </h3>

                    <p className="text-gray-600 mt-2">

                        {followUps === 0
                            ? "No pending follow-ups."
                            : `${followUps} lead${followUps !== 1 ? "s require" : " requires"} your attention today.`}

                    </p>

                </div>

                <div className="bg-green-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        🤖 AI Recommendation
                    </h3>

                    <p className="text-gray-600 mt-2">

                        {newLeads > interested
                            ? "Reach out to newly added leads to improve conversion opportunities."
                            : interested > 0
                                ? "Focus on interested leads first. They have the highest chance of conversion."
                                : converted > 0
                                    ? "Great progress! Keep nurturing new leads to maintain conversions."
                                    : "Add more leads to start receiving AI recommendations."}

                    </p>

                </div>

            </div>

        </div>

    );
}