"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface SurveyData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  name?: string;
  studentId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const questionsLabelMap: Record<string, string> = {
  question1: "셀룰로오스(배추)",
  question2: "헤미셀룰로오스(곡류, 콩류)",
  question3: "펙틴(불용성, 과일)",
  question4: "리그닌(코코아, 콩류)",
  question5: "펙틴(수용성, 과일/채소)",
  question6: "글루코만난(곤약)",
  question7: "Cereal gum(보리, 귀리)",
  question8: "알긴산(미역, 다시마)",
};

export default function FiberResultPage() {
  const { docId } = useParams();
  const [data, setData] = useState<SurveyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;
      const docRef = doc(db, "surveyData", docId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data() as SurveyData);
      }
    };

    fetchData();
  }, [docId]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        로딩 중...
      </div>
    );
  }

  // 질문별 데이터만 필터링하고 라벨 추가
  const chartData = Object.entries(data)
    .filter(([key]) => key.startsWith("question"))
    .map(([key, value]) => ({
      name: questionsLabelMap[key] || key,
      value: value as number,
    }));

  // 전체 점수 합산
  const totalScore = chartData.reduce((sum, q) => sum + q.value, 0);

  // 점수에 따른 해석
  let interpretationTitle = "";
  let interpretationDesc: React.ReactNode = null;

  if (totalScore <= 30) {
    interpretationTitle = "~ 30점: 개선이 시급한 상태";
    interpretationDesc = (
      <>
        <p className="font-semibold mb-2">
          장내 미생물 다양성 및 유익균 비율이 매우 낮을 가능성
        </p>
        <p>🔍 개선 방안:</p>
        <ul className="list-disc list-inside mb-2">
          <li>기본적인 식이섬유 섭취 습관을 형성하는 것이 우선</li>
          <li>
            유산균만 섭취하지 말고, 프리바이오틱스(식이섬유)가 풍부한 식품부터
            습관화하시길 추천합니다!
          </li>
        </ul>
        <p>✅ 식단 제안:</p>
        <ul className="list-disc list-inside">
          <li>매일 채소 반찬 2가지 이상 섭취 (예: 배추김치, 나물류)</li>
          <li>미역국/다시마국 등 해조류 섭취 주 3회 이상</li>
          <li>아침에 귀리, 오트밀 혹은 보리밥 시도</li>
          <li>콩나물국, 두부, 된장국으로 콩류 섭취 확대</li>
        </ul>
      </>
    );
  } else if (totalScore <= 65) {
    interpretationTitle = "31~ 65점: 일정 부분 양호하지만, 개선 여지 있음";
    interpretationDesc = (
      <>
        <p className="font-semibold mb-2">
          기본적인 유익균 환경은 있지만 다양성과 안정성은 부족할 수 있음
        </p>
        <p>🔍 개선 방안:</p>
        <ul className="list-disc list-inside mb-2">
          <li>다양한 식이섬유 종류를 고르게 섭취해야 합니다.</li>
          <li>특정 식품군(예: 해조류, 곡물)에 치우치지 않도록 주의하세요!</li>
        </ul>
        <p>✅ 식단 제안:</p>
        <ul className="list-disc list-inside">
          <li>잡곡밥, 귀리, 오트밀을 번갈아 가며 섭취</li>
          <li>곤약 젤리나 곤약면 등으로 글루코만난 섭취 늘리기</li>
          <li>과일은 사과, 감귤 등 펙틴이 풍부한 과일을 포함</li>
          <li>주 2~3회 해조류 반찬 추가</li>
        </ul>
      </>
    );
  } else {
    interpretationTitle = "66 ~ 100점: 장내 환경이 양호한 상태";
    interpretationDesc = (
      <>
        <p className="font-semibold mb-2">
          유익균 비율과 미생물 다양성이 양호하며 좋은 식습관 유지 중
        </p>
        <p>🔍 유지 방안:</p>
        <ul className="list-disc list-inside mb-2">
          <li>
            현재의 식단을 유지하면서 발효식품과 유산균 보조제 등을 추가해 장내
            환경을 더욱 강화할 수 있습니다.
          </li>
          <li>스트레스 관리, 수면, 식사 시간 규칙성도 장내 미생물에 중요함.</li>
        </ul>
        <p>✅ 강화 방안:</p>
        <ul className="list-disc list-inside">
          <li>요구르트 + 귀리 같이 유산균 + 프리바이오틱스 조합 활용</li>
          <li>김치, 된장, 청국장 등 발효식품 주 2~3회 이상 섭취</li>
          <li>주말에 곤약 요리, 해조류 샐러드로 색다른 식이섬유 도전</li>
        </ul>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          설문 결과 시각화
        </h1>

        {/* 전체 점수 요약 */}
        <div className="mb-8 text-center">
          <p className="text-lg font-semibold">
            총 점수:{" "}
            <span className="text-blue-600 text-xl">{totalScore}점</span>
          </p>
        </div>

        {/* 막대 그래프 */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 해석 및 식단 제안 */}
        <div className="mt-10 p-6 bg-blue-50 rounded-lg text-gray-800">
          <h2 className="text-xl font-bold mb-4">{interpretationTitle}</h2>
          <div className="prose max-w-none">{interpretationDesc}</div>
        </div>
      </div>
    </div>
  );
}
