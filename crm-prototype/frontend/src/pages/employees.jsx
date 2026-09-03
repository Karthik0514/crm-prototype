import {
    useEffect,
    useState
} from "react";

import {
    Search,
    UserPlus,
    Users
} from "lucide-react";

import api from "../services/api";

import AddEmployeeModal from
    "../components/add_employee_model";


export default function Employees() {


    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [addEmployeeOpen,
        setAddEmployeeOpen] =
        useState(false);


    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

    const fetchEmployees = async () => {

        try {

            setLoading(true);


            const response =
                await api.get(
                    "/employees"
                );


            setEmployees(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to fetch employees:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchEmployees();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredEmployees =
        employees.filter((employee) => {

            const searchValue =
                search.toLowerCase();


            return (

                employee.name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                employee.email
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                employee.role
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                employee.department
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        });


    // ==========================================
    // STATUS STYLES
    // ==========================================

    const getStatusStyle =
        (status) => {

            switch (status) {

                case "Active":

                    return
                    "bg-green-100 text-green-700";


                case "Busy":

                    return
                    "bg-orange-100 text-orange-700";


                case "On Leave":

                    return
                    "bg-yellow-100 text-yellow-700";


                case "Inactive":

                    return
                    "bg-gray-100 text-gray-700";


                default:

                    return
                    "bg-blue-100 text-blue-700";

            }

        };


    return (

        <div className="space-y-6">


            {/* HEADER */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <h1 className="
                        text-3xl
                        font-bold
                    ">

                        Employees

                    </h1>


                    <p className="
                        mt-1
                        text-gray-500
                    ">

                        Manage your team members.

                    </p>

                </div>


                <button

                    onClick={() =>
                        setAddEmployeeOpen(true)
                    }

                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-3
                        font-medium
                        text-white
                        shadow
                        hover:bg-blue-700
                    "

                >

                    <UserPlus size={20} />

                    Add Employee

                </button>

            </div>


            {/* SEARCH */}

            <div className="
                relative
                max-w-md
            ">

                <Search

                    size={19}

                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "

                />


                <input

                    type="text"

                    value={search}

                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }

                    placeholder="
                        Search employees...
                    "

                    className="
                        w-full
                        rounded-xl
                        border
                        bg-white
                        py-3
                        pl-11
                        pr-4
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "

                />

            </div>


            {/* EMPLOYEES TABLE */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                bg-white
            ">


                {loading ? (

                    <div className="
                        p-12
                        text-center
                        text-gray-500
                    ">

                        Loading employees...

                    </div>

                ) : employees.length === 0 ? (

                    <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-20
                        text-center
                    ">

                        <div className="
                            mb-4
                            rounded-full
                            bg-blue-50
                            p-5
                            text-blue-600
                        ">

                            <Users size={40} />

                        </div>


                        <h2 className="
                            text-xl
                            font-bold
                        ">

                            No employees yet

                        </h2>


                        <p className="
                            mt-2
                            max-w-md
                            text-gray-500
                        ">

                            Start building your team by
                            adding your first employee.

                        </p>


                        <button

                            onClick={() =>
                                setAddEmployeeOpen(true)
                            }

                            className="
                                mt-6
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                text-white
                                hover:bg-blue-700
                            "

                        >

                            Add Your First Employee

                        </button>

                    </div>

                ) : filteredEmployees.length === 0 ? (

                    <div className="
                        p-12
                        text-center
                        text-gray-500
                    ">

                        No employees found for "
                        {search}
                        ".

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            text-left
                        ">

                            <thead className="
                                border-b
                                bg-gray-50
                                text-sm
                                text-gray-500
                            ">

                                <tr>

                                    <th className="
                                        px-6
                                        py-4
                                        font-medium
                                    ">

                                        Employee

                                    </th>


                                    <th className="
                                        px-6
                                        py-4
                                        font-medium
                                    ">

                                        Contact

                                    </th>


                                    <th className="
                                        px-6
                                        py-4
                                        font-medium
                                    ">

                                        Role

                                    </th>


                                    <th className="
                                        px-6
                                        py-4
                                        font-medium
                                    ">

                                        Department

                                    </th>


                                    <th className="
                                        px-6
                                        py-4
                                        font-medium
                                    ">

                                        Status

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredEmployees.map(
                                    (employee) => (

                                        <tr

                                            key={
                                                employee.id
                                            }

                                            className="
                                                border-b
                                                last:border-0
                                                hover:bg-gray-50
                                            "

                                        >

                                            <td className="
                                                px-6
                                                py-5
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-100
                                                        font-bold
                                                        text-blue-600
                                                    ">

                                                        {
                                                            employee.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                        }

                                                    </div>


                                                    <span className="
                                                        font-semibold
                                                    ">

                                                        {
                                                            employee.name
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            <td className="
                                                px-6
                                                py-5
                                                text-gray-600
                                            ">

                                                <div>

                                                    {
                                                        employee.email
                                                    }

                                                </div>


                                                {employee.phone && (

                                                    <div className="
                                                        mt-1
                                                        text-sm
                                                        text-gray-400
                                                    ">

                                                        {
                                                            employee.phone
                                                        }

                                                    </div>

                                                )}

                                            </td>


                                            <td className="
                                                px-6
                                                py-5
                                            ">

                                                {
                                                    employee.role
                                                }

                                            </td>


                                            <td className="
                                                px-6
                                                py-5
                                                text-gray-600
                                            ">

                                                {
                                                    employee.department ||
                                                    "-"
                                                }

                                            </td>


                                            <td className="
                                                px-6
                                                py-5
                                            ">

                                                <span className={`
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-medium
                                                    ${getStatusStyle(
                                                    employee.status
                                                )
                                                    }
                                                `}>

                                                    {
                                                        employee.status
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ADD EMPLOYEE MODAL */}

            <AddEmployeeModal

                open={
                    addEmployeeOpen
                }

                setOpen={
                    setAddEmployeeOpen
                }

                fetchEmployees={
                    fetchEmployees
                }

            />


        </div>

    );

}