const employees = [
    {
        id: 1,
        name: "John Doe",
        role: "Sales Executive",
        leads: 28,
        status: "Active",
    },
    {
        id: 2,
        name: "Sneha Reddy",
        role: "Sales Executive",
        leads: 15,
        status: "Active",
    },
    {
        id: 3,
        name: "Rahul Kumar",
        role: "Manager",
        leads: 42,
        status: "Busy",
    },
];

export default function Employees() {
    return (
        <div>

            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">Employees</h1>

                <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
                    + Add Employee
                </button>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th>Role</th>
                            <th>Assigned Leads</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {employees.map(emp => (

                            <tr key={emp.id} className="border-t">

                                <td className="p-4">{emp.name}</td>

                                <td>{emp.role}</td>

                                <td>{emp.leads}</td>

                                <td>{emp.status}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}