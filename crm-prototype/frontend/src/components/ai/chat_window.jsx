import {
    Bot,
    User,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Mail,
    MessageSquare,
    Phone,
    UserRound,
    Building2,
    Target,
    ArrowRight,
} from "lucide-react";


// ============================================================
// FORMAT AI RESPONSE
// ============================================================

function formatAIResponse(text) {
    if (!text) return null;

    const lines = String(text)
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const elements = [];

    let bulletItems = [];

    const flushBullets = () => {
        if (bulletItems.length === 0) return;

        elements.push(
            <ul
                key={`bullets-${elements.length}`}
                className="space-y-2 my-3"
            >
                {bulletItems.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-start gap-2 text-sm leading-6"
                    >
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span>{formatInline(item)}</span>
                    </li>
                ))}
            </ul>
        );

        bulletItems = [];
    };

    lines.forEach((line, index) => {

        // ----------------------------------------------------
        // BULLET POINTS
        // ----------------------------------------------------

        if (
            line.startsWith("- ") ||
            line.startsWith("* ") ||
            line.startsWith("• ")
        ) {
            bulletItems.push(
                line.replace(/^[-*•]\s*/, "")
            );

            return;
        }

        flushBullets();


        // ----------------------------------------------------
        // NUMBERED LIST
        // ----------------------------------------------------

        if (/^\d+\.\s+/.test(line)) {

            const match = line.match(/^\d+\.\s+(.*)$/);

            elements.push(
                <div
                    key={index}
                    className="flex items-start gap-3 my-2"
                >
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {line.match(/^\d+/)?.[0]}
                    </div>

                    <div className="text-sm leading-6">
                        {formatInline(match?.[1] || line)}
                    </div>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // HEADINGS
        // ----------------------------------------------------

        if (
            line.startsWith("### ") ||
            line.startsWith("## ") ||
            line.startsWith("# ")
        ) {
            const heading = line.replace(/^#{1,3}\s*/, "");

            elements.push(
                <h3
                    key={index}
                    className="font-semibold text-gray-900 text-base mt-4 mb-2"
                >
                    {heading}
                </h3>
            );

            return;
        }


        // ----------------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------------

        if (
            line.includes("successfully") ||
            line.includes("Success") ||
            line.includes("completed successfully")
        ) {
            elements.push(
                <div
                    key={index}
                    className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3 my-3"
                >
                    <CheckCircle2
                        size={19}
                        className="text-green-600 mt-0.5 flex-shrink-0"
                    />

                    <p className="text-sm text-green-800 leading-6">
                        {formatInline(line)}
                    </p>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // ERROR / WARNING
        // ----------------------------------------------------

        if (
            line.toLowerCase().includes("error") ||
            line.toLowerCase().includes("failed") ||
            line.toLowerCase().includes("couldn't")
        ) {
            elements.push(
                <div
                    key={index}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 my-3"
                >
                    <AlertCircle
                        size={19}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                    />

                    <p className="text-sm text-red-800 leading-6">
                        {formatInline(line)}
                    </p>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // LEAD INFORMATION
        // ----------------------------------------------------

        const leadMatch = line.match(
            /^(?:Lead|Name):\s*(.+)$/i
        );

        if (leadMatch) {

            elements.push(
                <div
                    key={index}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 my-2"
                >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <UserRound
                            size={18}
                            className="text-white"
                        />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Lead
                        </p>

                        <p className="font-semibold text-gray-900">
                            {leadMatch[1]}
                        </p>
                    </div>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // COMPANY
        // ----------------------------------------------------

        const companyMatch = line.match(
            /^Company:\s*(.+)$/i
        );

        if (companyMatch) {

            elements.push(
                <div
                    key={index}
                    className="flex items-center gap-3 my-2"
                >
                    <Building2
                        size={17}
                        className="text-gray-500"
                    />

                    <div>
                        <p className="text-xs text-gray-500">
                            Company
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                            {companyMatch[1]}
                        </p>
                    </div>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        const statusMatch = line.match(
            /^Status:\s*(.+)$/i
        );

        if (statusMatch) {

            elements.push(
                <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 text-xs font-medium my-2"
                >
                    <Target size={14} />

                    {statusMatch[1]}
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // EMAIL
        // ----------------------------------------------------

        if (
            line.toLowerCase().includes("email") &&
            line.includes("@")
        ) {
            elements.push(
                <div
                    key={index}
                    className="flex items-center gap-2 my-2 text-sm"
                >
                    <Mail
                        size={16}
                        className="text-gray-500"
                    />

                    <span>
                        {formatInline(line)}
                    </span>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // PHONE
        // ----------------------------------------------------

        if (
            line.toLowerCase().includes("phone") ||
            line.toLowerCase().includes("mobile")
        ) {
            elements.push(
                <div
                    key={index}
                    className="flex items-center gap-2 my-2 text-sm"
                >
                    <Phone
                        size={16}
                        className="text-gray-500"
                    />

                    <span>
                        {formatInline(line)}
                    </span>
                </div>
            );

            return;
        }


        // ----------------------------------------------------
        // NORMAL PARAGRAPH
        // ----------------------------------------------------

        elements.push(
            <p
                key={index}
                className="text-sm leading-6 text-gray-700 my-2"
            >
                {formatInline(line)}
            </p>
        );
    });

    flushBullets();

    return elements;
}


// ============================================================
// INLINE FORMATTING
// ============================================================

function formatInline(text) {

    const parts = String(text).split(
        /(\*\*.*?\*\*)/
    );

    return parts.map((part, index) => {

        if (
            part.startsWith("**") &&
            part.endsWith("**")
        ) {
            return (
                <strong
                    key={index}
                    className="font-semibold text-gray-900"
                >
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return part;
    });
}


// ============================================================
// RESPONSE TYPE ICON
// ============================================================

function getResponseIcon(text) {

    const value = String(text || "").toLowerCase();

    if (
        value.includes("email") ||
        value.includes("subject:")
    ) {
        return (
            <Mail
                size={16}
                className="text-blue-600"
            />
        );
    }

    if (
        value.includes("whatsapp")
    ) {
        return (
            <MessageSquare
                size={16}
                className="text-green-600"
            />
        );
    }

    if (
        value.includes("call script") ||
        value.includes("phone script")
    ) {
        return (
            <Phone
                size={16}
                className="text-purple-600"
            />
        );
    }

    return (
        <Bot
            size={16}
            className="text-blue-600"
        />
    );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ChatWindow({
    messages
}) {

    return (

        <div className="flex-1 overflow-y-auto bg-slate-50/80 px-4 py-5 sm:px-6 lg:px-8"
            style={{ scrollbarGutter: "stable" }}>

            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {messages.length === 0 && (

                <div className="h-full flex items-center justify-center">

                    <div className="text-center max-w-lg">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm mb-5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            AI Sales Assistant
                        </div>

                        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-200/60 ring-8 ring-blue-50">

                            <Sparkles
                                size={30}
                                className="text-blue-600"
                            />

                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">

                            Welcome to Konaseema CRM AI

                        </h2>

                        <p className="mt-3 text-slate-500 text-sm leading-6 max-w-md mx-auto">

                            Your AI Sales Assistant is ready.
                            Ask about leads, generate follow-ups,
                            update CRM records, or get sales guidance.

                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-6">

                            <div className="group px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                Lead Analysis
                            </div>

                            <div className="group px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                Email Generation
                            </div>

                            <div className="group px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                WhatsApp
                            </div>

                            <div className="group px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                CRM Actions
                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            <div className="mx-auto w-full max-w-5xl space-y-7 pb-4">

                {messages.map((message, index) => {

                    const isUser =
                        message.sender === "user";

                    return (

                        <div
                            key={index}
                            className={`flex items-start gap-3 ${isUser
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >

                            {/* ================================================= */}
                            {/* AI AVATAR */}
                            {/* ================================================= */}

                            {!isUser && (

                                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">

                                    {getResponseIcon(
                                        message.text
                                    )}

                                </div>

                            )}


                            {/* ================================================= */}
                            {/* MESSAGE */}
                            {/* ================================================= */}

                            <div
                                className={`w-fit max-w-[88%] sm:max-w-[78%] ${isUser
                                    ? "order-first"
                                    : ""
                                    }`}
                            >

                                {/* ------------------------------- */}
                                {/* USER MESSAGE */}
                                {/* ------------------------------- */}

                                {isUser ? (

                                    <div className="flex flex-col items-end">

                                        <div className="flex items-center gap-2 mb-1">

                                            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                You
                                            </span>

                                            <User
                                                size={13}
                                                className="text-gray-400"
                                            />

                                        </div>

                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md px-5 py-3.5 shadow-md shadow-blue-200/50 ring-1 ring-blue-700/10">

                                            <p className="text-sm leading-6 whitespace-pre-wrap break-words">
                                                {message.text}
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    /* ------------------------------- */
                                    /* AI MESSAGE */
                                    /* ------------------------------- */

                                    <div>

                                        <div className="flex items-center gap-2 mb-1">

                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Konaseema AI
                                            </span>

                                            <ArrowRight
                                                size={12}
                                                className="text-gray-300"
                                            />

                                        </div>

                                        <div className="bg-white/95 border border-slate-200 rounded-2xl rounded-tl-md px-5 py-4.5 shadow-sm shadow-slate-200/60 ring-1 ring-slate-900/[0.02]">

                                            {formatAIResponse(
                                                message.text
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}