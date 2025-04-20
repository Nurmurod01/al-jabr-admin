"use client";
import { useState, useEffect } from "react";
import {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useGetQuestionsByTopicQuery,
} from "@/service/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function QuestionList({
  topicId = "",
  chapterId = "",
  classId = "",
}) {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const limit = page * 10;
  const offset = (page - 1) * 10;

  const {
    data: allData,
    isLoading: allDataLoading,
    refetch: refetchAll,
  } = useGetQuestionsQuery({ limit, offset }, { skip: topicId !== "" });

  // Fetch topic-specific questions with the current page's offset
  const {
    data: topicQuestions,
    isLoading: topicQuestionsLoading,
    refetch: refetchTopic,
  } = useGetQuestionsByTopicQuery(
    {
      topic_id: topicId,
      offset: offset,
      limit: limit,
    },
    {
      skip: !topicId,
    }
  );

  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  const isLoading =
    (topicId && topicQuestionsLoading) || (!topicId && allDataLoading);

  // Reset to page 1 when topic changes
  useEffect(() => {
    setPage(1);
  }, [topicId]);

  // Toggle question expansion
  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle question deletion
  const handleDelete = async () => {
    if (!selectedQuestionId) return;

    try {
      await deleteQuestion(selectedQuestionId).unwrap();

      // Refresh data based on current filter
      if (topicId) {
        refetchTopic();
      } else {
        refetchAll();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedQuestionId(null);
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (id) => {
    setSelectedQuestionId(id);
    setDeleteDialogOpen(true);
  };

  // Set badge colors based on difficulty level
  const getLevelColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get question type label
  const getTypeLabel = (type) => {
    return type === "mcq" ? "Test" : "Open";
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  // Determine which data to display
  const questionsToDisplay = topicId ? topicQuestions : allData;

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!questionsToDisplay || questionsToDisplay.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center space-y-5">
          <p className="text-gray-500">
            {topicId
              ? "No questions found for this topic"
              : "Questions not found"}
          </p>
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questionsToDisplay.map((question) => (
          <Card
            key={question.id}
            className="overflow-hidden p-0 shadow hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getLevelColor(question.question_level)}>
                      {question.question_level === "easy"
                        ? "Easy"
                        : question.question_level === "medium"
                        ? "Medium"
                        : "Hard"}
                    </Badge>
                    <Badge variant="outline">
                      {getTypeLabel(question.question_type)}
                    </Badge>
                    <Badge variant="secondary">{question.question_index}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(question.id)}
                    >
                      {expandedQuestions[question.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(question.id)}
                      disabled={
                        isDeleting && selectedQuestionId === question.id
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-medium text-lg">
                    {question.question_text}
                  </h3>
                </div>

                {expandedQuestions[question.id] && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <h4 className="font-medium mb-2">To'g'ri javob:</h4>
                      <div className="bg-green-50 p-3 rounded-md">
                        <p>{question.answer[0]}</p>
                      </div>
                    </div>

                    {question.question_type === "mcq" &&
                      question.options &&
                      question.options.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Variantlar:</h4>
                          <div className="space-y-2 ">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-md ${
                                  option === question.answer[0]
                                    ? "bg-green-50 border border-green-400"
                                    : "bg-gray-50"
                                }`}
                              >
                                <p>{option}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questionsToDisplay.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">{page}</span>
          <Button variant="outline" onClick={handleNextPage}>
            Next
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Savolni o'chirish</DialogTitle>
          </DialogHeader>
          <p>Haqiqatan ham bu savolni o'chirmoqchimisiz?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
