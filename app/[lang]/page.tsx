"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeroSection from "@/app/components/home/heroSection";
import ActiveSurveys from "@/app/components/home/activeSurveys";
import StatsSection from "@/app/components/home/statsSection";
import InstructionsSection from "@/app/components/home/instructionsSection";
import { Survey } from "@/app/lib/api/survey/surveys";
import { getCachedActiveSurveys, getCachedClosedSurveys } from "@/app/lib/api/survey/surveyCache";

export default function LangHomePage() {
  const params = useParams();
  const lang = (params.lang as string) || 'ru';
  const [activeSurveys, setActiveSurveys] = useState<Survey[]>([]);
  const [closedSurveys, setClosedSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const [active, closed] = await Promise.all([
          getCachedActiveSurveys(lang),
          getCachedClosedSurveys(lang)
        ]);
        setActiveSurveys(active);
        setClosedSurveys(closed);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, [lang]);

  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ActiveSurveys surveys={loading ? [] : activeSurveys} />
        <ActiveSurveys status="closed" surveys={loading ? [] : closedSurveys} />
        <StatsSection />
        <InstructionsSection />
      </div>
    </>
  );
}
