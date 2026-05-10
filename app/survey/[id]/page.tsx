import { Suspense } from "react";
import SurveyPageClient from "./surveyPageClient";

export default function SurveyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    }>
      <SurveyPageClient params={params} />
    </Suspense>
  );
}
