import {
    LayoutDashboard,
    Users,
    Bot,
    Megaphone,
    Briefcase,
    DollarSign,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
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

            {/* Logo */}

            <div className="px-6 py-8 border-b">

                <h1 className="text-2xl font-bold text-blue-600">
                    Konaseema CRM
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Sustainable Solutions
                </p>

            </div>

            {/* Navigation */}

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

            {/* User */}

            <div className="border-t p-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h3 className="font-semibold">
                            Admin
                        </h3>

                        <p className="text-sm text-gray-500">
                            administrator
                        </p>

                    </div>

                    <LogOut
                        className="cursor-pointer hover:text-red-500"
                        size={20}
                    />

                </div>

            </div>

        </aside>
    );
}