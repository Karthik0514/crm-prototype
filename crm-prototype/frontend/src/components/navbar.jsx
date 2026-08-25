import { useEffect, useState } from "react";
import {
    Bell,
    User,
    X,
    CheckCheck,
    Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function Navbar() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] =
        useState(false);


    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    const fetchNotifications = async () => {

        try {

            const response =
                await api.get("/notifications");

            setNotifications(response.data);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        }

    };


    // ==========================================
    // AUTO REFRESH NOTIFICATIONS
    // ==========================================

    useEffect(() => {

        // Load immediately
        fetchNotifications();

        // Check every 3 seconds
        const interval = setInterval(() => {

            fetchNotifications();

        }, 3000);


        // Stop interval when component closes
        return () => {

            clearInterval(interval);

        };

    }, []);


    // ==========================================
    // UNREAD COUNT
    // ==========================================

    const unreadCount =
        notifications.filter(
            notification => notification.is_read === 0
        ).length;


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    const markAsRead = async (id) => {

        try {

            await api.put(
                `/notifications/${id}/read`
            );

            fetchNotifications();

        } catch (error) {

            console.error(error);

        }

    };


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    const markAllAsRead = async () => {

        try {

            await api.put(
                "/notifications/read/all"
            );

            fetchNotifications();

        } catch (error) {

            console.error(error);

        }

    };


    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    const deleteNotification = async (id) => {

        try {

            await api.delete(
                `/notifications/${id}`
            );

            fetchNotifications();

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <header className="bg-white h-20 border-b px-8 flex items-center justify-between relative">

            {/* ========================================== */}
            {/* PAGE TITLE */}
            {/* ========================================== */}

            <div>

                <h2 className="text-2xl font-bold">

                    Dashboard

                </h2>


                <p className="text-gray-500 text-sm">

                    Monitor your leads and sales

                </p>

            </div>


            {/* ========================================== */}
            {/* RIGHT SIDE */}
            {/* ========================================== */}

            <div className="flex items-center gap-5">


                {/* PROFILE BUTTON */}

                <button

                    onClick={() =>
                        navigate("/profile")
                    }

                    className="p-2 hover:bg-gray-100 rounded-lg transition"

                    title="Profile"

                >

                    <User size={22} />

                </button>


                {/* ========================================== */}
                {/* NOTIFICATION BUTTON */}
                {/* ========================================== */}

                <div className="relative">

                    <button

                        onClick={() =>

                            setShowNotifications(
                                !showNotifications
                            )

                        }

                        className="relative p-2 hover:bg-gray-100 rounded-lg transition"

                        title="Notifications"

                    >

                        <Bell size={22} />


                        {/* RED BADGE */}

                        {unreadCount > 0 && (

                            <span
                                className="
                                    absolute
                                    -top-1
                                    -right-1
                                    bg-red-500
                                    text-white
                                    text-xs
                                    min-w-5
                                    h-5
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    px-1
                                "
                            >

                                {unreadCount}

                            </span>

                        )}

                    </button>


                    {/* ========================================== */}
                    {/* NOTIFICATION DROPDOWN */}
                    {/* ========================================== */}

                    {showNotifications && (

                        <div
                            className="
                                absolute
                                right-0
                                top-12
                                w-96
                                bg-white
                                border
                                rounded-xl
                                shadow-xl
                                z-50
                                overflow-hidden
                            "
                        >


                            {/* HEADER */}

                            <div className="flex items-center justify-between p-4 border-b">

                                <h3 className="font-semibold text-lg">

                                    Notifications

                                </h3>


                                <div className="flex items-center gap-2">


                                    {unreadCount > 0 && (

                                        <button

                                            onClick={markAllAsRead}

                                            className="
                                                p-1
                                                hover:bg-gray-100
                                                rounded
                                            "

                                            title="Mark all as read"

                                        >

                                            <CheckCheck
                                                size={18}
                                            />

                                        </button>

                                    )}


                                    <button

                                        onClick={() =>
                                            setShowNotifications(false)
                                        }

                                        className="
                                            p-1
                                            hover:bg-gray-100
                                            rounded
                                        "

                                    >

                                        <X size={18} />

                                    </button>

                                </div>

                            </div>


                            {/* NOTIFICATION LIST */}

                            <div className="max-h-96 overflow-y-auto">

                                {notifications.length === 0 ? (

                                    <div className="p-8 text-center text-gray-500">

                                        No notifications yet

                                    </div>

                                ) : (

                                    notifications.map(
                                        (notification) => (

                                            <div

                                                key={notification.id}

                                                className={`
                                                    p-4
                                                    border-b
                                                    cursor-pointer
                                                    transition
                                                    hover:bg-gray-50
                                                    ${notification.is_read === 0
                                                        ? "bg-blue-50"
                                                        : ""
                                                    }
                                                `}

                                                onClick={() => {

                                                    if (
                                                        notification.is_read === 0
                                                    ) {

                                                        markAsRead(
                                                            notification.id
                                                        );

                                                    }

                                                }}

                                            >

                                                <div className="flex justify-between gap-3">


                                                    <div>

                                                        <h4 className="font-semibold">

                                                            {notification.title}

                                                        </h4>


                                                        <p className="text-sm text-gray-600 mt-1">

                                                            {
                                                                notification.message
                                                            }

                                                        </p>


                                                        <p className="text-xs text-gray-400 mt-2">

                                                            {
                                                                notification.created_at
                                                            }

                                                        </p>

                                                    </div>


                                                    {/* DELETE */}

                                                    <button

                                                        onClick={(event) => {

                                                            event.stopPropagation();

                                                            deleteNotification(
                                                                notification.id
                                                            );

                                                        }}

                                                        className="
                                                            text-gray-400
                                                            hover:text-red-500
                                                            h-fit
                                                        "

                                                        title="Delete notification"

                                                    >

                                                        <Trash2
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        )

                                    )

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}