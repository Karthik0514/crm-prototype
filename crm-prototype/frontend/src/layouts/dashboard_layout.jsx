import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100">

            {/* ========================================= */}
            {/* SIDEBAR */}
            {/* ========================================= */}

            <div className="shrink-0">
                <Sidebar />
            </div>


            {/* ========================================= */}
            {/* MAIN APPLICATION AREA */}
            {/* ========================================= */}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* ========================================= */}
                {/* TOP NAVBAR */}
                {/* ========================================= */}

                <div className="shrink-0">
                    <Navbar />
                </div>


                {/* ========================================= */}
                {/* PAGE CONTENT */}
                {/* ========================================= */}

                <main
                    className="
                        min-w-0
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        bg-slate-100
                        p-6
                    "
                >
                    <div className="min-w-0 w-full">
                        <Outlet />
                    </div>
                </main>

            </div>

        </div>
    );
}