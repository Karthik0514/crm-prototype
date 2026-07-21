import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen">

            <Sidebar />

            <div className="flex flex-col flex-1">

                <Navbar />

                <main className="p-6 bg-slate-100 flex-1 overflow-y-auto">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}