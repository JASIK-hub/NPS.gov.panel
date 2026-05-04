'use client';

import React, { useState, useEffect } from 'react';
import { SurveyEntity, SurveyResults, VoteResult } from '@/app/lib/api/survey/surveys';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated as checkIsAuthenticated } from '@/app/lib/api/auth';
import { voteSurvey, getSurveyResults } from '@/app/lib/api/survey/surveys';

export default function SurveyVotingForm( { survey }: { survey: SurveyEntity }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(checkIsAuthenticated());

    if (checkIsAuthenticated()) {
      loadResults();
    }
  }, []);

  const loadResults = async () => {
    try {
      const data = await getSurveyResults(String(survey.id));
      if (data && data.hasVoted) {
        setHasVoted(true);
        setResults(data);
      }
    } catch (error) {
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await voteSurvey(String(survey.id), selectedOption, comment);

      if (result.success) {
        setHasVoted(true);
        await loadResults();
      } else {
        setError(result.error || 'Ошибка при голосовании');
      }
    } catch (error) {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Image src='/nps.shield.black.png' width={32} height={32} alt="security shield image"/>
          </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">
          Требуется авторизация
        </h4>
        <p className="text-slate-600 text-sm mb-6">
          Для участия в опросе необходимо войти в систему
        </p>
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
          className="inline-block w-full py-3 rounded-xl font-bold text-base bg-[#f9bc06] text-[#0a1b33] hover:bg-[#e5ac05] transition-all"
        >
          Пройдите авторизацию
        </Link>
      </div>
    );
  }

  if (hasVoted && results) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
          Спасибо за ваш голос!
        </h2>

        <div className="space-y-4">
          {survey.options.map((option) => {
            const result = results.results.find(r => r.optionId === option.id);
            const percentage = result?.percentage || 0;
            const voteCount = result?.voteCount || 0;
            const isUserVote = result?.isUserVote || false;

            return (
              <div key={option.id} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{option.title}</span>
                    {isUserVote && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        Ваш вариант
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                    <span className="text-xs text-slate-500">{voteCount} чел.</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center">
            Всего проголосовало: <span className="font-bold text-slate-700">{results.totalVotes}</span> человек
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <h4 className="text-lg font-bold mb-4 text-slate-900">
          {survey.subTitle}
        </h4>

        <div className="space-y-2 mb-6">
          {survey.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="survey-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(Number(e.target.value))}
                disabled={!survey.isActive}
                className="w-4 h-4 text-blue-900 focus:ring-blue-900"
              />
              <span className="ml-3 text-slate-800 font-medium text-sm">{option.title}</span>
            </label>
          ))}
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 block">
            <Image src='/nps.comment.png' width={15} height={15} alt='comment image'/> Комментарий (необязательно)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-black w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all resize-none text-sm"
            placeholder="Поделитесь своими мыслями или предложениями..."
            rows={3}
            disabled={!survey.isActive}
          />
        </div>

        <button
          type="submit"
          disabled={!survey.isActive || selectedOption === null || isSubmitting}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            !survey.isActive || selectedOption === null || isSubmitting
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#0f172a] text-white hover:bg-blue-900'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Подтвердить голос'}
        </button>
      </form>
    </div>
  );
}
