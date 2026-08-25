import {
    LayoutDashboard,
    Users,
    Bot,
    Megaphone,
    Briefcase,
    DollarSign,
    LogOut,
} from "lucide-react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";


export default function Sidebar() {


    // ==========================================
    // NAVIGATION
    // ==========================================

    const navigate = useNavigate();


    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const storedUser = localStorage.getItem("user");


    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };


    // ==========================================
    // SIDEBAR MENU
    // ==========================================

    const menus = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: "Leads",
            path: "/leads",
            icon: Users,
        },

        {
            name: "AI Assistant",
            path: "/ai",
            icon: Bot,
        },

        {
            name: "Campaigns",
            path: "/campaigns",
            icon: Megaphone,
        },

        {
            name: "Employees",
            path: "/employees",
            icon: Briefcase,
        },

        {
            name: "Sales",
            path: "/sales",
            icon: DollarSign,
        },

    ];


    return (

        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">


            {/* ========================================== */}
            {/* LOGO */}
            {/* ========================================== */}

            <div className="px-6 py-8 border-b">

                <h1 className="text-2xl font-bold text-blue-600">

                    Konaseema CRM

                </h1>


                <p className="text-sm text-gray-500 mt-1">

                    Sustainable Solutions

                </p>

            </div>


            {/* ========================================== */}
            {/* NAVIGATION */}
            {/* ========================================== */}

            <nav className="flex-1 p-4">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    return (

                        <NavLink

                            key={menu.name}

                            to={menu.path}

                            className={({ isActive }) =>

                                `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all

                                ${isActive

                                    ? "bg-blue-600 text-white shadow"

                                    : "text-gray-600 hover:bg-gray-100"

                                }`

                            }

                        >

                            <Icon size={20} />


                            <span className="font-medium">

                                {menu.name}

                            </span>

                        </NavLink>

                    );

                })}

            </nav>


            {/* ========================================== */}
            {/* LOGGED-IN USER */}
            {/* ========================================== */}

            <div className="border-t p-5">

                <div className="flex items-center justify-between">


                    <div className="overflow-hidden">

                        <h3 className="font-semibold truncate">

                            {user?.name || "User"}

                        </h3>


                        <p className="text-sm text-gray-500 truncate">

                            {user?.email || "Not logged in"}

                        </p>

                    </div>


                    {/* LOGOUT BUTTON */}

                    <button

                        onClick={handleLogout}

                        className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition"

                        title="Logout"

                    >

                        <LogOut size={20} />

                    </button>


                </div>

            </div>


        </aside>

    );

}