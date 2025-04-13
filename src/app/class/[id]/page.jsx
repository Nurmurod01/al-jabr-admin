"use client";

import { useParams } from "next/navigation";
import { useGetClassQuery } from "@/service/classApi";
import { Loader2 } from "lucide-react";

export default function ClassDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useGetClassQuery(id);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-black" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center text-black mt-10">
                <h2 className="text-xl font-semibold">Class not found</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-black mb-4">Class Detail</h1>
            <div className="border-2 border-black p-4 rounded-lg">
                <p className="text-lg text-black">
                    <strong>ID:</strong> {id}
                </p>
                <p className="text-lg text-black mt-2">
                    <strong>Name (Uz):</strong> {data.name?.uz}
                </p>
                <p className="text-lg text-black">
                    <strong>Name (Ru):</strong> {data.name?.ru}
                </p>
            </div>
        </div>
    );
}
