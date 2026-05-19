"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Container } from "@/app/components/shared/container";
import { Survey } from "@/app/lib/api/survey/surveys";
import SurveyCardHome from "@/app/components/survey/surveyCardHome";
import { filterSurveysLight } from "@/app/lib/utils/surveySearch";
import { getCachedSurveyTypes, getCachedActiveSurveys, getCachedClosedSurveys, SurveyType } from "@/app/lib/api/survey/surveyCache";
import { useTranslations } from "@/app/lib/locales/useTranslations";

type StatusFilter = 'all' | 'active' | 'closed';

export default function SurveysPage() {
  const params = useParams();
  const lang = (params.lang as string) || 'ru';
  const { t } = useTranslations();

  const [activeSurveys, setActiveSurveys] = useState<Survey[]>([]);
  const [closedSurveys, setClosedSurveys] = useState<Survey[]>([]);
  const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [types, active, closed] = await Promise.all([
          getCachedSurveyTypes(lang),
          getCachedActiveSurveys(lang),
          getCachedClosedSurveys(lang)
        ]);
        console.log(types)
        setSurveyTypes(types);
        setActiveSurveys(active);
        setClosedSurveys(closed);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lang]);

  const filteredActive = filterSurveysLight(activeSurveys, searchQuery, selectedType);
  const filteredClosed = filterSurveysLight(closedSurveys, searchQuery, selectedType);

  const showActive = statusFilter === 'all' || statusFilter === 'active';
  const showClosed = statusFilter === 'all' || statusFilter === 'closed';

  const displayedActive = showActive ? filteredActive : [];
  const displayedClosed = showClosed ? filteredClosed : [];
  return (
    <div className="min-h-screen bg-slate-100">
      <Container className="py-6">
        <div className="mb-6">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors font-medium text-sm"
          >
            <Image src='/nps.arrow.png' width={8} height={8} alt="arrow left image"/> {t('surveysPage.toMain')}
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-6">{t('surveysPage.title')}</h1>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t('surveysPage.searchPlaceholder')}
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
              <div className="flex border border-gray-300 rounded-2xl">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-l-2xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === 'all'
                      ? "bg-black text-white"
                      : "bg-white text-slate-600 "
                  }`}
                >
                  {t('surveysPage.all')}
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === 'active'
                      ? "bg-black text-white"
                      : "bg-white text-slate-600 "
                  }`}
                >
                  {t('surveysPage.active')}
                </button>
                <button
                  onClick={() => setStatusFilter('closed')}
                  className={`rounded-r-2xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === 'closed'
                      ? "bg-black text-white"
                      : "bg-white text-slate-600 "
                  }`}
                >
                  {t('surveysPage.completed')}
                </button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === 'all'
                    ? "bg-black text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {t('surveysPage.all')}
              </button>
              {surveyTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(type.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type.name
                      ? "bg-black text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {lang === 'kz' ? type.nameKz : type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showActive && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('surveysPage.active')}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-8 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedActive.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedActive.map((survey) => (
                  <SurveyCardHome key={survey.id} survey={survey} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-lg mb-2">{t('surveysPage.noActive')}</p>
                <p className="text-slate-400 text-sm">{t('surveysPage.noActiveDesc')}</p>
              </div>
            )}
          </div>
        )}

        {showClosed && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('surveysPage.completed')}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-8 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedClosed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedClosed.map((survey) => (
                  <SurveyCardHome key={survey.id} survey={survey} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-lg mb-2">{t('surveysPage.noCompleted')}</p>
                <p className="text-slate-400 text-sm">{t('surveysPage.noCompletedDesc')}</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
