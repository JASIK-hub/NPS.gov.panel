"use client";

import { MapPin, Users, Calendar } from 'lucide-react';
import { Survey } from '@/app/lib/api/survey/surveys';
import Link from 'next/link';
import Image from 'next/image';

interface SurveyCardHomeProps {
  survey: Survey;
  lang?: string;
}

const isSurveyExpired = (validUntil: string): boolean => {
  return new Date(validUntil) < new Date();
};

const texts = {
  ru: {
    active: 'АКТИВНЫЙ',
    completed: 'ЗАВЕРШЕН',
    vote: 'Проголосовать',
    viewResults: 'Посмотреть результаты',
    initiator: 'Инициатор',
    until: 'До',
    participants: 'Участие'
  },
  kz: {
    active: 'БЕЛСЕНДІ',
    completed: 'АЯҚТАЛДЫ',
    vote: 'Дауыс беру',
    viewResults: 'Нәтижелерді қарау',
    initiator: 'Инициатор',
    until: 'Дейін',
    participants: 'Қатысу'
  }
};

export default function SurveyCardHome({ survey, lang = 'ru' }: SurveyCardHomeProps) {
  const t = texts[lang as keyof typeof texts] || texts.ru;
  const isExpired = isSurveyExpired(survey.validUntil);
  const isActuallyActive = survey.isActive && !isExpired;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${
            isActuallyActive
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {isActuallyActive ? t.active : t.completed}
          </span>
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <MapPin size={13} /> {survey.location}
          </span>
        </div>

        <h3 className="font-bold text-[17px] text-slate-900 leading-snug mb-3">
          {survey.title}
        </h3>

        <p className="text-slate-500 text-sm line-clamp-2 mb-1">
          {survey.description}
        </p>
      </div>

      <div className="border-t border-slate-200" />

      <div className="p-6 flex flex-col gap-4">
        <div className='text-black flex text-sm gap-2'>
            <span>{t.initiator}: </span>
            <span className='text-gray-500'> {survey.organizationName}</span>
          </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Image src="/nps.clock.png" width={13} height={13} alt='clock image'/>{t.until} {survey.deadline}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {survey.participants}
          </span>
        </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>{t.participants}</span>
              <span className='text-black'>{survey.participationRate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-black h-full rounded-full" style={{ width: `${survey.participationRate}%` }} />
            </div>
          </div>

        <Link href={`/${lang}/survey/${survey.id}`} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all text-center block ${
          isActuallyActive
            ? 'bg-[#0f172a] text-white hover:bg-blue-900'
            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}>
          {isActuallyActive ? t.vote : t.viewResults}
        </Link>
      </div>
    </div>
  );
}
