import { useEffect, useState } from "react";
import api from "../services/api";

export default function AddEmployeeModal({

    open,
    setOpen,
    fetchEmployees

}) {

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        status: "Active"

    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (!open) {

            setFormData({

                name: "",
                email: "",
                phone: "",
                role: "",
                department: "",
                status: "Active"

            });

            setError("");

        }

    }, [open]);


    const handleChange = (event) => {

        const {

            name,
            value

        } = event.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        try {

            setLoading(true);


            await api.post(

                "/employees",

                formData

            );


            await fetchEmployees();


            setOpen(false);


        } catch (error) {

            console.error(
                "Add employee error:",
                error
            );


            setError(

                error.response?.data?.message ||

                "Failed to add employee"

            );

        } finally {

            setLoading(false);

        }

    };


    if (!open) {

        return null;

    }


    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
        ">


            <div className="
                w-full
                max-w-lg
                rounded-2xl
                bg-white
                p-6
                shadow-xl
            ">


                {/* HEADER */}

                <div className="
                    mb-6
                    flex
                    items-start
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-2xl
                            font-bold
                        ">

                            Add Employee

                        </h2>


                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">

                            Add a new employee to your CRM.

                        </p>

                    </div>


                    <button

                        type="button"

                        onClick={() =>
                            setOpen(false)
                        }

                        className="
                            rounded-lg
                            px-3
                            py-1
                            text-xl
                            text-gray-500
                            hover:bg-gray-100
                        "

                    >

                        ×

                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                >


                    {/* NAME */}

                    <div className="mb-4">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                        ">

                            Full Name *

                        </label>


                        <input

                            type="text"

                            name="name"

                            value={
                                formData.name
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="
                                Enter employee name
                            "

                            required

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    {/* EMAIL */}

                    <div className="mb-4">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                        ">

                            Email *

                        </label>


                        <input

                            type="email"

                            name="email"

                            value={
                                formData.email
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="
                                employee@company.com
                            "

                            required

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    {/* PHONE */}

                    <div className="mb-4">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                        ">

                            Phone

                        </label>


                        <input

                            type="tel"

                            name="phone"

                            value={
                                formData.phone
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="
                                Enter phone number
                            "

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    {/* ROLE + DEPARTMENT */}

                    <div className="
                        grid
                        grid-cols-2
                        gap-4
                        mb-4
                    ">


                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">

                                Role *

                            </label>


                            <input

                                type="text"

                                name="role"

                                value={
                                    formData.role
                                }

                                onChange={
                                    handleChange
                                }

                                placeholder="
                                    Sales Executive
                                "

                                required

                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-blue-500
                                "

                            />

                        </div>


                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">

                                Department

                            </label>


                            <input

                                type="text"

                                name="department"

                                value={
                                    formData.department
                                }

                                onChange={
                                    handleChange
                                }

                                placeholder="
                                    Sales
                                "

                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-blue-500
                                "

                            />

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="mb-5">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                        ">

                            Status

                        </label>


                        <select

                            name="status"

                            value={
                                formData.status
                            }

                            onChange={
                                handleChange
                            }

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        >

                            <option value="Active">

                                Active

                            </option>


                            <option value="Busy">

                                Busy

                            </option>


                            <option value="On Leave">

                                On Leave

                            </option>


                            <option value="Inactive">

                                Inactive

                            </option>

                        </select>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="
                            mb-4
                            rounded-xl
                            bg-red-50
                            p-3
                            text-sm
                            text-red-600
                        ">

                            {error}

                        </div>

                    )}


                    {/* BUTTONS */}

                    <div className="
                        flex
                        justify-end
                        gap-3
                    ">

                        <button

                            type="button"

                            onClick={() =>
                                setOpen(false)
                            }

                            disabled={loading}

                            className="
                                rounded-xl
                                border
                                px-5
                                py-3
                                hover:bg-gray-50
                            "

                        >

                            Cancel

                        </button>


                        <button

                            type="submit"

                            disabled={loading}

                            className="
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-60
                            "

                        >

                            {

                                loading

                                    ? "Adding..."

                                    : "Add Employee"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}