"use client";

import { useGetAllTopicsQuery, useGetTopicsQuery } from "@/service/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopicList({ chapterId }) {
  const {
    data: chapterTopics,
    isLoading: isChapterTopicsLoading,
    isError: isChapterTopicsError,
  } = useGetTopicsQuery(chapterId, { skip: !chapterId });

  const {
    data: allTopics,
    isLoading,
    isError: isAllTopicsError,
  } = useGetAllTopicsQuery(undefined, { skip: !!chapterId });

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (chapterId && chapterTopics) {
      setTopics(chapterTopics);
    } else if (!chapterId && allTopics) {
      setTopics(allTopics);
    }
  }, [chapterId, chapterTopics, allTopics]);

  if (isChapterTopicsLoading || isLoading)
    return (
      <div className="flex items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-black" />
        Loading Topics ...
      </div>
    );

  if (isChapterTopicsError || isAllTopicsError)
    return <div>Xatolik yuz berdi</div>;

  return (
    <div className="container mx-auto flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Topic List</h2>

      {topics && topics.length > 0 ? (
        <ul className="space-y-2 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topics.map((topic) => (
            <li
              key={topic.id}
              className="border rounded-md p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">
                {topic.name || "Undefind"}
              </h3>
              <p className="text-gray-600 text-sm">
                {topic.title || "Undefind"}
              </p>
              <p className="text-xs text-gray-400">ID: {topic.id}</p>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p className="text-xl">Topics not found.</p>
      )}
    </div>
  );
}
