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
                            className="text-blue-600"
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

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">

            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {messages.length === 0 && (

                <div className="h-full flex items-center justify-center">

                    <div className="text-center max-w-md">

                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">

                            <Sparkles
                                size={30}
                                className="text-blue-600"
                            />

                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900">

                            Welcome to Konaseema CRM AI

                        </h2>

                        <p className="mt-3 text-gray-500 text-sm leading-6">

                            Your AI Sales Assistant is ready.
                            Ask about leads, generate follow-ups,
                            update CRM records, or get sales guidance.

                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-6">

                            <div className="px-3 py-2 rounded-lg bg-white border text-xs text-gray-600">
                                Lead Analysis
                            </div>

                            <div className="px-3 py-2 rounded-lg bg-white border text-xs text-gray-600">
                                Email Generation
                            </div>

                            <div className="px-3 py-2 rounded-lg bg-white border text-xs text-gray-600">
                                WhatsApp
                            </div>

                            <div className="px-3 py-2 rounded-lg bg-white border text-xs text-gray-600">
                                CRM Actions
                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            <div className="space-y-6">

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

                                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">

                                    {getResponseIcon(
                                        message.text
                                    )}

                                </div>

                            )}


                            {/* ================================================= */}
                            {/* MESSAGE */}
                            {/* ================================================= */}

                            <div
                                className={`max-w-[78%] ${isUser
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

                                            <span className="text-xs text-gray-400">
                                                You
                                            </span>

                                            <User
                                                size={13}
                                                className="text-gray-400"
                                            />

                                        </div>

                                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-5 py-3 shadow-sm">

                                            <p className="text-sm leading-6 whitespace-pre-wrap">
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

                                            <span className="text-xs font-medium text-gray-500">
                                                Konaseema AI
                                            </span>

                                            <ArrowRight
                                                size={12}
                                                className="text-gray-300"
                                            />

                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">

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