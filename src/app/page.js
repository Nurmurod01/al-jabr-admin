"use client";

import { useGetQuestionsQuery } from "@/service/api";

export default function HomePage() {
  const { data } = useGetQuestionsQuery("uz");
  console.log(data);

  return <div>page</div>;
}
