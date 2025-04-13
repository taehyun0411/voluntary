"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

// Chart.js 관련 import
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

// 스타일 애니메이션을 위한 라이브러리 (Tailwind 기본 지원)
import "animate.css";

type BarChartData = ChartData<"bar", number[], string>;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function GraphPage() {
  const docId = useParams().docId?.toString();
  const [chartData, setChartData] = useState<BarChartData | null>(null);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: "bottom" } }, // 범례 위치 조정
  };

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        try {
          const surveyCollection = collection(db, "surveyData");
          const docRef = doc(surveyCollection, docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as { question1: number; question2: number };
            setChartData({
              labels: ["질문 1", "질문 2"],
              datasets: [
                {
                  label: "내가 선택한 점수",
                  data: [data.question1, data.question2],
                  backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)"],
                  borderRadius: 5, // 막대 모서리 둥글게
                },
              ],
            });
          } else {
            console.log("문서를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("데이터 가져오기 에러:", error);
        }
      };
      fetchData();
    }
  }, [docId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          설문조사 결과 📊
        </h1>
        {chartData ? (
          <div className="p-4 h-96">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">데이터를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}
