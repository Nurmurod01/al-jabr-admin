"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  useGetClassQuery,
  useGetChaptersQuery,
  useGetTopicsQuery,
  useAddQuestionMutation,
} from "@/service/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SimpleCodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-800 animate-pulse rounded-md" />
  ),
});

export default function QuestionJson() {
  const [code, setCode] = useState(`[
  {
    "question_text": {
      "uz": "string",
      "ru": "string"
    },
    "answer": [
      { "uz": "string", "ru": "string" }
    ],
    "options": [
      { "uz": "string", "ru": "string" },
      { "uz": "string", "ru": "string" }
    ],
    "question_type": "multiple_choice" || "open",
    "question_index": "string --> 1_1_1_1_1 биринчи синф, биринчи боб, бринчи топикки 1-группанинг 1-соволи",
    "question_level": "easy" || "medium" || "hard"
  }
]`);

  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  const { data: classes, isLoading: loadingClasses } = useGetClassQuery();
  const { data: chapters, isLoading: loadingChapters } =
    useGetChaptersQuery(classId);
  const { data: topics, isLoading: loadingTopics } =
    useGetTopicsQuery(chapterId);
  const [addQuestion] = useAddQuestionMutation();
  const handleSave = async () => {
    try {
      const formattedCode = code.replace(/([\w\d_]+):/g, '"$1":'); 
      console.log("Formatted code for parsing:", formattedCode); 

      const parsedJson = JSON.parse(formattedCode);

      if (!Array.isArray(parsedJson)) {
        throw new Error("Kiritilgan JSON massiv ko'rinishida emas.");
      }

      for (let i = 0; i < parsedJson.length; i++) {
        const question = parsedJson[i];

        const formatted = {
          ...question,
          topic_id: topicId,
        };

        try {
          await addQuestion(formatted).unwrap();
          console.log(`Savol ${i + 1} muvaffaqiyatli qo‘shildi.`);
        } catch (questionError) {
          console.error(`❌ ${i + 1}-savolda xatolik:`, questionError);
        }
      }
    } catch (err) {
      console.error("❌ JSON parsingda xatolik:", err);
    }
  };

  useEffect(() => {
    setChapterId("");
    setTopicId("");
  }, [classId]);

  useEffect(() => {
    setTopicId("");
  }, [chapterId]);

  const isFormValid = classId && chapterId && topicId;

  return (
    <main className="container mx-auto px-4">
      <h1 className="font-bold text-xl mb-4 text-center">Add Question</h1>

      <Card>
        <CardHeader>
          <CardTitle className="mb-4">Select Class, Chapter, Topic</CardTitle>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <Select
              value={classId}
              className="w-full"
              onValueChange={setClassId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {loadingClasses ? (
                  <SelectItem disabled>Loading classes...</SelectItem>
                ) : classes && classes.length > 0 ? (
                  classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name.uz}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No classes found</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select
              value={chapterId}
              onValueChange={setChapterId}
              disabled={!classId || loadingChapters}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {loadingChapters ? (
                  <SelectItem value="loading" disabled>
                    Loading chapters...
                  </SelectItem>
                ) : chapters && chapters.length > 0 ? (
                  chapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.name.uz}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>Chapters not found</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select
              value={topicId}
              onValueChange={setTopicId}
              disabled={!chapterId || loadingTopics}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {loadingTopics ? (
                  <SelectItem disabled>Loading topics...</SelectItem>
                ) : topics && topics.length > 0 ? (
                  topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No topics found</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-600"
              disabled={!isFormValid}
            >
              Add Question
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <SimpleCodeEditor initialValue={code} onChange={setCode} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
