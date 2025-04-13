'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from 'next/navigation';
import { useGetChapterQuery } from "@/service/chapterApi";

export default function ChapterPage() {
    const { classId } = useParams(); // from route: /chapters/[classId]
    const { data: chapters, isLoading, isError } = useGetChapterQuery(classId);
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <p className="text-red-500 text-center mt-10">Failed to load chapters. Please try again.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Boblar ro'yxati</h1>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {chapters?.map((chapter) => (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <p className="text-base font-medium">{chapter.name.uz}</p>
                            {/* Add buttons or links here if needed */}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
