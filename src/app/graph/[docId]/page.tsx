// app/graph/[docId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type BarChartData = ChartData<"bar", number[], string>;

export default function GraphPage() {
  const { docId } = useParams();
  const [chartData, setChartData] = useState<BarChartData | null>(null);

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "surveyData", docId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as { question1: number; question2: number };
            setChartData({
              labels: ["질문 1", "질문 2"],
              datasets: [
                {
                  label: "내가 선택한 점수",
                  data: [data.question1, data.question2],
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                  ],
                },
              ],
            });
          } else {
            console.log("문서를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("데이터 가져오기 에러: ", error);
        }
      };
      fetchData();
    }
  }, [docId]);

  if (!docId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">제출된 설문 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          당신의 식습관은?
        </h1>
        {chartData ? (
          <div className="p-4">
            <Bar data={chartData} />
          </div>
        ) : (
          <p className="text-center text-gray-600">데이터를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}
