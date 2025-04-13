"use client";

import { useState, useEffect } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// Import from our mock API instead of the original context files
// import {
//   useGetClassesQuery,
//   useGetChapterQuery,
//   useGetTopicQuery,
// } from "./context/api-mocks";

const VariantInputs = ({ values, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {Object.keys(values).map((key, index) => (
        <div key={index} className="space-y-2">
          <label
            htmlFor={key}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </label>
          <input
            id={key}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={key.replace(/([a-z])([A-Z])/g, "$1 $2")}
            value={values[key]}
            onChange={handleChange}
            required={index < 8}
          />
        </div>
      ))}
    </div>
  );
};

const VariantSelects = ({ uzVariants, ruVariants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <label
          htmlFor="correctUz1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tog&apos;ri javobni tanlang 1
        </label>
        <Select.Root required>
          <Select.Trigger
            id="correctUz1"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tog'ri javobni tanlang 1"
          >
            <Select.Value placeholder="Tog'ri javobni tanlang 1" />
            <Select.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
              position="popper"
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronUp className="h-4 w-4" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {uzVariants.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronDown className="h-4 w-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="correctRu1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Выберите правильный ответ 1
        </label>
        <Select.Root required>
          <Select.Trigger
            id="correctRu1"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Выберите правильный ответ 1"
          >
            <Select.Value placeholder="Выберите правильный ответ 1" />
            <Select.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
              position="popper"
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronUp className="h-4 w-4" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {ruVariants.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronDown className="h-4 w-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Additional select fields follow the same pattern */}
      {/* For brevity, I'm showing just the first two, but the pattern repeats */}
    </div>
  );
};

const Questions = () => {
  const [questionType, setQuestionType] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedImageOption, setSelectedImageOption] = useState("");
  const [selectedImageOption2, setSelectedImageOption2] = useState("");
  const [values, setValues] = useState({
    variant1Uz: "",
    variant1Ru: "",
    variant2Uz: "",
    variant2Ru: "",
    variant3Uz: "",
    variant3Ru: "",
    variant4Uz: "",
    variant4Ru: "",
    variant5Uz: "",
    variant5Ru: "",
  });

  const { data: classes } = useGetClassesQuery();
  const { data: chapters } = useGetChapterQuery(selectedClass, {
    skip: !selectedClass,
  });
  const { data: topics } = useGetTopicQuery(selectedChapter, {
    skip: !selectedChapter,
  });

  useEffect(() => {
    setSelectedTopic(""); // Reset topic when chapter changes
  }, [selectedChapter]);

  const uzVariants = Object.entries(values)
    .filter(([key, value]) => key.includes("Uz") && value.trim() !== "")
    .map(([key, value]) => ({
      value: value,
      label: value,
    }));

  const ruVariants = Object.entries(values)
    .filter(([key, value]) => key.includes("Ru") && value.trim() !== "")
    .map(([key, value]) => ({
      value: value,
      label: value,
    }));

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Values:", {
      ...values,
      selectedClass,
      selectedChapter,
      selectedTopic,
      type: questionType,
      imageOption:
        questionType === "MCQ" ? selectedImageOption : selectedImageOption2,
    });
    // Here you would typically send the data to your API
    alert("Form submitted successfully! Check console for details.");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            {questionType === "MCQ" && "Multiple Choice Question"}
            {questionType === "Open" && "Open Question"}
            {!questionType && "Create New Question"}
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Type Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox.Root
                  id="mcq"
                  checked={questionType === "MCQ"}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setQuestionType("MCQ");
                      setSelectedImageOption("noImage");
                    } else {
                      setQuestionType(null);
                    }
                  }}
                  className="h-4 w-4 border border-primary rounded flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-primary" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="mcq" className="font-medium">
                  MCQ
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox.Root
                  id="open"
                  checked={questionType === "Open"}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setQuestionType("Open");
                      setSelectedImageOption2("noImage2");
                    } else {
                      setQuestionType(null);
                    }
                  }}
                  className="h-4 w-4 border border-primary rounded flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-primary" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="open" className="font-medium">
                  Open
                </label>
              </div>
            </div>

            {/* Class, Chapter, Topic Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="class"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sinfni tanlang
                </label>
                <Select.Root
                  value={selectedClass}
                  onValueChange={(value) => {
                    setSelectedClass(value);
                    setSelectedChapter("");
                    setSelectedTopic("");
                  }}
                >
                  <Select.Trigger
                    id="class"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Sinfni tanlang"
                  >
                    <Select.Value placeholder="Sinfni tanlang" />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
                      position="popper"
                    >
                      <Select.Viewport className="p-1">
                        {classes?.map((cls) => (
                          <Select.Item
                            key={cls.id}
                            value={cls.id}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          >
                            <Select.ItemText>
                              {cls.name?.uz || cls.name?.ru}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="chapter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Chapter tanlang
                </label>
                <Select.Root
                  value={selectedChapter}
                  onValueChange={setSelectedChapter}
                  disabled={!selectedClass}
                >
                  <Select.Trigger
                    id="chapter"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Chapter tanlang"
                  >
                    <Select.Value placeholder="Chapter tanlang" />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
                      position="popper"
                    >
                      <Select.Viewport className="p-1">
                        {chapters?.map((chapter) => (
                          <Select.Item
                            key={chapter.id}
                            value={chapter.id}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          >
                            <Select.ItemText>
                              {chapter.name?.uz || chapter.name?.ru}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="topic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Topics tanlang
                </label>
                <Select.Root
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                  disabled={!selectedChapter}
                >
                  <Select.Trigger
                    id="topic"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Topics tanlang"
                  >
                    <Select.Value placeholder="Topics tanlang" />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
                      position="popper"
                    >
                      <Select.Viewport className="p-1">
                        {topics?.map((topic) => (
                          <Select.Item
                            key={topic.id}
                            value={topic.id}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          >
                            <Select.ItemText>{topic.name}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* MCQ Question Form */}
            {questionType === "MCQ" && (
              <>
                <div className="space-y-4">
                  <label className="text-base font-medium">Image Options</label>
                  <RadioGroup.Root
                    value={selectedImageOption}
                    onValueChange={setSelectedImageOption}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="noImage"
                        id="noImage"
                        className="h-4 w-4 rounded-full border border-primary flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                      >
                        <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                      </RadioGroup.Item>
                      <label htmlFor="noImage">Rasmsiz savollar</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="imageQuestion"
                        id="imageQuestion"
                        className="h-4 w-4 rounded-full border border-primary flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                      >
                        <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                      </RadioGroup.Item>
                      <label htmlFor="imageQuestion">
                        Rasmli savol{" "}
                        <span className="text-gray-500 text-sm">
                          (rasmsiz javob)
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="imageBoth"
                        id="imageBoth"
                        className="h-4 w-4 rounded-full border border-primary flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                      >
                        <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                      </RadioGroup.Item>
                      <label htmlFor="imageBoth">
                        Rasmli savol{" "}
                        <span className="text-gray-500 text-sm">
                          (rasmli javob)
                        </span>
                      </label>
                    </div>
                  </RadioGroup.Root>
                </div>

                {selectedImageOption && (
                  <div className="space-y-6">
                    {selectedImageOption === "noImage" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="nameUz"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Name uz
                          </label>
                          <textarea
                            id="nameUz"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Name uz"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="nameRu"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Name ru
                          </label>
                          <textarea
                            id="nameRu"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Name ru"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="imageLink1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Rasm link (Uzbek)
                          </label>
                          <input
                            id="imageLink1"
                            type="url"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Rasm link"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="imageLink2"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Rasm link (Russian)
                          </label>
                          <input
                            id="imageLink2"
                            type="url"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Rasm link"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <VariantInputs
                      values={values}
                      handleChange={handleChange}
                    />

                    <VariantSelects
                      uzVariants={uzVariants}
                      ruVariants={ruVariants}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="solutionUz"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Yechim yo&apos;li uz
                        </label>
                        <textarea
                          id="solutionUz"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Yechim yo'li uz"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="solutionRu"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Yechim yo&apos;li ru
                        </label>
                        <textarea
                          id="solutionRu"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Yechim yo'li ru"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Open Question Form */}
            {questionType === "Open" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-base font-medium">Image Options</label>
                  <RadioGroup.Root
                    value={selectedImageOption2}
                    onValueChange={setSelectedImageOption2}
                    className="flex flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="imageBoth2"
                        id="imageBoth2"
                        className="h-4 w-4 rounded-full border border-primary flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                      >
                        <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                      </RadioGroup.Item>
                      <label htmlFor="imageBoth2">Rasmli savol</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="noImage2"
                        id="noImage2"
                        className="h-4 w-4 rounded-full border border-primary flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75"
                      >
                        <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                      </RadioGroup.Item>
                      <label htmlFor="noImage2">Rasmsiz savol</label>
                    </div>
                  </RadioGroup.Root>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="questionUz"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      O&apos;zbekcha savol
                    </label>
                    <input
                      id="questionUz"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="O'zbekcha savol"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="questionRu"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ruscha savol
                    </label>
                    <input
                      id="questionRu"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ruscha savol"
                      required
                    />
                  </div>
                </div>

                {selectedImageOption2 === "imageBoth2" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="imageLink"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Rasm link
                    </label>
                    <input
                      id="imageLink"
                      type="url"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Rasm link"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="answer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Javob yozish
                  </label>
                  <input
                    id="answer"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Javob yozish"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="solutionUzOpen"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Yechim yo&apos;li uz
                    </label>
                    <textarea
                      id="solutionUzOpen"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Yechim yo'li uz"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="solutionRuOpen"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Yechim yo&apos;li ru
                    </label>
                    <textarea
                      id="solutionRuOpen"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Yechim yo'li ru"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {questionType && (
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                <Check className="mr-2 h-4 w-4" /> Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Questions;
