"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { AdminSurvey, getAllAdminSurveys, getAdminStats } from "@/app/lib/api/admin";

const ParticipationChart = dynamic(
  () => import("@/app/components/analytics/userParticipationChart").then(mod => ({ default: mod.ParticipationChart })),
  { ssr: false }
);

type ExecutionStatus = "implemented" | "in progress" | "cancelled";

export default function AdminDashboardPage() {
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [stats, setStats] = useState({
    activeSurveys: 0,
    draftSurveys: 0,
    completedSurveys: 0,
    totalVotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [surveysData, statsData] = await Promise.all([
        getAllAdminSurveys(),
        getAdminStats(),
      ]);
      setSurveys(surveysData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<ExecutionStatus, string> = {
    "implemented": "Реализован",
    "in progress": "В процессе",
    "cancelled": "Отменен",
  };

  const statusColors: Record<ExecutionStatus, string> = {
    "implemented": "bg-green-100 text-green-700 border-green-200",
    "in progress": "bg-blue-100 text-blue-700 border-blue-200",
    "cancelled": "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Панель управления</h1>
          <p className="text-slate-500 text-sm mt-1">Добро пожаловать в админ панель</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Активные опросы</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">▓</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.activeSurveys}</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Черновики</span>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">◐</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.draftSurveys}</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Завершенные</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">✓</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.completedSurveys}</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Всего голосов</span>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🗳</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalVotes.toLocaleString('ru-RU')}</div>
            </div>
          </div>

          {/* My Surveys */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Мои опросы</h2>
                  <p className="text-slate-500 text-sm mt-1">Управление вашими опросами</p>
                </div>
                <button className="flex items-center gap-2 bg-[#051124] hover:bg-[#0a1b33] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus size={18} />
                  Создать опрос
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-scroll overflow-x-hidden h-80">
              {surveys.length > 0 ? surveys.map((survey) => (
                <div key={survey.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{survey.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[survey.executionStatus]}`}>
                          {statusLabels[survey.executionStatus]}
                        </span>
                        <span className="text-slate-400 text-xs">
                          До: {new Date(survey.validUntil).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{survey.votedCount} голосов</div>
                      <div className="text-slate-400 text-xs">{survey.type}</div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center">
                  <p className="text-slate-500">Опросов пока нет</p>
                  <button className="mt-4 text-[#051124] font-medium text-sm hover:underline">
                    Создать первый опрос
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analytics */}
          <ParticipationChart isAdmin={true} />
        </div>
      )}
    </div>
  );
}
