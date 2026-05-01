import HeroSection from "./components/home/heroSection";
import ActiveSurveys from "./components/home/activeSurveys";
import StatsSection from "./components/home/statsSection";
import InstructionsSection from "./components/home/instructionsSection";
import { getActiveSurveys, getClosedSurveys } from "./lib/api/surveys";

export default async function HomePage() {
  const [activeSurveys, closedSurveys] = await Promise.all([
    getActiveSurveys().catch(() => []),
    getClosedSurveys().catch(() => [])
  ]);

  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ActiveSurveys surveys={activeSurveys} />
        <ActiveSurveys title="Завершённые опросы" status="closed" surveys={closedSurveys} />
        <StatsSection />
        <InstructionsSection />
      </div>
    </>
  );
}