import { Bell, Search } from "lucide-react";

export default function Navbar() {
    return (
        <header className="bg-white h-20 border-b px-8 flex items-center justify-between">

            <div>

                <h2 className="text-2xl font-bold">
                    Dashboard
                </h2>

                <p className="text-gray-500 text-sm">
                    Monitor your leads and sales
                </p>

            </div>

            <div className="flex items-center gap-5">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <Bell
                    className="cursor-pointer"
                    size={22}
                />

            </div>

        </header>
    );
}