"use client";

import { useGetTopicQuery } from "@/store/api";
import { useState } from "react";

export default function TopicList() {
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");

  const {
    data: topics,
    isLoading,
    isError,
  } = useGetTopicQuery(
    { class_id: classId, chapter_id: chapterId },
    { skip: !classId && !chapterId }
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mavzular ro‘yxati</h2>

      {/* Filter uchun inputlar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Chapter ID"
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {isLoading && <p>Yuklanmoqda...</p>}
      {isError && <p>Xatolik yuz berdi!</p>}

      {topics && topics.length > 0 ? (
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li
              key={topic.id}
              className="border rounded-md p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">
                {topic.name?.uz || "Noma’lum"}
              </h3>
              <p className="text-gray-600 text-sm">
                {topic.title?.uz || "Sarlavha yo‘q"}
              </p>
              <p className="text-xs text-gray-400">ID: {topic.id}</p>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>Hozircha mavzular yo‘q.</p>
      )}
    </div>
  );
}
