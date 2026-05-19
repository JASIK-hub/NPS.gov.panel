"use client";

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getCachedSurveyStats } from '@/app/lib/api/survey/surveyCache';
import { StatsBlocks } from '@/app/components/analytics/statsBlocks';
import Link from 'next/link';
import { useTranslations } from '@/app/lib/locales/useTranslations';

export default function StatsSection() {
  const { t, lang } = useTranslations();
  const [stats, setStats] = useState({
    totalVotes: 0,
    participationRate: 0,
    activeSurveys: 0,
    regionsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getCachedSurveyStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    const handleStatsUpdate = () => {
      loadStats();
    };

    window.addEventListener('stats-updated', handleStatsUpdate);

    return () => {
      window.removeEventListener('stats-updated', handleStatsUpdate);
    };
  }, []);

  return (
    <section className="py-1 rounded-3xl px-8">
      <h2 className="text-2xl text-black font-bold text-center mb-10">{t('statsSection.title')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsBlocks
          totalVotes={stats.totalVotes}
          participationRate={stats.participationRate}
          activeSurveys={stats.activeSurveys}
          regionsCount={stats.regionsCount}
          loading={loading}
        />
      </div>
      <div className="flex justify-center mt-10">
        <Link href={`/${lang}/analytics`} className="bg-black text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900">
          {t('statsSection.goToAnalytics')} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
