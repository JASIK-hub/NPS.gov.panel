"use client";

import { useEffect, useState } from "react";
import HeroSection from "./components/home/heroSection";
import ActiveSurveys from "./components/home/activeSurveys";
import StatsSection from "./components/home/statsSection";
import InstructionsSection from "./components/home/instructionsSection";
import { Survey } from "./lib/api/survey/surveys";
import { getCachedActiveSurveys, getCachedClosedSurveys } from "./lib/api/survey/surveyCache";

export default function HomePage() {
  const [activeSurveys, setActiveSurveys] = useState<Survey[]>([]);
  const [closedSurveys, setClosedSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const [active, closed] = await Promise.all([
          getCachedActiveSurveys(),
          getCachedClosedSurveys()
        ]);
        setActiveSurveys(active);
        setClosedSurveys(closed);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ActiveSurveys surveys={loading ? [] : activeSurveys} />
        <ActiveSurveys title="Завершённые опросы" status="closed" surveys={loading ? [] : closedSurveys} />
        <StatsSection />
        <InstructionsSection />
      </div>
    </>
  );
}