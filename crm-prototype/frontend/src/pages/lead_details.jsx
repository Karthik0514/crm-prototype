import {
    Phone,
    Mail,
    Building,
    User,
    Sparkles,
    FileText,
    CircleCheck,
    MessageSquare,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
export default function LeadDetails() {
    const { id } = useParams();
    const [emailData, setEmailData] = useState(null);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [lead, setLead] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [whatsAppData, setWhatsAppData] = useState(null);
    const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
    const generateEmail = async () => {
        try {
            setLoadingEmail(true);

            const response = await api.get(`/leads/${id}/email`);

            setEmailData(response.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingEmail(false);
        }
    };
    useEffect(() => {

        const fetchData = async () => {

            try {

                const leadResponse = await api.get(`/leads/${id}`);
                setLead(leadResponse.data);

                const aiResponse = await api.get(`/leads/${id}/analyze`);
                setAnalysis(aiResponse.data);

            } catch (err) {

                console.error(err);

            }

        };

        fetchData();

    }, [id]);

    if (!lead || !analysis) {
        return <div className="p-8">Loading...</div>;
    }
    const generateWhatsApp = async () => {
        try {
            setLoadingWhatsApp(true);

            const response = await api.get(`/leads/${id}/whatsapp`);

            setWhatsAppData(response.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingWhatsApp(false);
        }
    };
    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl p-8 border">

                <div className="flex justify-between">

                    <div>

                        <h1 className="text-4xl font-bold">

                            {lead.name}

                        </h1>

                        <p className="text-gray-500 mt-2">

                            {lead.company}

                        </p>

                    </div>

                    <span
                        className={`px-4 py-2 rounded-full h-fit text-white ${analysis.priority === "Hot"
                                ? "bg-red-500"
                                : analysis.priority === "Warm"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                            }`}
                    >
                        {analysis.priority}
                    </span>

                </div>

            </div>

            {/* Information */}

            <div className="grid grid-cols-2 gap-6">

                <div className="bg-white rounded-2xl p-6 border">

                    <h2 className="font-bold text-xl mb-5">

                        Lead Information

                    </h2>

                    <div className="space-y-4">

                        <div className="flex items-center gap-3">

                            <Phone size={18} />

                            {lead.phone}

                        </div>

                        <div className="flex items-center gap-3">

                            <Mail size={18} />

                            {lead.email}

                        </div>

                        <div className="flex items-center gap-3">

                            <Building size={18} />

                            {lead.source}

                        </div>

                        <div className="flex items-center gap-3">

                            <User size={18} />

                            Assigned: John

                        </div>

                    </div>

                </div>

                {/* AI */}

                <div className="bg-white rounded-2xl p-6 border">

                    <div className="flex items-center gap-2 mb-5">

                        <Sparkles className="text-blue-600" />

                        <h2 className="font-bold text-xl">

                            AI Analysis

                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div>

                            <p className="text-gray-500">

                                Lead Score

                            </p>

                            <h1 className="text-5xl font-bold text-blue-600">

                                {analysis.lead_score}

                            </h1>

                        </div>

                        <div>

                            <p className="font-semibold">

                                Buying Intent

                            </p>

                            <p className="text-green-600">

                                {analysis.buying_intent}
                            </p>

                        </div>

                        <div>

                            <p className="font-semibold">

                                Summary

                            </p>

                            <p className="text-gray-600">

                                {analysis.summary}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
            <div>

                <p className="font-semibold">

                    Next Action

                </p>

                <p className="text-gray-600">

                    {analysis.next_action}

                </p>

            </div>

            {/* Timeline */}

            <div className="bg-white rounded-2xl p-6 border">

                <h2 className="font-bold text-xl mb-5">

                    Timeline

                </h2>

                <div className="space-y-4">

                    <div className="flex gap-3">

                        <CircleCheck className="text-green-600" />

                        Lead Created

                    </div>

                    <div className="flex gap-3">

                        <CircleCheck className="text-green-600" />

                        AI Analysis Completed

                    </div>

                    <div className="flex gap-3">

                        <CircleCheck className="text-green-600" />

                        Employee Assigned

                    </div>

                    <div className="flex gap-3">

                        <MessageSquare className="text-orange-500" />

                        Waiting for Follow-up

                    </div>

                </div>

            </div>

            {/* Buttons */}

            <div className="space-y-6">
                <div className="flex gap-4">

                    <button
                        onClick={generateEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                    >
                        {loadingEmail ? "Generating..." : "Generate Email"}
                    </button>

                    <button
                        onClick={generateWhatsApp}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
                    >
                        {loadingWhatsApp ? "Generating..." : "Generate WhatsApp"}
                    </button>

                </div>

                {emailData && (
                    <div className="mt-6 flex-1 bg-white rounded-2xl shadow-lg border p-6">

                        <h2 className="text-2xl font-bold text-gray-800">
                            {emailData.subject}
                        </h2>

                        <div className="mt-6 whitespace-pre-wrap text-gray-700 space-y-4">

                            <p className="font-semibold text-lg">
                                {emailData.greeting}
                            </p>

                            <p>
                                {emailData.body}
                            </p>

                            <p className="font-semibold">
                                {emailData.closing}
                            </p>

                        </div>

                    </div>
                )}
               
                {whatsAppData && (
                    <div className="mt-4 bg-white border rounded-lg p-5">
                        <h3 className="font-bold mb-2">WhatsApp Message</h3>
                        <pre className="whitespace-pre-wrap">
                            {whatsAppData.message}
                        </pre>
                    </div>
                )}
                <div className="flex gap-4">

                    <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
                        Convert to Sale
                    </button>

                    <button className="bg-gray-800 text-white px-6 py-3 rounded-xl">
                        Add Note
                    </button>

                </div>
               

            </div>

        </div>

    );

}