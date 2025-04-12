"usi client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://matematika.al-jabr-edu.uz/api",
    credentials: "include",
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
      query: (lang) => ({
        url: `/getquestions?language=${lang}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getQuestion: builder.query({
      query: (id, lang) => ({
        url: `/questions/${id}?language=${lang}`,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { useGetQuestionsQuery, useGetQuestionQuery } = api;
export default api;
