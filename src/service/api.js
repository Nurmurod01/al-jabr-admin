"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://matematika.al-jabr-edu.uz/api",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => ({
        url: `/getquestions`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getQuestion: builder.query({
      query: (id) => ({
        url: `/questions/${id}`,
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
        url: `/chapters/class/${id}`,
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
    getTopic: builder.query({
      query: ({ class_id, chapter_id }) => {
        let query = "/topics";
        const params = new URLSearchParams();

        if (class_id) params.append("class_id", class_id);
        if (chapter_id) params.append("chapter_id", chapter_id);

        if (params.toString()) query += `?${params.toString()}`;

        return { url: query, method: "GET" };
      },
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useGetClassQuery,
  useGetChaptersQuery,
  useAddTopicMutation,
  useGetTopicQuery,
} = api;
export default api;
