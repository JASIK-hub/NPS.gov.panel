"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/app/components/shared/container";
import { SurveyEntity, Survey } from "@/app/lib/api/survey/surveys";
import { getAllSurveyEntities, getSurveysByType, getSurveyTypes } from "@/app/lib/api/survey/surveys";
import SurveyCardHome from "@/app/components/survey/surveyCardHome";
import { filterSurveys } from "@/app/lib/utils/surveySearch";

function mapSurveyEntity(entity: SurveyEntity): Survey {
  return {
    id: String(entity.id),
    title: entity.title,
    description: entity.description,
    isActive: entity.isActive,
    location: entity.region?.name || 'Вся РК',
    deadline: new Date(entity.validUntil).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    participants: entity.votedCount,
    participationPercentage: Math.min(100, Math.round((entity.votedCount / 1000) * 100))
  };
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyEntity[]>([]);
  const [surveyTypes, setSurveyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const types = await getSurveyTypes();
        setSurveyTypes(types);

        let data: SurveyEntity[];
        if (selectedType === "all") {
          data = await getAllSurveyEntities();
        } else {
          data = await getSurveysByType(selectedType);
        }

        setSurveys(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedType]);

  const filteredSurveys = filterSurveys(surveys, searchQuery);

  const activeSurveys = filteredSurveys.filter(s => s.isActive).map(mapSurveyEntity);
  const completedSurveys = filteredSurveys.filter(s => !s.isActive).map(mapSurveyEntity);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors font-medium text-sm"
          >
            <Image src='/nps.arrow.png' width={8} height={8} alt="arrow left image"/> На главную
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-6">Все опросы</h1>

          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск опросов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black w-full px-4 py-3 pl-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
              />
              <Image
                src='/nps.search.png'
                width={16}
                height={16}
                alt="search icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === "all"
                    ? "bg-blue-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                Все
              </button>
              {surveyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    selectedType === type
                      ? "bg-blue-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {type === 'social' ? 'Социальные' : type === 'political' ? 'Политические' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Активные опросы</h2>
          {activeSurveys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSurveys.map((survey) => (
                <SurveyCardHome key={survey.id} survey={survey} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 text-lg mb-2">Активных опросов пока нет</p>
              <p className="text-slate-400 text-sm">Проверьте позже или посмотрите завершенные опросы</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Завершенные опросы</h2>
          {completedSurveys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSurveys.map((survey) => (
                <SurveyCardHome key={survey.id} survey={survey} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 text-lg mb-2">Завершенных опросов пока нет</p>
              <p className="text-slate-400 text-sm">Проверьте позже или посмотрите активные опросы</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
