export default function AIInsights() {
    return (

        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold mb-5">
                AI Insights
            </h2>

            <div className="space-y-4">

                <div className="bg-blue-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        🔥 Hot Leads
                    </h3>

                    <p className="text-gray-600 mt-2">

                        5 leads have over 90% buying intent.

                    </p>

                </div>

                <div className="bg-orange-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        📞 Follow-ups
                    </h3>

                    <p className="text-gray-600 mt-2">

                        3 customers require follow-up today.

                    </p>

                </div>

                <div className="bg-green-50 rounded-xl p-4">

                    <h3 className="font-semibold">
                        💰 Potential Revenue
                    </h3>

                    <p className="text-gray-600 mt-2">

                        ₹4.25 Lakhs estimated conversion.

                    </p>

                </div>

            </div>

        </div>

    );
}