"use client";

import { useState, useEffect } from "react";
import {
  useGetClassQuery,
  useGetChaptersQuery,
  useAddTopicMutation,
} from "@/service/api";

export default function AddTopicForm() {
  const { data: classes, isLoading: classLoading } = useGetClassQuery();
  const [addTopic, { isLoading: adding }] = useAddTopicMutation();
  
  const [formData, setFormData] = useState({
    class_id: "",
    chapter_id: "",
    name: { uz: "", ru: "" },
    title: { uz: "", ru: "" },
  });
  
  // Skip fetching chapters until a class is selected
  const { 
    data: chapters, 
    isLoading: chapterLoading,
    isFetching: chapterFetching 
  } = useGetChaptersQuery(formData.class_id, {
    skip: !formData.class_id,
  });
  
  // Reset chapter_id when class changes
  useEffect(() => {
    if (formData.class_id) {
      setFormData(prev => ({
        ...prev,
        chapter_id: "",
      }));
    }
  }, [formData.class_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [key, lang] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTopic(formData).unwrap();
      alert("Muvaffaqiyatli qo'shildi!");
      setFormData({
        class_id: "",
        chapter_id: "",
        name: { uz: "", ru: "" },
        title: { uz: "", ru: "" },
      });
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white rounded-xl space-y-4"
    >
      <h2 className="text-xl font-semibold">Add New Topic</h2>

      <div>
        <label className="block mb-1 font-medium">Choose class:</label>
        <select
          name="class_id"
          value={formData.class_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Choose</option>
          {!classLoading && classes?.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name.uz}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Choose chapter:</label>
        <select
          name="chapter_id"
          value={formData.chapter_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
          disabled={!formData.class_id || chapterLoading || chapterFetching}
        >
          <option value="">
            {!formData.class_id
              ? "First select a class"
              : chapterLoading || chapterFetching
              ? "Loading chapters..."
              : "Choose a chapter"}
          </option>
          {!chapterLoading && !chapterFetching && chapters?.map((chap) => (
            <option key={chap.id} value={chap.id}>
              {chap.name?.uz}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-between">
        <div className="min-w-[250px]">
          <label className="block font-medium">Name (UZ)</label>
          <input
            type="text"
            name="name.uz"
            value={formData.name.uz}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div className="min-w-[250px]">
          <label className="block font-medium">Name (RU)</label>
          <input
            type="text"
            name="name.ru"
            value={formData.name.ru}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="min-w-[250px]">
          <label className="block font-medium">Title (UZ)</label>
          <input
            type="text"
            name="title.uz"
            value={formData.title.uz}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="min-w-[250px]">
          <label className="block font-medium">Title (RU)</label>
          <input
            type="text"
            name="title.ru"
            value={formData.title.ru}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={adding}
        className="bg-teal-500 font-semibold text-white w-full py-2 px-4 rounded hover:bg-teal-600 transition"
      >
        {adding ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}