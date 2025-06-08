"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FiberSurveyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    answers: {} as { [key: string]: number },
  });

  const questions = [
    {
      key: "question1",
      text: "셀룰로오스를 함유한 배추는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 4 },
        { label: "주 3~4회", value: 9 },
        { label: "거의 매일", value: 14 },
      ],
    },
    {
      key: "question2",
      text: "헤미셀룰로오스를 함유한 곡류, 콩류는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 3 },
        { label: "주 3~4회", value: 6 },
        { label: "거의 매일", value: 10 },
      ],
    },
    {
      key: "question3",
      text: "펙틴(불용성)을 함유한 미숙과일, 감귤, 사과는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 3 },
        { label: "주 3~4회", value: 6 },
        { label: "거의 매일", value: 10 },
      ],
    },
    {
      key: "question4",
      text: "리그닌을 함유한 코코아,콩류는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 2 },
        { label: "주 3~4회", value: 5 },
        { label: "거의 매일", value: 8 },
      ],
    },
    {
      key: "question5",
      text: "펙틴(수용성)을 함유한 배추, 배, 감 등의 과일과 채소는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 4 },
        { label: "주 3~4회", value: 8 },
        { label: "거의 매일", value: 12 },
      ],
    },
    {
      key: "question6",
      text: "글루코만난을 함유한 곤약은 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 2 },
        { label: "주 3~4회", value: 5 },
        { label: "거의 매일", value: 8 },
      ],
    },
    {
      key: "question7",
      text: "Cereal gum을 함유한 보리, 오트밀, 귀리의 섭취는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 4 },
        { label: "주 3~4회", value: 9 },
        { label: "거의 매일", value: 14 },
      ],
    },
    {
      key: "question8",
      text: "알긴산을 함유한 미역, 다시마는 얼마나 자주 섭취하나요?",
      options: [
        { label: "거의 먹지 않는다", value: 0 },
        { label: "주 1~2회", value: 4 },
        { label: "주 3~4회", value: 9 },
        { label: "거의 매일", value: 14 },
      ],
    },
  ];

  const handleOptionChange = (questionKey: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: value,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(form.answers).length !== questions.length) {
      alert("모든 문항에 응답해 주세요.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "surveyData"), {
        name: form.name,
        studentId: form.studentId,
        ...form.answers,
        createdAt: new Date(),
      });
      router.push(`/graph/${docRef.id}`);
    } catch (err) {
      console.error("제출 실패:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          식이섬유 섭취 빈도 조사
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">학번</label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                required
              />
            </div>
          </div>

          {questions.map((q) => (
            <div key={q.key} className="mb-4">
              <p className="font-medium text-gray-800 mb-2">{q.text}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleOptionChange(q.key, opt.value)}
                    className={`px-3 py-2 border rounded-md transition-colors ${
                      form.answers[q.key] === opt.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
