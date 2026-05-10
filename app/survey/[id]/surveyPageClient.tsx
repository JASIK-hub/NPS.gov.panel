"use client";

import { useEffect, useState } from "react";
import { getSurvey } from "@/app/lib/api/survey/surveys";
import Link from 'next/link';
import SurveyVotingForm from './surveyVotingForm';
import { Container } from '@/app/components/shared/container';
import Image from 'next/image';
import { SurveyEntity } from "@/app/lib/api/survey/surveys";
import { getCurrentUserId } from "@/app/lib/api/auth";

export default function SurveyPageClient({ params }: { params: Promise<{ id: string }> }) {
  const [survey, setSurvey] = useState<SurveyEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const loadSurvey = async () => {
      const { id } = await params;
      const data = await getSurvey(id);

      if (!data) {
        setLoading(false);
        return;
      }

      setSurvey(data);

      const userId = getCurrentUserId();
      if (userId) {
        const hasParticipated = data.vote.some(vote => vote.user.id === userId);
        setHasVoted(hasParticipated);
      }

      setLoading(false);
    };

    loadSurvey();
  }, [params]);

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Опрос не найден</div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    }).replace(/\//g, '.');
  };

  const dateRange = `${formatDate(survey.startDate)}-${formatDate(survey.validUntil)}.${new Date(survey.validUntil).getFullYear()}`;

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
         <Container className="py-6">
          <Link
            href="/surveys"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors font-medium text-sm"
          >
            <Image src='/nps.arrow.png' width={8} height={8} alt="arrow left image"/> Все опросы
          </Link>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${
                survey.isActive
                  ? 'bg-green-100 text-brand-success'
                  : 'bg-slate-100 text-brand-success/50'
              }`}>
                {survey.isActive ? 'АКТИВНЫЙ' : 'ЗАВЕРШЕН'}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
              {survey.title}
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {survey.description}
            </p>

            {hasVoted ? (
              <div className="bg-[#F8FAFC] rounded-xl p-6 mb-4">
                <div className="grid grid-cols-10 gap-6 items-center">
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Инициатор</p>
                    <p className="font-bold text-slate-800 text-sm">{survey.organization?.name || 'Государственный орган'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Срок проведения</p>
                    <div className="flex items-center gap-2">
                      <Image src='/nps.clock.png' width={16} height={16} alt="clock image"/>
                      <p className="font-bold text-slate-800 text-sm">
                        {dateRange}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-6 text-right">
                    <p className="text-[8px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Всего проголосовало</p>
                    <div className="flex items-center justify-end gap-2">
                      <Image src='/nps.users.png' height={28} width={28} alt='users image'/>
                      <span className="font-bold text-4xl text-slate-800">{survey.votedCount.toLocaleString()}</span>
                    </div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wide font-semibold mb-1 mt-1">Граждан Казахстана</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-slate-100 bg-[#F8FAFC] p-3 rounded-2xl mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Организатор</p>
                  <p className="font-bold text-slate-800 text-sm">{survey.organization?.name || 'Государственный орган'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Срок окончания</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {dateRange}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Количество голосов</p>
                  <div className="flex items-center gap-1 font-medium text-slate-800 text-sm">
                    <Image src='/nps.users.png' height={17} width={17} alt='users image'/>
                    <span className="font-bold">{survey.votedCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <SurveyVotingForm survey={survey} onVoteChange={setHasVoted} />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-[#60A5FACC] flex items-start gap-2">
            <Image src='/nps.shield.black.png' width={10} height={10} alt="security shield image" className="mt-0.5"/>
            <div>
              <p className="text-blue-900 font-semibold text-xs">Безопасное голосование</p>
              <p className="text-[#60A5FA] text-[12px] mt-0.5 leading-relaxed">
                Ваши данные защищены и никак не будут разглашены вторым лицам.
              </p>
            </div>
          </div>
      </Container>
        </div>
  );
}
