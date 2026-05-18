"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import {
  getSurveyStats,
  getRegionUserStats,
  getRegionClosedSurveyStats,
  RegionStats,
} from "@/app/lib/api/survey/surveys";
import { StatsBlocks } from "@/app/components/analytics/statsBlocks";
import { KazakhstanInteractiveMap } from "@/app/components/analytics/KazakhstanInteractiveMap";
import { AgeGroupChart } from "@/app/components/analytics/userAgeGroupChart";
import { GenderChart } from "@/app/components/analytics/userGenderGroupChart";
import { TopicChart } from "@/app/components/analytics/surveyTypeChart";
import { useTranslations } from "@/app/lib/locales/useTranslations";

const ParticipationChart = dynamic(
  () => import("@/app/components/analytics/userParticipationChart").then(mod => ({ default: mod.ParticipationChart })),
  { ssr: false }
);

export default function AnalyticsPage() {
  const params = useParams();
  const { t } = useTranslations();
  const [stats, setStats] = useState({
    totalVotes: 0,
    participationRate: 0,
    activeSurveys: 0,
    regionsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [closedSurveyStats, setClosedSurveyStats] = useState<RegionStats[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getSurveyStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const loadRegionStats = async () => {
      try {
        const data = await getRegionUserStats();
        setRegionStats(data);
      } catch (error) {}
    };

    const loadClosedSurveyStats = async () => {
      try {
        const data = await getRegionClosedSurveyStats();
        setClosedSurveyStats(data);
      } catch (error) {}
    };

    loadStats();
    loadRegionStats();
    loadClosedSurveyStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-100">
        <div className="text-black max-w-7xl px-8 mx-auto py-7 flex flex-col">
          <span className="text-4xl font-bold">{t('analytics.title')}</span>
          <span className="text-gray-600">
            {t('analytics.subtitle')}
          </span>
        </div>
      </div>
      <div className="bg-white  border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsBlocks
              totalVotes={stats.totalVotes}
              participationRate={stats.participationRate}
              activeSurveys={stats.activeSurveys}
              regionsCount={stats.regionsCount}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        <div className="grid grid-cols-5 gap-6 items-start">
          <div className="col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#001D3D]">
                {t('analytics.mapOfKazakhstan')}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {t('analytics.activityByRegion')}
              </p>
            </div>
            <div className="min-h-[400px]">
              <KazakhstanInteractiveMap stats={regionStats} />
            </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#001D3D]">
                {t('analytics.completedSurveys')}
              </h3>
              <p className="text-sm text-gray-400">{t('analytics.statisticsByRegion')}</p>
            </div>

            <div className="space-y-6">
              {closedSurveyStats.map((region) => (
                <div key={region.id} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>{region.name}</span>
                    <span className="text-gray-900">{region.activity}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#001D3D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${region.activity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mt-5">
          <AgeGroupChart />
          <GenderChart/>
          <TopicChart/>
        </div>

        <ParticipationChart isAdmin={false} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold">{t('analytics.chronologyOfDecisions')}</h3>
            {[
              {
                status: "{t('analytics.implemented')}",
                color: "text-emerald-600 bg-emerald-50",
                icon: <CheckCircle2 size={16} />,
              },
              {
                status: "{t('analytics.inProcess')}",
                color: "text-orange-600 bg-orange-50",
                icon: <Clock size={16} />,
              },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-white border rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-medium">
                    До 15 марта 2026
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${item.color}`}
                  >
                    {item.icon} {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-lg">
                  Удовлетворённость системой образования
                </h4>
                <p className="text-sm text-slate-500">
                  Выделено дополнительное финансирование на повышение
                  квалификации учителей — 45 млрд тенге
                </p>
                <div className="flex gap-6 pt-2 border-t text-sm">
                  <span className="font-bold">
                    384 920{" "}
                    <span className="font-normal text-slate-400">{t('analytics.votes')}</span>
                  </span>
                  <span className="font-bold">
                    {t('analytics.support')} <span className="text-slate-600">78%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('analytics.adoptedChanges')}</h3>
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <CheckCircle2 className="text-emerald-500" />
              <p className="text-xs text-slate-400 uppercase font-bold">
                {t('analytics.actionsTaken')}
              </p>
              <h4 className="font-bold text-lg">
                Улучшение качества образования
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Повышение зарплат педагогов на 25%, программа переподготовки,
                новые учебники
              </p>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase">
                  {t('analytics.implemented')}
                </span>
                <a
                  href="#"
                  className="text-blue-600 text-sm flex items-center gap-1 font-medium"
                >
                  {t('analytics.moreDetails')} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
