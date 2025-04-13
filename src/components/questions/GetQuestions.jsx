"use client";
import { useState, useEffect } from "react";
import { useGetQuestionsQuery, useDeleteQuestionMutation } from "@/service/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function QuestionList({ topicId = "" }) {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const { data, isLoading, refetch } = useGetQuestionsQuery({ topicId, page });
  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  useEffect(() => {
    setPage(1);
  }, [topicId]);

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async () => {
    if (!selectedQuestionId) return;

    try {
      await deleteQuestion(selectedQuestionId).unwrap();
      // toast({
      //   title: "Muvaffaqiyatli",
      //   description: "Savol o'chirildi",
      // });
      refetch();
    } catch (error) {
      // toast({
      //   title: "Xatolik",
      //   description: "Savolni o'chirishda xatolik yuz berdi",
      //   variant: "destructive",
      // });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedQuestionId(null);
    }
  };

  const confirmDelete = (id) => {
    setSelectedQuestionId(id);
    setDeleteDialogOpen(true);
  };

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

  const getTypeLabel = (type) => {
    return type === "multiple_choice" ? "Test savoli" : "Ochiq savol";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Savollar topilmadi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((question) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getLevelColor(question.question_level)}>
                    {question.question_level === "easy"
                      ? "Oson"
                      : question.question_level === "medium"
                      ? "O'rta"
                      : "Qiyin"}
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
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(question.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-medium text-lg">
                  {question.question_text}
                </h3>
                <p className="text-gray-500 text-sm">
                  {question.question_text}
                </p>
              </div>

              {expandedQuestions[question.id] && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div>
                    <h4 className="font-medium mb-2">To'g'ri javob:</h4>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p>{question.answer[0]}</p>
                      <p className="text-gray-500 text-sm">
                        {question.answer[0]}
                      </p>
                    </div>
                  </div>

                  {question.question_type === "multiple_choice" &&
                    question.options &&
                    question.options.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Variantlar:</h4>
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md ${
                                option.uz === question.answer[0]
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <p>{option}</p>
                              <p className="text-gray-500 text-sm">
                                {option}
                              </p>
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

      {data.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Oldingi
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.length < 10} // Assuming 10 items per page
          >
            Keyingi
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
