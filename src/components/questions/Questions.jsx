"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

export default function QuestionForm() {
  // Selection states
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  // Question data states
  const [questionUz, setQuestionUz] = useState("");
  const [questionRu, setQuestionRu] = useState("");
  const [answerUz, setAnswerUz] = useState("");
  const [answerRu, setAnswerRu] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [questionLevel, setQuestionLevel] = useState("easy");
  const [options, setOptions] = useState([
    { uz: "", ru: "" },
    { uz: "", ru: "" },
    { uz: "", ru: "" },
    { uz: "", ru: "" },
  ]);

  // API hooks
  const { data: classes, isLoading: loadingClasses } = useGetClassQuery();
  const { data: chapters, isLoading: loadingChapters } =
    useGetChaptersQuery(classId);
  const { data: topics, isLoading: loadingTopics } =
    useGetTopicsQuery(chapterId);
  const [addQuestion, { isLoading: isSaving }] = useAddQuestionMutation();

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    setChapterId("");
    setTopicId("");
  }, [classId]);

  useEffect(() => {
    setTopicId("");
  }, [chapterId]);

  // Handle option changes
  const handleOptionChange = (index, language, value) => {
    const newOptions = [...options];
    newOptions[index][language] = value;
    setOptions(newOptions);
  };

  // Add new option
  const addOption = () => {
    setOptions([...options, { uz: "", ru: "" }]);
  };

  // Remove option
  const removeOption = (index) => {
    if (options.length <= 2) {
    //   toast({
    //     title: "Xatolik",
    //     description: "Kamida 2 ta variant bo'lishi kerak",
    //     variant: "destructive",
    //   });
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Generate question index based on selections
  const generateQuestionIndex = () => {
    if (!classId || !chapterId || !topicId) return "";

    // Get class, chapter, and topic numbers from their IDs or names
    // This is a simplified example - you'll need to adapt this to your actual data structure
    const classNum = "1";
    const chapterNum = "1";
    const topicNum = "1";
    const groupNum = "1";
    const questionNum = "1";

    return `${classNum}_${chapterNum}_${topicNum}_${groupNum}_${questionNum}`;
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      // Validate form
      if (!questionUz || !questionRu || !answerUz || !answerRu) {
        // toast({
        //   title: "Xatolik",
        //   description: "Barcha majburiy maydonlarni to'ldiring",
        //   variant: "destructive",
        // });
        return;
      }

      // Filter out empty options
      const validOptions = options.filter(
        (opt) => opt.uz.trim() && opt.ru.trim()
      );

      if (questionType === "multiple_choice" && validOptions.length < 2) {
        // toast({
        //   title: "Xatolik",
        //   description: "Kamida 2 ta variant kiritish kerak",
        //   variant: "destructive",
        // });
        return;
      }

      const questionData = {
        question_text: {
          uz: questionUz,
          ru: questionRu,
        },
        answer: [{ uz: answerUz, ru: answerRu }],
        options: questionType === "multiple_choice" ? validOptions : [],
        question_type: questionType,
        question_index: generateQuestionIndex(),
        question_level: questionLevel,
        topic_id: topicId,
      };

      await addQuestion(questionData).unwrap();
    //   toast({
    //     title: "Muvaffaqiyatli",
    //     description: "Savol muvaffaqiyatli qo'shildi",
    //   });

      // Reset form
      setQuestionUz("");
      setQuestionRu("");
      setAnswerUz("");
      setAnswerRu("");
      setQuestionType("multiple_choice");
      setQuestionLevel("easy");
      setOptions([
        { uz: "", ru: "" },
        { uz: "", ru: "" },
        { uz: "", ru: "" },
        { uz: "", ru: "" },
      ]);
    } catch (err) {
    //   toast({
    //     title: "Xatolik",
    //     description: err.message || "Savolni qo'shishda xatolik yuz berdi",
    //     variant: "destructive",
    //   });
    }
  };

  const isFormValid =
    classId &&
    chapterId &&
    topicId &&
    questionUz &&
    questionRu &&
    answerUz &&
    answerRu;

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="font-bold text-2xl mb-6 text-center">Savol qo'shish</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sinf, Bob va Mavzuni tanlang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="class-select">Sinf</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Sinfni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {loadingClasses ? (
                    <SelectItem disabled value="loading">
                      Yuklanmoqda...
                    </SelectItem>
                  ) : classes && classes.length > 0 ? (
                    classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name.uz}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      Sinflar topilmadi
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-select">Bob</Label>
              <Select
                value={chapterId}
                onValueChange={setChapterId}
                disabled={!classId || loadingChapters}
              >
                <SelectTrigger id="chapter-select">
                  <SelectValue placeholder="Bobni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {loadingChapters ? (
                    <SelectItem disabled value="loading">
                      Yuklanmoqda...
                    </SelectItem>
                  ) : chapters && chapters.length > 0 ? (
                    chapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.name.uz}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      Boblar topilmadi
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic-select">Mavzu</Label>
              <Select
                value={topicId}
                onValueChange={setTopicId}
                disabled={!chapterId || loadingTopics}
              >
                <SelectTrigger id="topic-select">
                  <SelectValue placeholder="Mavzuni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTopics ? (
                    <SelectItem disabled value="loading">
                      Yuklanmoqda...
                    </SelectItem>
                  ) : topics && topics.length > 0 ? (
                    topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      Mavzular topilmadi
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savol ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Question Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="question-uz">Savol (O'zbek tilida) *</Label>
                <Textarea
                  id="question-uz"
                  value={questionUz}
                  onChange={(e) => setQuestionUz(e.target.value)}
                  placeholder="Savolni o'zbek tilida kiriting"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="question-ru">Savol (Rus tilida) *</Label>
                <Textarea
                  id="question-ru"
                  value={questionRu}
                  onChange={(e) => setQuestionRu(e.target.value)}
                  placeholder="Savolni rus tilida kiriting"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
              <Label>Savol turi</Label>
              <RadioGroup
                value={questionType}
                onValueChange={setQuestionType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="multiple_choice"
                    id="multiple_choice"
                  />
                  <Label htmlFor="multiple_choice">Test savoli</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open" id="open" />
                  <Label htmlFor="open">Ochiq savol</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question Level */}
            <div className="space-y-2">
              <Label>Savol darajasi</Label>
              <RadioGroup
                value={questionLevel}
                onValueChange={setQuestionLevel}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Oson</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">O'rta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Qiyin</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Answer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="answer-uz">
                  To'g'ri javob (O'zbek tilida) *
                </Label>
                <Input
                  id="answer-uz"
                  value={answerUz}
                  onChange={(e) => setAnswerUz(e.target.value)}
                  placeholder="To'g'ri javobni o'zbek tilida kiriting"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer-ru">To'g'ri javob (Rus tilida) *</Label>
                <Input
                  id="answer-ru"
                  value={answerRu}
                  onChange={(e) => setAnswerRu(e.target.value)}
                  placeholder="To'g'ri javobni rus tilida kiriting"
                />
              </div>
            </div>

            {/* Options (for multiple choice) */}
            {questionType === "multiple_choice" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Variantlar</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" /> Variant qo'shish
                  </Button>
                </div>

                {options.map((option, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                  >
                    <div className="flex gap-2 items-center">
                      <Input
                        value={option.uz}
                        onChange={(e) =>
                          handleOptionChange(index, "uz", e.target.value)
                        }
                        placeholder={`Variant ${index + 1} (O'zbek tilida)`}
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={option.ru}
                        onChange={(e) =>
                          handleOptionChange(index, "ru", e.target.value)
                        }
                        placeholder={`Variant ${index + 1} (Rus tilida)`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-600"
            >
              {isSaving ? "Saqlanmoqda..." : "Savolni saqlash"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
