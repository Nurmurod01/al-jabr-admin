"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://student.al-jabr-edu.uz/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      //35.154.102.246:8086/api
      http: return headers;
    },
  }),
  tagTypes: ["Class"],
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: ({ limit = 10, offset = 0 }) => ({
        url: `/getquestions?limit=${limit}&offset=${offset}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getQuestionsByTopic: builder.query({
      query: ({ topic_id, limit = 10, offset = 0 }) => ({
        url: `/questions/get/${topic_id}?limit=${limit}&offset=${offset}&lang=uz`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getQuestionsByChapter: builder.query({
      query: ({ chapter_id, limit = 10, offset = 0 }) => ({
        url: `/getquestions?chapter_id=${chapter_id}&limit=${limit}&offset=${offset}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    getQuestionsByClass: builder.query({
      query: ({ class_id, limit = 10, offset = 0 }) => ({
        url: `/getquestions?class_id=${class_id}&limit=${limit}&offset=${offset}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getClass: builder.query({
      query: () => ({
        url: `/class`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getChapters: builder.query({
      query: (id) => ({
        url: `/chapters/class/{id}?class_id=${id}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    addTopic: builder.mutation({
      query: (topic) => ({
        url: "/topics",
        method: "POST",
        body: topic,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getTopics: builder.query({
      query: (chapter_id) => ({
        url: `/chapter/${chapter_id}/topics`,
        method: "GET",
      }),
    }),
    getAllTopics: builder.query({
      query: () => ({
        url: "/gettopics?language=uz",
        method: "GET",
      }),
    }),
    addQuestion: builder.mutation({
      query: (question) => ({
        url: "/questions",
        method: "POST",
        body: question,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionsByTopicQuery,
  useGetClassQuery,
  useGetChaptersQuery,
  useAddTopicMutation,
  useGetTopicsQuery,
  useGetAllTopicsQuery,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionsByChapterQuery,
  useGetQuestionsByClassQuery,
} = api;
export default api;
