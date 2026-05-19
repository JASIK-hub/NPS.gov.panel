"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Survey } from '../../lib/api/survey/surveys';
import Link from 'next/link';
import SurveyCardHome from '../survey/surveyCardHome';
import { useTranslations } from '@/app/lib/locales/useTranslations';

interface SurveyProps {
  title?: string;
  status?: 'active' | 'closed';
  surveys?: Survey[];
}

const ActiveSurveys = ({ title, status = 'active', surveys = [] }: SurveyProps) => {
  const { t, lang } = useTranslations();
  const displayTitle = title || (status === 'active' ? t('activeSurveys.activeTitle') : t('activeSurveys.completedTitle'));

  return (
    <section className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{displayTitle}</h2>
          <p className="text-slate-500 mt-2">{t('activeSurveys.subtitle')}</p>
        </div>
        <Link href={`/${lang}/surveys`} className="text-black  flex items-center gap-2 hover:underline">
          {t('activeSurveys.allSurveys')} <ArrowRight size={18} />
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">{t('activeSurveys.noSurveys')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <SurveyCardHome key={survey.id} survey={survey} lang={lang} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveSurveys;