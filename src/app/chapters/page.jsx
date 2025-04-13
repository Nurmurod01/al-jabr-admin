'use client';

import { useState } from "react";
import { useGetClassesQuery } from "@/service/classApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ChaptersPage() {
    const { data: classes, isLoading } = useGetClassesQuery();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-black" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-4">Class List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes?.map((cls) => (
                    <Card
                        key={cls.id}
                        className="border-black border-2 hover:shadow-xl transition cursor-pointer"
                    >
                        <CardContent
                            className="p-4 space-y-2"
                            onClick={() => router.push(`/chapters/${cls.id}`)} // Redirect to /chapters/class/id
                        >
                            <h2 className="text-xl font-semibold text-black">
                                {cls.name.uz} / {cls.name.ru}
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 text-black border-black"
                            >
                                View Chapters
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
