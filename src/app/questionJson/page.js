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
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const SimpleCodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-800 animate-pulse rounded-md" />
  ),
});

// Default JSON template with proper formatting
const DEFAULT_JSON_TEMPLATE = `[{"answer": [
    {
      "ru": "string",
      "uz": "string"
    }
  ],
  "question_image_url": {
    "ru": "string",
    "uz": "string"
  },
  "question_index": "string",
  "question_level": "easy",
  "question_text": {
    "ru": "string",
    "uz": "string"
  },
  "question_type": "short_answer",
  "question_video_url": {
    "ru": "string",
    "uz": "string"
  },
  "solution": {
    "ru": "string",
    "uz": "string"
  },
  "solution_image_url": {
    "ru": "string",
    "uz": "string"
  },
}]
`;

export default function QuestionJson() {
  const [code, setCode] = useState(DEFAULT_JSON_TEMPLATE);
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: classes, isLoading: loadingClasses } = useGetClassQuery();
  const { data: chapters, isLoading: loadingChapters } = useGetChaptersQuery(
    classId || ""
  );
  const { data: topics, isLoading: loadingTopics } = useGetTopicsQuery(
    chapterId || ""
  );
  const [addQuestion] = useAddQuestionMutation();

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (classId) {
      setChapterId("");
      setTopicId("");
    }
  }, [classId]);

  useEffect(() => {
    if (chapterId) {
      setTopicId("");
    }
  }, [chapterId]);

  const handleSave = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Try to parse the JSON directly first
      let parsedJson;
      try {
        parsedJson = JSON.parse(code);
      } catch (parseError) {
        // If direct parsing fails, try to fix common JSON issues
        const fixedCode = code
          // Replace single quotes with double quotes
          .replace(/'/g, '"')
          // Fix property names without quotes
          .replace(
            /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
            '$1"$3":'
          )
          // Fix "||" in JSON which is invalid
          .replace(/"\s*\|\|\s*"/g, '","');

        console.log("Attempting to parse fixed JSON:", fixedCode);
        parsedJson = JSON.parse(fixedCode);
      }
      console.log(parsedJson);

      if (!Array.isArray(parsedJson)) {
        throw new Error("JSON must be an array");
      }

      let successCount = 0;
      for (let i = 0; i < parsedJson.length; i++) {
        const question = parsedJson[i];
        console.log(question);

        // Validate required fields
        if (!question.question_text || !question.question_type) {
          toast.error(`Question ${i + 1} is missing required fields`);
          continue;
        }

        const formatted = {
          ...question,
          topic_id: topicId,
        };

        try {
          await addQuestion(formatted).unwrap();
          successCount++;
        } catch (questionError) {
          console.error(`Error in question ${i + 1}:`, questionError);
          toast.error(`Error adding question ${i + 1}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} question(s)`);
      }
    } catch (err) {
      console.error("JSON parsing error:", err);
      toast.error("Invalid JSON format. Please check your input.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = classId && chapterId && topicId;

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="font-bold text-2xl mb-6 text-center">Add Questions</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="mb-4">Select Class, Chapter, Topic</CardTitle>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <Select
              value={classId}
              onValueChange={setClassId}
              disabled={loadingClasses}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {loadingClasses ? (
                  <SelectItem value="loading" disabled>
                    Loading classes...
                  </SelectItem>
                ) : classes && classes.length > 0 ? (
                  classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name.uz}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No classes found
                  </SelectItem>
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
                  <SelectItem value="none" disabled>
                    No chapters found
                  </SelectItem>
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
                  <SelectItem value="loading" disabled>
                    Loading topics...
                  </SelectItem>
                ) : topics && topics.length > 0 ? (
                  topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No topics found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-600"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add Questions"
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <SimpleCodeEditor initialValue={code} onChange={setCode} />
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-medium mb-1">JSON Format Guide:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure all property names are in double quotes</li>
              <li>
                For question_type use: "multiple_choice" or "short_answer" (not "||")
              </li>
              <li>For question_level use: "easy", "medium", or "hard"</li>
              <li>
                question_index format: class_chapter_topic_group_question (e.g.,
                "1_1_1_1_1")
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
