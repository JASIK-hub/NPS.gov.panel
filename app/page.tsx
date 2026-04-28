import HeroSection from "./components/home/heroSection";
import ActiveSurveys from "./components/home/activeSurveys";
import StatsSection from "./components/home/heroSection";
import InstructionsSection from "./components/home/instructionsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12 ">
        <ActiveSurveys />
        <ActiveSurveys title="Завершённые опросы" status="closed" />
        <StatsSection />
        <InstructionsSection />
      </div>
    </>
  );
}