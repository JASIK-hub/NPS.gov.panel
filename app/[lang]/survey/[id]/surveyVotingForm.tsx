"use client";

import React, { useState, useEffect } from "react";
import { SurveyEntity } from "@/app/lib/api/survey/surveys";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isAuthenticated as checkIsAuthenticated,
  getCurrentUserId,
} from "@/app/lib/api/auth";
import {
  voteSurvey,
  checkUserParticipation,
  getAllSurveyEntities,
  getSurvey,
} from "@/app/lib/api/survey/surveys";
import { invalidateStats } from "@/app/lib/api/survey/surveyCache";
import SurveyNotes from "../surveyNotes";
import { useTranslations } from "@/app/lib/locales/useTranslations";

interface Props {
  survey: SurveyEntity;
  onVoteChange?: (hasVoted: boolean) => void;
}

const isSurveyExpired = (validUntil: string): boolean => {
  return new Date(validUntil) < new Date();
};

export default function SurveyVotingForm({ survey, onVoteChange }: Props) {
  const { t } = useTranslations();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");
  const [otherSurveys, setOtherSurveys] = useState<SurveyEntity[]>([]);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyEntity>(survey);
  const pathname = usePathname();

  const isExpired = isSurveyExpired(currentSurvey.validUntil);
  const isActuallyActive = currentSurvey.isActive && !isExpired;

  useEffect(() => {
    const initAuth = async () => {
      const authStatus = checkIsAuthenticated();
      const currentUserId = getCurrentUserId();
      setIsAuthenticated(authStatus);

      setIsMounted(true);

      if (authStatus && currentUserId) {
        try {
          const hasParticipated = await checkUserParticipation(
            String(currentSurvey.id),
          );
          if (hasParticipated) {
            setHasVoted(true);
          }
        } catch (error) {}
      }
    };

    initAuth();
  }, [currentSurvey.id]);

  useEffect(() => {
    const loadOtherSurveys = async () => {
      try {
        const allSurveys = await getAllSurveyEntities();
        const other = allSurveys
          .filter((s) => s.id !== currentSurvey.id)
          .sort((a, b) => b.vote.length - a.vote.length)
          .slice(0, 2);
        setOtherSurveys(other);
      } catch (error) {
      }
    };

    loadOtherSurveys();
  }, [currentSurvey.id]);

  useEffect(() => {
    if (onVoteChange) {
      onVoteChange(hasVoted);
    }
  }, [hasVoted, onVoteChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await voteSurvey(
        String(survey.id),
        selectedOption,
        comment,
      );

      if (result.success) {
        invalidateStats();

        const updatedSurvey = await getSurvey(String(survey.id));
        if (updatedSurvey) {
          setCurrentSurvey(updatedSurvey);
        }

        window.dispatchEvent(new Event('stats-updated'));

        setHasVoted(true);
        if (onVoteChange) {
          onVoteChange(true);
        }
      } else {
        setError(result.error || "t('survey.voteError')");
      }
    } catch (error) {
      setError("t('survey.connectionError')");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Image
              src="/nps.shield.black.png"
              width={32}
              height={32}
              alt="security shield image"
            />
          </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">
          {t('survey.authRequired')}
        </h4>
        <p className="text-slate-600 text-sm mb-6">
          {t('survey.authRequiredText')}
        </p>
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
          className="inline-block w-full py-3 rounded-xl font-bold text-base bg-[#f9bc06] text-[#0a1b33] hover:bg-[#e5ac05] transition-all"
        >
          {t('survey.authorize')}
        </Link>
      </div>
    );
  }
  if (hasVoted) {
    const currentUserId = getCurrentUserId();

    const optionVotes = currentSurvey.options.map((option) => {
      const votes = currentSurvey.vote.filter((vote) => vote.option.id === option.id);
      const userVoted = currentUserId
        ? votes.some((vote) => vote.user.id === currentUserId)
        : false;
      return {
        optionId: option.id,
        title: option.title,
        voteCount: votes.length,
        userVoted,
      };
    });

    const sortedByVotes = [...optionVotes].sort(
      (a, b) => b.voteCount - a.voteCount,
    );

    const rankColors: Record<number, string> = {
      0: "bg-[#2A9D90]",
      1: "bg-blue-900",
      2: "bg-slate-600",
      3: "bg-slate-400",
      4: "bg-slate-200",
    };

    const totalVotes = currentSurvey.vote.length;
    const maxVotes = Math.max(...optionVotes.map((o) => o.voteCount), 1);

    return (
      <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="space-y-3">
          {optionVotes.map(({ optionId, title, voteCount, userVoted }) => {
            const percentage =
              totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            const barWidth = Math.round((voteCount / maxVotes) * 100);
            const rank = sortedByVotes.findIndex(
              (o) => o.optionId === optionId,
            );
            const barColor = rankColors[rank] ?? "bg-slate-200";
            return (
              <div key={optionId} className="flex flex-col gap-1">
                <div className="flex flex-col border border-gray-200 rounded-sm px-5 py-3 gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-4 h-4 ${barColor} rounded-full flex items-center justify-center p-2.5 text-sm font-medium flex-shrink-0`}
                      >
                        {optionId}
                      </span>
                      <span className="text-sm text-slate-800 truncate">
                        {title}
                      </span>
                      {userVoted && (
                        <div className="flex items-center bg-[#E0E7FF] px-2 py-0.5 rounded-sm flex-shrink-0">
                          <Image
                            src="/nps.checkbox.vote.png"
                            width={14}
                            height={14}
                            alt="checkbox image"
                          />
                          <span className="text-[10px] font-bold px-1.5 text-[#1E1B4B] whitespace-nowrap">
                            {t('survey.yourChoice')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-400">
                        {voteCount.toLocaleString("ru-RU")} {t('survey.votes')}
                      </span>
                      <span className="text-sm font-bold text-slate-900 min-w-[32px] text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SurveyNotes otherSurveys={otherSurveys} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit}>
          {isExpired && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center gap-2">
              <Image src="/nps.clock.png" width={16} height={16} alt="clock icon" />
              {t('survey.surveyExpired')}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <h4 className="text-lg font-bold mb-4 text-slate-900">
            {currentSurvey.subTitle}
          </h4>

          <div className="space-y-2 mb-6">
            {currentSurvey.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "border-blue-900 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="survey-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(Number(e.target.value))}
                  disabled={!isActuallyActive}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                />
                <span className="ml-3 text-slate-800 font-medium text-sm">
                  {option.title}
                </span>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 block">
              <Image
                src="/nps.comment.png"
                width={15}
                height={15}
                alt="comment image"
              />{" "}
              {t('survey.comment')}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-black w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all resize-none text-sm"
              placeholder="t('survey.commentPlaceholder')"
              rows={3}
              disabled={!isActuallyActive}
            />
          </div>

          <button
            type="submit"
            disabled={!isActuallyActive || selectedOption === null || isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              !isActuallyActive || selectedOption === null || isSubmitting
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-[#0f172a] text-white hover:bg-blue-900"
            }`}
          >
            {isSubmitting ? "{t('survey.submitting')}" : "t('survey.submitVote')"}
          </button>
        </form>
      </div>
      <SurveyNotes otherSurveys={otherSurveys} />
    </div>
  );
}
