"use client";
import TopicList from "@/components/topics/getTopic";
import { useState, useEffect } from "react";
import { useGetClassQuery, useGetChaptersQuery } from "@/service/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import AddTopicForm from "@/components/topics/addTopicForm";

export default function TopicPage() {
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: classes, isLoading: classesLoading } = useGetClassQuery();
  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersQuery(classId);

  useEffect(() => {
    setChapterId("");
  }, [classId]);

  const handleClassChange = (value) => {
    setClassId(value === "all" ? "" : value);
  };

  const handleChapterChange = (value) => {
    setChapterId(value === "all" ? "" : value);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Filter Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-end md:flex-row gap-6 mb-4">
            <div className="w-full">
              <label
                htmlFor="class-select"
                className="block text-sm font-medium mb-2"
              >
                Select Class
              </label>
              <Select
                value={classId || "all"}
                onValueChange={handleClassChange}
              >
                <SelectTrigger id="class-select" className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All classes</SelectItem>

                  {classesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading classes...
                    </SelectItem>
                  ) : (
                    classes?.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name.uz}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label
                htmlFor="chapter-select"
                className="block text-sm font-medium mb-2"
              >
                Select Chapter
              </label>
              <Select
                value={chapterId || "all"}
                onValueChange={handleChapterChange}
                disabled={!classId || chaptersLoading}
              >
                <SelectTrigger id="chapter-select" className="w-full">
                  <SelectValue
                    placeholder={
                      !classId ? "Select a class first" : "Select a chapter"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {chaptersLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading chapters...
                    </SelectItem>
                  ) : (
                    chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name.uz}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </div>
        </CardContent>
      </Card>

      <TopicList chapterId={chapterId} />
      {isModalOpen && (
        <div className="fixed inset-0 h-screen bg-black/80 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-7 right-5 text-gray-500 hover:text-red-500 text-lg"
            >
              <X />
            </button>
            <AddTopicForm  />
          </div>
        </div>
      )}
    </div>
  );
}
