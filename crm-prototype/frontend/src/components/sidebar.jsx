import {
    LayoutDashboard,
    Users,
    Bot,
    Megaphone,
    Briefcase,
    DollarSign,
    LogOut,
    ChevronRight,
    Sparkles,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";


export default function Sidebar() {

    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    const menus = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            description: "Overview",
        },

        {
            name: "Leads",
            path: "/leads",
            icon: Users,
            description: "Manage prospects",
        },

        {
            name: "AI Assistant",
            path: "/ai",
            icon: Bot,
            description: "Sales intelligence",
        },

        {
            name: "Campaigns",
            path: "/campaigns",
            icon: Megaphone,
            description: "Marketing campaigns",
        },

        {
            name: "Employees",
            path: "/employees",
            icon: Briefcase,
            description: "Team management",
        },

        {
            name: "Sales",
            path: "/sales",
            icon: DollarSign,
            description: "Revenue & payments",
        },

    ];


    const initials =
        user?.name
            ?.trim()
            ?.split(/\s+/)
            ?.slice(0, 2)
            ?.map((part) => part[0]?.toUpperCase())
            ?.join("")
        || "U";


    return (

        <aside className="
            flex
            h-screen
            w-[270px]
            shrink-0
            flex-col
            border-r
            border-slate-200
            bg-white
        ">

            {/* BRAND */}
            <div className="
                border-b
                border-slate-100
                px-6
                py-6
            ">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="group text-left"
                >

                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-600
                            text-white
                            shadow-sm
                        ">
                            <Sparkles size={19} />
                        </div>

                        <div>
                            <h1 className="
                                text-[19px]
                                font-bold
                                tracking-tight
                                text-slate-950
                            ">
                                Konaseema CRM
                            </h1>

                            <p className="
                                mt-0.5
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-slate-400
                            ">
                                Sustainable Solutions
                            </p>
                        </div>

                    </div>

                </button>

            </div>


            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto px-4 py-5">

                <p className="
                    px-3
                    pb-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                ">
                    Workspace
                </p>


                <nav className="space-y-1.5">

                    {menus.map((menu) => {

                        const Icon = menu.icon;

                        return (

                            <NavLink
                                key={menu.name}
                                to={menu.path}
                                className={({ isActive }) => `
                                    group
                                    relative
                                    flex
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    px-3
                                    py-3
                                    transition-all
                                    duration-200
                                    ${isActive
                                        ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                    }
                                `}
                            >

                                {({ isActive }) => (

                                    <>

                                        <div className={`
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            transition
                                            ${isActive
                                                ? "bg-white/15 text-white"
                                                : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600"
                                            }
                                        `}>
                                            <Icon size={19} strokeWidth={1.9} />
                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <p className={`
                                                text-sm
                                                font-semibold
                                                ${isActive
                                                    ? "text-white"
                                                    : "text-slate-700"
                                                }
                                            `}>
                                                {menu.name}
                                            </p>

                                            <p className={`
                                                mt-0.5
                                                truncate
                                                text-[10px]
                                                ${isActive
                                                    ? "text-blue-100"
                                                    : "text-slate-400"
                                                }
                                            `}>
                                                {menu.description}
                                            </p>

                                        </div>


                                        {isActive && (
                                            <ChevronRight
                                                size={16}
                                                className="shrink-0 text-white/80"
                                            />
                                        )}

                                    </>

                                )}

                            </NavLink>

                        );

                    })}

                </nav>

            </div>


            {/* ACCOUNT */}
            <div className="
                border-t
                border-slate-100
                p-4
            ">

                <div className="
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3
                ">

                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-900
                            text-xs
                            font-bold
                            text-white
                        ">
                            {initials}
                        </div>


                        <button
                            onClick={() => navigate("/profile")}
                            className="min-w-0 flex-1 text-left"
                        >

                            <p className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {user?.name || "User"}
                            </p>

                            <p className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-slate-400
                            ">
                                {user?.email || "Not logged in"}
                            </p>

                        </button>


                        <button
                            onClick={handleLogout}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                text-slate-400
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                            "
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogOut size={17} />
                        </button>

                    </div>

                </div>

            </div>

        </aside>

    );

}
