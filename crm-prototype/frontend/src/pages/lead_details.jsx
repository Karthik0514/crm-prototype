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

export default function LeadDetails() {

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl p-8 border">

                <div className="flex justify-between">

                    <div>

                        <h1 className="text-4xl font-bold">

                            Rahul Sharma

                        </h1>

                        <p className="text-gray-500 mt-2">

                            ABC Pvt Ltd

                        </p>

                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full h-fit">

                        Interested

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

                            9876543210

                        </div>

                        <div className="flex items-center gap-3">

                            <Mail size={18} />

                            rahul@gmail.com

                        </div>

                        <div className="flex items-center gap-3">

                            <Building size={18} />

                            IndiaMART

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

                                92%

                            </h1>

                        </div>

                        <div>

                            <p className="font-semibold">

                                Buying Intent

                            </p>

                            <p className="text-green-600">

                                High
                            </p>

                        </div>

                        <div>

                            <p className="font-semibold">

                                Summary

                            </p>

                            <p className="text-gray-600">

                                Customer is interested in installing
                                rooftop solar panels and requested
                                a quotation.

                            </p>

                        </div>

                    </div>

                </div>

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

            <div className="flex gap-4">

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">

                    Analyze with AI

                </button>

                <button className="bg-green-600 text-white px-6 py-3 rounded-xl">

                    Convert to Sale

                </button>

                <button className="bg-gray-800 text-white px-6 py-3 rounded-xl">

                    Add Note

                </button>

            </div>

        </div>

    );

}