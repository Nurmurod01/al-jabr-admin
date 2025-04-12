"use client";

import { useGetQuestionsQuery } from "@/service/api";

// pages/api/proxy.js
 async function handler() {
  const response = await fetch("https://matematika.al-jabr-edu.uz/api/getquestions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data
}


export default function HomePage() {
  // const { data } = useGetQuestionsQuery();
  const data = handler()
  console.log(data);

  return <div>page</div>;
}
