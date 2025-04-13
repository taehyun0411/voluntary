// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

interface FormValues {
  name: string;
  studentId: string;
  question1: number | null;
  question2: number | null;
}

export default function SurveyPage() {
  const router = useRouter();
  const ratingOptions = [
    { value: 1, label: "매우 적음" },
    { value: 2, label: "적음" },
    { value: 3, label: "보통" },
    { value: 4, label: "많음" },
    { value: 5, label: "매우 많음" },
  ];

  const [form, setForm] = useState<FormValues>({
    name: "",
    studentId: "",
    question1: null,
    question2: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRatingChange = (
    questionName: "question1" | "question2",
    rating: number
  ) => {
    setForm({ ...form, [questionName]: rating });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.question1 === null || form.question2 === null) {
      alert("모든 질문에 답해주세요.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "surveyData"), {
        name: form.name,
        studentId: form.studentId,
        question1: form.question1,
        question2: form.question2,
        createdAt: new Date(),
      });
      // 동적 라우트를 사용하여 /graph/[docId] 형태로 이동
      router.push(`/graph/${docRef.id}`);
    } catch (err) {
      console.error("데이터 저장 에러: ", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8 flex flex-col">
        {/* 상단 헤더 */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            프로젝트 봉사활동-식습관 제안
          </h1>
        </header>

        {/* 설문조사 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-1 text-gray-600 font-medium">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="studentId" className="block mb-1 text-gray-600 font-medium">
              학번
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* 질문 1 */}
          <div>
            <label className="block mb-2 text-gray-600 font-medium">질문 1</label>
            <div className="flex space-x-4">
              {ratingOptions.map((option) => (
                <button
                  key={`q1-${option.value}`}
                  type="button"
                  onClick={() => handleRatingChange("question1", option.value)}
                  className={`px-3 py-2 rounded-md border transition-colors ${
                    form.question1 === option.value
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {/* 질문 2 */}
          <div>
            <label className="block mb-2 text-gray-600 font-medium">질문 2</label>
            <div className="flex space-x-4">
              {ratingOptions.map((option) => (
                <button
                  key={`q2-${option.value}`}
                  type="button"
                  onClick={() => handleRatingChange("question2", option.value)}
                  className={`px-3 py-2 rounded-md border transition-colors ${
                    form.question2 === option.value
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            제출하기
          </button>
        </form>

        {/* 하단 푸터 */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">produced by taehyun &amp; minjae</p>
        </footer>
      </div>
    </div>
  );
}
