import { useEffect, useMemo, useState } from "react";

import {
    Bell,
    User,
    X,
    CheckCheck,
    Trash2,
    ChevronRight,
    CircleCheck,
    Info,
    AlertCircle,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import api from "../services/api";


const pageMeta = {
    "/dashboard": {
        title: "Dashboard",
        description: "Monitor your CRM performance and sales activity.",
    },

    "/leads": {
        title: "Leads",
        description: "Manage prospects, engagement, and opportunities.",
    },

    "/ai": {
        title: "AI Assistant",
        description: "Use AI to analyze leads and accelerate sales.",
    },

    "/campaigns": {
        title: "Campaigns",
        description: "Create and monitor your marketing campaigns.",
    },

    "/employees": {
        title: "Employees",
        description: "Manage your sales team and employee records.",
    },

    "/sales": {
        title: "Sales",
        description: "Track revenue, payments, and converted customers.",
    },

    "/profile": {
        title: "Profile",
        description: "Manage your account and personal information.",
    },
};


function getPageMeta(pathname) {

    if (pageMeta[pathname]) {
        return pageMeta[pathname];
    }

    if (pathname.startsWith("/lead/")) {
        return {
            title: "Lead Details",
            description: "Review lead information and CRM activity.",
        };
    }

    return {
        title: "Konaseema CRM",
        description: "Manage your customer relationships.",
    };
}


function getNotificationIcon(type) {

    if (type === "converted") {
        return <CircleCheck size={17} />;
    }

    if (type === "status_change") {
        return <Info size={17} />;
    }

    return <AlertCircle size={17} />;

}


export default function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);


    const meta = useMemo(
        () => getPageMeta(location.pathname),
        [location.pathname]
    );


    const fetchNotifications = async () => {

        try {

            const response = await api.get("/notifications");

            setNotifications(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        }

    };


    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(
            fetchNotifications,
            3000
        );

        return () => clearInterval(interval);

    }, []);


    const unreadCount =
        notifications.filter(
            (notification) =>
                notification.is_read === 0
        ).length;


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


    const formatDate = (value) => {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString(
            [],
            {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );

    };


    return (

        <header className="
            sticky
            top-0
            z-40
            flex
            h-[88px]
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white/95
            px-6
            backdrop-blur
            lg:px-8
        ">

            {/* PAGE CONTEXT */}
            <div className="min-w-0">

                <div className="
                    mb-1
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                ">

                    <span>Workspace</span>

                    <ChevronRight size={12} />

                    <span className="text-blue-600">
                        {meta.title}
                    </span>

                </div>


                <h2 className="
                    truncate
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-950
                ">
                    {meta.title}
                </h2>

                <p className="
                    hidden
                    truncate
                    text-xs
                    text-slate-400
                    sm:block
                ">
                    {meta.description}
                </p>

            </div>


            {/* ACTIONS */}
            <div className="
                flex
                shrink-0
                items-center
                gap-2
                sm:gap-3
            ">

                <button
                    onClick={() => navigate("/profile")}
                    className="
                        cursor-pointer
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        text-slate-500
                        shadow-sm
                        transition
                        hover:border-blue-100
                        hover:bg-blue-50
                        hover:text-blue-600
                    "
                    title="Profile"
                    aria-label="Profile"
                >
                    <User size={19} />
                </button>


                {/* NOTIFICATIONS */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowNotifications(
                                (current) => !current
                            )
                        }
                        className="
                            cursor-pointer
                            relative
                            z-10
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-600
                            shadow-sm
                            transition
                            hover:border-blue-200
                            hover:bg-blue-50
                            hover:text-blue-600
                        "
                        title="Notifications"
                        aria-label="Notifications"
                    >

                        <Bell
                            size={20}
                            strokeWidth={2}
                        />

                        {unreadCount > 0 && (
                            <span className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                min-h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                border-white
                                bg-red-500
                                px-1
                                text-[10px]
                                font-bold
                                text-white
                            ">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}

                    </button>


                    {showNotifications && (

                        <div className="
                            absolute
                            right-0
                            top-14
                            w-[380px]
                            max-w-[calc(100vw-32px)]
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-[0_20px_60px_rgba(15,23,42,0.15)]
                        ">

                            {/* HEADER */}
                            <div className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-slate-100
                                px-5
                                py-4
                            ">

                                <div>
                                    <h3 className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    ">
                                        Notifications
                                    </h3>

                                    <p className="
                                        mt-0.5
                                        text-[11px]
                                        text-slate-400
                                    ">
                                        {unreadCount
                                            ? `${unreadCount} unread`
                                            : "You're all caught up"}
                                    </p>
                                </div>


                                <div className="flex items-center gap-1">

                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-xl
                                                text-slate-400
                                                transition
                                                hover:bg-blue-50
                                                hover:text-blue-600
                                            "
                                            title="Mark all as read"
                                        >
                                            <CheckCheck size={16} />
                                        </button>
                                    )}


                                    <button
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-xl
                                            text-slate-400
                                            transition
                                            hover:bg-slate-100
                                            hover:text-slate-700
                                        "
                                        title="Close"
                                    >
                                        <X size={16} />
                                    </button>

                                </div>

                            </div>


                            {/* LIST */}
                            <div className="max-h-[420px] overflow-y-auto">

                                {notifications.length === 0 ? (

                                    <div className="
                                        px-6
                                        py-14
                                        text-center
                                    ">

                                        <div className="
                                            mx-auto
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-slate-50
                                            text-slate-400
                                        ">
                                            <Bell size={20} />
                                        </div>

                                        <p className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        ">
                                            No notifications
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        ">
                                            New CRM activity will appear here.
                                        </p>

                                    </div>

                                ) : (

                                    notifications.map(
                                        (notification) => (

                                            <div
                                                key={notification.id}
                                                onClick={() => {

                                                    if (
                                                        notification.is_read === 0
                                                    ) {
                                                        markAsRead(
                                                            notification.id
                                                        );
                                                    }

                                                }}
                                                className={`
                                                    group
                                                    cursor-pointer
                                                    border-b
                                                    border-slate-100
                                                    px-5
                                                    py-4
                                                    transition
                                                    hover:bg-slate-50
                                                    ${notification.is_read === 0
                                                        ? "bg-blue-50/60"
                                                        : "bg-white"
                                                    }
                                                `}
                                            >

                                                <div className="flex gap-3">

                                                    <div className={`
                                                        mt-0.5
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${notification.type === "converted"
                                                            ? "bg-violet-50 text-violet-600"
                                                            : notification.type === "status_change"
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "bg-amber-50 text-amber-600"
                                                        }
                                                    `}>
                                                        {getNotificationIcon(
                                                            notification.type
                                                        )}
                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-start justify-between gap-3">

                                                            <h4 className="
                                                                text-xs
                                                                font-bold
                                                                text-slate-800
                                                            ">
                                                                {notification.title}
                                                            </h4>


                                                            <button
                                                                onClick={(event) => {

                                                                    event.stopPropagation();

                                                                    deleteNotification(
                                                                        notification.id
                                                                    );

                                                                }}
                                                                className="
                                                                    flex
                                                                    h-7
                                                                    w-7
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    text-slate-300
                                                                    opacity-0
                                                                    transition
                                                                    group-hover:opacity-100
                                                                    hover:bg-red-50
                                                                    hover:text-red-500
                                                                "
                                                                title="Delete notification"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>

                                                        </div>


                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            leading-5
                                                            text-slate-500
                                                        ">
                                                            {notification.message}
                                                        </p>


                                                        <p className="
                                                            mt-2
                                                            text-[10px]
                                                            font-medium
                                                            text-slate-400
                                                        ">
                                                            {formatDate(
                                                                notification.created_at
                                                            )}
                                                        </p>

                                                    </div>

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
