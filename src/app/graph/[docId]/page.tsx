"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase"; // firebase 설정 파일의 경로를 실제 위치에 맞게 조정하세요.
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

// Bar 차트에 사용할 데이터 타입 지정
type BarChartData = ChartData<"bar", number[], string>;

// Chart.js에 Bar 차트를 위한 요소 등록
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function GraphPage() {
  // URL 경로 매개변수에서 docId 추출
  const { docId } = useParams();

  // chartData 상태를 BarChartData | null 로 선언하여 초기값을 null로 설정
  const [chartData, setChartData] = useState<BarChartData | null>(null);

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "surveyData", docId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Firestore에서 가져온 데이터는 question1과 question2가 number라고 가정합니다.
            const data = docSnap.data() as { question1: number; question2: number };

            // BarChartData 객체 생성
            const barData: BarChartData = {
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
            };

            setChartData(barData);
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

  // URL에 docId가 없으면 안내 메시지 출력
  if (!docId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">제출된 설문 데이터가 없습니다.</p>
      </div>
    );
  }

  // Chart.js 옵션 (필요시 더 추가 가능합니다)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          설문조사 결과
        </h1>
        {chartData ? (
          <div className="p-4 h-96">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-600">데이터를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}
