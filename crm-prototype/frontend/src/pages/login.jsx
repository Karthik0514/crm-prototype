import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==================================================
    // LOGIN
    // ==================================================

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");


        // Basic validation

        if (!email || !password) {

            setError(
                "Please enter your email and password."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await api.post(

                "/auth/login",

                {

                    email,

                    password

                }

            );


            // Save JWT token

            localStorage.setItem(

                "token",

                response.data.token

            );


            // Save user information

            if (response.data.user) {

                localStorage.setItem(

                    "user",

                    JSON.stringify(response.data.user)

                );

            }


            // Go to dashboard

            navigate("/dashboard");


        }

        catch (error) {

            console.error(
                "Login failed:",
                error
            );


            setError(

                error.response?.data?.message ||

                "Login failed. Please try again."

            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">


            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">


                <h1 className="mb-2 text-center text-3xl font-bold">

                    CRM Login

                </h1>


                <p className="mb-8 text-center text-sm text-gray-500">

                    Sign in to access your CRM dashboard

                </p>


                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="mb-4">

                        <label className="mb-2 block text-sm font-medium">

                            Email

                        </label>


                        <input

                            type="email"

                            value={email}

                            onChange={(event) =>

                                setEmail(
                                    event.target.value
                                )

                            }

                            placeholder="Enter your email"

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "

                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="mb-5">

                        <label className="mb-2 block text-sm font-medium">

                            Password

                        </label>


                        <input

                            type="password"

                            value={password}

                            onChange={(event) =>

                                setPassword(
                                    event.target.value
                                )

                            }

                            placeholder="Enter your password"

                            className="
                                w-full
                                rounded-xl
                                border
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "

                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="
                            mb-5
                            rounded-xl
                            bg-red-50
                            p-3
                            text-sm
                            text-red-600
                        ">

                            {error}

                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button

                        type="submit"

                        disabled={loading}

                        className="
                            w-full
                            rounded-xl
                            bg-blue-600
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "

                    >

                        {

                            loading

                                ? "Logging in..."

                                : "Login"

                        }

                    </button>


                </form>


            </div>


        </div>

    );

}