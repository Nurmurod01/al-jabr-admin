"use client";

import { useState, useEffect, useCallback } from "react";
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
import { PlusCircle, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

// Separate component for form sections to reduce complexity
const FormSection = ({ title, children }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Field group component for language pairs (Uzbek/Russian)
const LanguageFieldPair = ({
  label,
  uzValue,
  ruValue,
  onUzChange,
  onRuChange,
  placeholder = "Enter",
  component = Input,
  required = false,
}) => {
  const Component = component;
  const extraProps =
    component === Textarea ? { className: "min-h-[100px]" } : {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor={`${label}-uz`}>Uzbek{required && "*"}</Label>
        <Component
          id={`${label}-uz`}
          value={uzValue}
          onChange={(e) => onUzChange(e.target.value)}
          placeholder={`${placeholder} in Uzbek`}
          {...extraProps}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${label}-ru`}>Russian{required && "*"}</Label>
        <Component
          id={`${label}-ru`}
          value={ruValue}
          onChange={(e) => onRuChange(e.target.value)}
          placeholder={`${placeholder} in Russian`}
          {...extraProps}
        />
      </div>
    </div>
  );
};

// URL Field Group with clear button
const MediaUrlFieldGroup = ({ label, values, onChange, onClear }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
    </div>
    <LanguageFieldPair
      label={label}
      uzValue={values.uz}
      ruValue={values.ru}
      onUzChange={(value) => onChange({ ...values, uz: value })}
      onRuChange={(value) => onChange({ ...values, ru: value })}
      placeholder={`${label} URL`}
    />
  </div>
);

export default function QuestionForm() {
  // Initial states
  const initialOptions = [
    { uz: "", ru: "" },
    { uz: "", ru: "" },
  ];
  const initialLanguagePair = { ru: "", uz: "" };
  const initialInformation = {
    chapter: "",
    class: "",
    count: 0,
    group: "",
    index: "",
  };

  // Selection states
  const [classId, setClassId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  // Question data states
  const [questionData, setQuestionData] = useState({
    questionUz: "",
    questionRu: "",
    answerUz: "",
    answerRu: "",
    questionType: "mcq",
    questionDifficulty: "easy",
  });

  // Define groups with proper IDs (fixing the key prop issue)
  const groups = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
  ];

  // Add state for selected group
  const [selectedGroup, setSelectedGroup] = useState("");

  const [options, setOptions] = useState(initialOptions);
  const [information, setInformation] = useState(initialInformation);

  // Media URLs
  const [questionImageUrl, setQuestionImageUrl] = useState(initialLanguagePair);
  const [questionVideoUrl, setQuestionVideoUrl] = useState(initialLanguagePair);
  const [solutionImageUrl, setSolutionImageUrl] = useState(initialLanguagePair);
  const [solutionSteps, setSolutionSteps] = useState(initialLanguagePair);
  const [optionsUrl, setOptionsUrl] = useState([]);

  // Destructure question data for easier access
  const {
    questionUz,
    questionRu,
    answerUz,
    answerRu,
    questionType,
    questionDifficulty,
  } = questionData;

  // API hooks
  const { data: classes, isLoading: loadingClasses } = useGetClassQuery();
  const { data: chapters, isLoading: loadingChapters } =
    useGetChaptersQuery(classId);
  const { data: topics, isLoading: loadingTopics } =
    useGetTopicsQuery(chapterId);
  const [addQuestion, { isLoading: isSaving }] = useAddQuestionMutation();

  // Helper function to find name by ID - memoized for performance
  const getNameById = useCallback((items, id, language = "uz") => {
    if (!items) return "";
    const item = items.find((i) => i.id === id);
    return item ? item.name[language] || item.name : "";
  }, []);

  // Update dependent selections
  useEffect(() => {
    if (classId) {
      setChapterId("");
      setTopicId("");
      setInformation((prev) => ({
        ...prev,
        class: getNameById(classes, classId),
      }));
    }
  }, [classId, classes, getNameById]);

  useEffect(() => {
    if (chapterId) {
      setTopicId("");
      setInformation((prev) => ({
        ...prev,
        chapter: getNameById(chapters, chapterId),
      }));
    }
  }, [chapterId, chapters, getNameById]);

  useEffect(() => {
    if (topicId && topics) {
      const topic = topics.find((t) => t.id === topicId);
      setInformation((prev) => ({
        ...prev,
        topic: topic ? topic.name : "",
      }));
    }
  }, [topicId, topics]);

  // Update information when group is selected
  useEffect(() => {
    if (selectedGroup) {
      setInformation((prev) => ({
        ...prev,
        group: selectedGroup,
      }));
    }
  }, [selectedGroup]);

  // Handle question data updates
  const updateQuestionData = (field, value) => {
    setQuestionData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle information field changes
  const handleInformationChange = (field, value) => {
    setInformation((prev) => ({ ...prev, [field]: value }));
  };

  // Handle option changes
  const handleOptionChange = (index, language, value) => {
    const newOptions = [...options];
    newOptions[index][language] = value;
    setOptions(newOptions);
  };

  // Add/remove options
  const addOption = () => setOptions((prev) => [...prev, { uz: "", ru: "" }]);

  const removeOption = (index) => {
    if (options.length <= 2) {
      toast.error("At least 2 options are required");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  // Handle option URLs
  const addOptionUrl = () =>
    setOptionsUrl((prev) => [...prev, { uz: "", ru: "" }]);

  const removeOptionUrl = (index) => {
    setOptionsUrl(optionsUrl.filter((_, i) => i !== index));
  };

  const clearAllOptionUrls = () => setOptionsUrl([]);

  const handleOptionUrlChange = (index, language, value) => {
    const newOptionsUrl = [...optionsUrl];
    newOptionsUrl[index][language] = value;
    setOptionsUrl(newOptionsUrl);
  };

  // Clear image/video URLs
  const clearField = (setter) => setter(initialLanguagePair);

  // Form validation
  const isFormValid =
    classId &&
    chapterId &&
    topicId &&
    questionUz &&
    questionRu &&
    answerUz &&
    answerRu &&
    selectedGroup; // Added group validation

  // Reset form
  const resetForm = () => {
    setQuestionData({
      questionUz: "",
      questionRu: "",
      answerUz: "",
      answerRu: "",
      questionType: "mcq",
      questionDifficulty: "easy",
    });
    setOptions(initialOptions);
    setQuestionImageUrl(initialLanguagePair);
    setQuestionVideoUrl(initialLanguagePair);
    setSolutionImageUrl(initialLanguagePair);
    setSolutionSteps(initialLanguagePair);
    setOptionsUrl([]);
    setInformation(initialInformation);
    setSelectedGroup(""); // Reset group
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      // Validate form
      if (!isFormValid) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Filter out empty options
      const validOptions = options.filter(
        (opt) => opt.uz.trim() && opt.ru.trim()
      );

      if (questionType === "mcq" && validOptions.length < 2) {
        toast.error(
          "At least 2 options are required for multiple choice questions"
        );
        return;
      }

      // Filter out empty option URLs
      const validOptionUrls = optionsUrl.filter(
        (opt) => opt.uz.trim() || opt.ru.trim()
      );

      // Prepare the question data
      const questionPayload = {
        answer: [{ uz: answerUz, ru: answerRu }],
        information: {
          ...information,
          difficulty: questionDifficulty,
          type: questionType,
          group: selectedGroup, // Make sure to send the selected group
        },
        options: questionType === "mcq" ? validOptions : [],
        options_url: validOptionUrls.length > 0 ? validOptionUrls : [],
        question: {
          ru: questionRu,
          uz: questionUz,
        },
        question_image_url:
          questionImageUrl.ru.trim() || questionImageUrl.uz.trim()
            ? questionImageUrl
            : null,
        question_video_url:
          questionVideoUrl.ru.trim() || questionVideoUrl.uz.trim()
            ? questionVideoUrl
            : null,
        solution_image_url:
          solutionImageUrl.ru.trim() || solutionImageUrl.uz.trim()
            ? solutionImageUrl
            : null,
        solution_steps:
          solutionSteps.ru.trim() || solutionSteps.uz.trim()
            ? solutionSteps
            : null,
        topic_id: topicId,
      };
      console.log(questionPayload);

      await addQuestion(questionPayload).unwrap();
      toast.success("Question added successfully");
      resetForm();
    } catch (err) {
      toast.error(err.message || "Error adding question");
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="font-bold text-2xl mb-6 text-center">Add Question</h1>

      <FormSection title="Select Class, Chapter and Topic *">
        <div className="flex justify-between gap-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="class-select">Class</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {loadingClasses ? (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                ) : classes?.length > 0 ? (
                  classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name.uz}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No classes found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Selection */}
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="chapter-select">Chapter</Label>
            <Select
              value={chapterId}
              onValueChange={setChapterId}
              disabled={!classId || loadingChapters}
            >
              <SelectTrigger id="chapter-select" className="w-full">
                <SelectValue
                  placeholder="Select chapter"
                  className="truncate max-w-[calc(100%-20px)]"
                />
              </SelectTrigger>
              <SelectContent>
                {loadingChapters ? (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                ) : chapters?.length > 0 ? (
                  chapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id} className="w-full">
                      <div className="truncate max-w-[150px]">{ch.name.uz}</div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No chapters found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic-select">Topic</Label>
            <Select
              value={topicId}
              onValueChange={setTopicId}
              disabled={!chapterId || loadingTopics}
            >
              <SelectTrigger id="topic-select" className="w-full">
                <SelectValue
                  placeholder="Select topic"
                  className="truncate max-w-[calc(100%-20px)]"
                />
              </SelectTrigger>
              <SelectContent>
                {loadingTopics ? (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                ) : topics?.length > 0 ? (
                  topics.map((topic) => (
                    <SelectItem
                      key={topic.id}
                      value={topic.id}
                      className="w-full"
                    >
                      <div className="truncate max-w-[150px]">{topic.name}</div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No topics found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Additional Information*">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
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
          <div className="space-y-2">
            <Label htmlFor="count">Number</Label>
            <Input
              id="count"
              type="number"
              value={information.count}
              onChange={(e) =>
                handleInformationChange(
                  "count",
                  Number.parseInt(e.target.value)
                )
              }
              placeholder="Enter count"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="index">Index</Label>
            <Input
              id="index"
              value={information.index}
              onChange={(e) => handleInformationChange("index", e.target.value)}
              placeholder="Enter index"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Question Details">
        <div className="space-y-6">
          {/* Question Text */}
          <LanguageFieldPair
            label="Question"
            uzValue={questionUz}
            ruValue={questionRu}
            onUzChange={(value) => updateQuestionData("questionUz", value)}
            onRuChange={(value) => updateQuestionData("questionRu", value)}
            placeholder="Enter question"
            component={Textarea}
            required={true}
          />

          {/* Question Image URLs */}
          <MediaUrlFieldGroup
            label="Question Images"
            values={questionImageUrl}
            onChange={setQuestionImageUrl}
            onClear={() => clearField(setQuestionImageUrl)}
          />

          {/* Question Video URLs */}
          <MediaUrlFieldGroup
            label="Question Videos"
            values={questionVideoUrl}
            onChange={setQuestionVideoUrl}
            onClear={() => clearField(setQuestionVideoUrl)}
          />

          {/* Question Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <RadioGroup
              value={questionType}
              onValueChange={(value) =>
                updateQuestionData("questionType", value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mcq" id="mcq" />
                <Label htmlFor="mcq">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open" id="open" />
                <Label htmlFor="open">Open Question</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question Difficulty */}
          <div className="space-y-2">
            <Label>Question Difficulty</Label>
            <RadioGroup
              value={questionDifficulty}
              onValueChange={(value) =>
                updateQuestionData("questionDifficulty", value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">Hard</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Answer Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="answer-uz">Correct Answer (Uzbek) *</Label>
              <Input
                id="answer-uz"
                value={answerUz}
                onChange={(e) => updateQuestionData("answerUz", e.target.value)}
                placeholder="Enter correct answer in Uzbek"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer-ru">Correct Answer (Russian) *</Label>
              <Input
                id="answer-ru"
                value={answerRu}
                onChange={(e) => updateQuestionData("answerRu", e.target.value)}
                placeholder="Enter correct answer in Russian"
              />
            </div>
          </div>

          {/* Options (for multiple choice) */}
          {questionType === "mcq" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" /> Add Option
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
                      placeholder={`Option ${index + 1} (Uzbek)`}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={option.ru}
                      onChange={(e) =>
                        handleOptionChange(index, "ru", e.target.value)
                      }
                      placeholder={`Option ${index + 1} (Russian)`}
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

          {/* Solution Image URLs */}
          <MediaUrlFieldGroup
            label="Solution Images"
            values={solutionImageUrl}
            onChange={setSolutionImageUrl}
            onClear={() => clearField(setSolutionImageUrl)}
          />

          {/* Solution Steps */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Solution Steps *</Label>
            </div>
            <LanguageFieldPair
              label="Solution Steps*"
              uzValue={solutionSteps.uz}
              ruValue={solutionSteps.ru}
              onUzChange={(value) =>
                setSolutionSteps({ ...solutionSteps, uz: value })
              }
              onRuChange={(value) =>
                setSolutionSteps({ ...solutionSteps, ru: value })
              }
              placeholder="Enter solution steps"
              component={Textarea}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className="w-full md:w-auto bg-teal-500 hover:bg-teal-600"
          >
            {isSaving ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </FormSection>
    </main>
  );
}
