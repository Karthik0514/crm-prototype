const sales = [
    {
        customer: "ABC Pvt Ltd",
        amount: "₹3,20,000",
        status: "Paid",
    },
    {
        customer: "Green Solar",
        amount: "₹1,80,000",
        status: "Pending",
    },
];

export default function Sales() {
    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Sales
            </h1>

            <div className="grid grid-cols-4 gap-5 mb-8">

                <div className="bg-white p-6 rounded-xl border">
                    Revenue
                    <h2 className="text-3xl font-bold mt-2">₹18.4L</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    Paid
                    <h2 className="text-3xl font-bold mt-2">₹12L</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    Pending
                    <h2 className="text-3xl font-bold mt-2">₹6.4L</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    Deals
                    <h2 className="text-3xl font-bold mt-2">48</h2>
                </div>

            </div>

            <table className="bg-white w-full rounded-xl border">

                <thead>

                    <tr>

                        <th className="p-4 text-left">Customer</th>

                        <th>Amount</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {sales.map((s) => (

                        <tr key={s.customer} className="border-t">

                            <td className="p-4">{s.customer}</td>

                            <td>{s.amount}</td>

                            <td>{s.status}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}