"use client";

import { useGetQuestionsQuery } from "@/service/api";

export default function HomePage() {
  const { data } = useGetQuestionsQuery();
  console.log(data);

  return <div>page</div>;
}
