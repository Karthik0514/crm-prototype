import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    return (

        <div className="flex justify-center items-center h-screen bg-slate-100">

            <div className="bg-white p-10 rounded-xl shadow w-96">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    CRM Login
                </h1>

                <input
                    placeholder="Email"
                    className="border p-3 w-full mb-4 rounded"
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-3 w-full mb-4 rounded"
                />

                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-blue-600 text-white py-3 rounded"
                >
                    Login
                </button>

            </div>

        </div>

    )

}