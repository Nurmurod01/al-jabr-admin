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
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const SimpleCodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-800 animate-pulse rounded-md" />
  ),
});

const DEFAULT_JSON_TEMPLATE = `[
  {
    "answer": [
      {
        "ru": "string",
        "uz": "string"
      }
    ],
    "information": {
      "count": 0,
      "difficulty": "easy",
      "index": "1_1_1_1_1",
      "type": "mcq"
    },
    "options": [
      {
        "ru": "string",
        "uz": "string"
      },
      {
        "ru": "string",
        "uz": "string"
      }
    ],
    "options_url": [],
    "question": {
      "ru": "string",
      "uz": "string"
    },
    "solution_steps": {
      "ru": "string",
      "uz": "string"
    }
  }
]
`;

export default function QuestionJson() {
  const [code, setCode] = useState(DEFAULT_JSON_TEMPLATE);
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: classes, isLoading: loadingClasses } = useGetClassQuery();
  const { data: chapters, isLoading: loadingChapters } = useGetChaptersQuery(
    classId || ""
  );
  const { data: topics, isLoading: loadingTopics } = useGetTopicsQuery(
    chapterId || ""
  );
  const [addQuestion] = useAddQuestionMutation();

  // Predefined groups
  const groups = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
  ];

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (classId) {
      setChapterId("");
      setTopicId("");
      setSelectedGroup("");
    }
  }, [classId]);

  useEffect(() => {
    if (chapterId) {
      setTopicId("");
      setSelectedGroup("");
    }
  }, [chapterId]);

  useEffect(() => {
    if (topicId) {
      setSelectedGroup("");
    }
  }, [topicId]);

  const handleSave = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      let parsedJson;
      try {
        parsedJson = JSON.parse(code);
      } catch (parseError) {
        const fixedCode = code
          .replace(/'/g, '"')
          .replace(
            /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
            '$1"$3":'
          )
          .replace(/"\s*\|\|\s*"/g, '","');

        console.log("Attempting to parse fixed JSON:", fixedCode);
        parsedJson = JSON.parse(fixedCode);
      }

      if (!Array.isArray(parsedJson)) {
        throw new Error("JSON must be an array");
      }

      // Find selected items by ID
      const selectedClass = classes?.find((c) => c.id === classId);
      const selectedChapter = chapters?.find((c) => c.id === chapterId);
      const selectedTopic = topics?.find((t) => t.id === topicId);
      const groupName =
        groups.find((g) => g.id === selectedGroup)?.name || selectedGroup;

      let successCount = 0;
      for (let i = 0; i < parsedJson.length; i++) {
        const question = parsedJson[i];

        // Make a deep copy of the question to avoid reference issues
        const formatted = JSON.parse(JSON.stringify(question));

        // Add topic_id at the root level
        formatted.topic_id = topicId;

        // Ensure information object exists
        if (!formatted.information) {
          formatted.information = {
            count: 0,
            difficulty: "easy",
            index: "1_1_1_1_1",
            type: "multiple_choice",
          };
        }

        // Auto-populate class, chapter, topic, and group in the information object
        formatted.information.class = selectedClass?.name?.uz || classId;
        formatted.information.chapter = selectedChapter?.name?.uz || chapterId;
        formatted.information.topic = selectedTopic?.name || topicId;
        formatted.information.group = groupName;

        console.log(`Question ${i + 1} after formatting:`, formatted);

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

  const isFormValid = classId && chapterId && topicId && selectedGroup;

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="font-bold text-2xl mb-6 text-center">Add Questions</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="mb-4">
            Select Class, Chapter, Topic and Group
          </CardTitle>
          <div className="flex justify-between gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger id="class">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select
                value={chapterId}
                onValueChange={setChapterId}
                disabled={!classId || loadingChapters}
              >
                <SelectTrigger id="chapter">
                  <SelectValue
                    placeholder="Select chapter"
                    className="truncate max-w-[calc(100%-20px)]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingChapters ? (
                    <SelectItem value="loading" disabled>
                      Loading chapters...
                    </SelectItem>
                  ) : chapters && chapters.length > 0 ? (
                    chapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        <div className="truncate max-w-[150px]">
                          {ch.name.uz}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No chapters found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Select
                value={topicId}
                onValueChange={setTopicId}
                disabled={!chapterId || loadingTopics}
              >
                <SelectTrigger id="topic">
                  <SelectValue
                    placeholder="Select topic"
                    className="truncate max-w-[calc(100%-20px)]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingTopics ? (
                    <SelectItem value="loading" disabled>
                      Loading topics...
                    </SelectItem>
                  ) : topics && topics.length > 0 ? (
                    topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        <div className="truncate max-w-[150px]">
                          {topic.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No topics found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select
                value={selectedGroup}
                onValueChange={setSelectedGroup}
                disabled={!topicId}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.length > 0 ? (
                    groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No groups found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSave}
                className="bg-teal-500 hover:bg-teal-600 w-full"
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
                For information.type use: "mcq" or "open"
              </li>
              <li>
                For information.difficulty use: "easy", "medium", or "hard"
              </li>
              <li>
                information.index format: class_chapter_topic_group_questionCount
                (e.g., "1_1_1_1_1")
              </li>
              <li>
                Class, Chapter, Topic, and Group will be automatically added to
                your information object
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
