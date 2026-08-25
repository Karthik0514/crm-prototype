import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    return (

        <header className="bg-white h-20 border-b px-8 flex items-center justify-between">

            {/* Page Title */}

            <div>

                <h2 className="text-2xl font-bold">
                    Dashboard
                </h2>

                <p className="text-gray-500 text-sm">
                    Monitor your leads and sales
                </p>

            </div>


            {/* Right Side */}

            <div className="flex items-center gap-5">

                {/* Profile */}

                <button
                    onClick={() => navigate("/profile")}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Profile"
                >

                    <User size={24} />

                </button>


                {/* Notifications */}

                <Bell
                    className="cursor-pointer"
                    size={22}
                />

            </div>

        </header>

    );

}