"use client";

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getSurveyStats, getRegionUserStats, getRegionClosedSurveyStats, RegionStats } from '@/app/lib/api/survey/surveys';
import { StatsBlocks } from '@/app/components/analytics/statsBlocks';
import { KazakhstanInteractiveMap } from '@/app/components/analytics/KazakhstanInteractiveMap';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalVotes: 0,
    participationRate: 0,
    activeSurveys: 0,
    regionsCount: 0
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
      } catch (error) {
      }
    };

    const loadClosedSurveyStats = async () => {
      try {
        const data = await getRegionClosedSurveyStats();
        setClosedSurveyStats(data);
      } catch (error) {
      }
    };

    loadStats();
    loadRegionStats();
    loadClosedSurveyStats();
  }, []);

  const areaChartOptions: any = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    colors: ['#64748b'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
    xaxis: { categories: ['20 фев', '21 фев', '22 фев', '23 фев', '24 фев', '25 фев', '26 фев'] },
  };

  const areaChartSeries = [{ name: 'Голосов', data: [31000, 44000, 28000, 18000, 22000, 35000, 32000] }];

  const donutOptions: any = {
    labels: ['Женщины', 'Мужчины'],
    colors: ['#0f172a', '#eab308'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '70%' } } }
  };

  return (
    <div className="min-h-screen bg-white">
        <div className='bg-slate-100'>
        <div className='text-black max-w-7xl px-8 mx-auto py-7 flex flex-col'>
            <span className='text-4xl font-bold'>Аналитика</span>
            <span className='text-gray-600'>Публичная статистика голосований Республики Казахстан</span>
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
  {/* Карта - занимает 3 части из 5 (60%) */}
  <div className="col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-bold text-[#001D3D]">Карта Казахстана</h3>
      <p className="text-sm text-gray-400 font-medium">Активность по регионам</p>
    </div>
    <div className="min-h-[400px]">
      <KazakhstanInteractiveMap stats={regionStats} />
    </div>
  </div>

  {/* Список активности - занимает 2 части из 5 (40%) */}
  <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
    <div className="mb-6">
      <h3 className="text-xl font-bold text-[#001D3D]">Завершённые опросы</h3>
      <p className="text-sm text-gray-400">Статистика по регионам</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4">Завершённые опросы по регионам</h3>
            <div className="space-y-4">
              {regionStats.slice(0, 4).map((region) => (
                <div key={region.id} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{region.name}</span>
                    <span>{region.activity}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-900 h-full" style={{ width: `${region.activity}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Секция: Демография и Тематики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold mb-4">Возрастные группы</h3>
            <div className="space-y-3">
               {[
                 { label: '18-24', val: 35 },
                 { label: '25-34', val: 65 },
                 { label: '35-44', val: 50 },
                 { label: '45-54', val: 40 },
                 { label: '55+', val: 25 },
               ].map((item) => (
                 <div key={item.label} className="flex items-center gap-2">
                   <span className="text-xs w-10 text-slate-400">{item.label}</span>
                   <div className="flex-1 h-6 bg-gradient-to-r from-blue-900 to-blue-600 rounded" style={{ width: `${item.val}%` }}></div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold mb-4 text-center">Пол участников</h3>
            <Chart options={donutOptions} series={[54, 46]} type="donut" width="100%" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-sm">
            <h3 className="font-bold mb-4">По тематике</h3>
            <div className="space-y-2">
              {[
                { name: 'Транспорт', val: 78 },
                { name: 'Медицина', val: 65 },
                { name: 'Бизнес', val: 52 },
                { name: 'Экология', val: 48 },
                { name: 'Образование', val: 85 },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="h-4 bg-yellow-500 rounded" style={{width: `${item.val}%`}}></div>
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Динамика участия */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold mb-2">Динамика участия</h3>
          <p className="text-xs text-slate-400 mb-6">Ежедневная активность голосований за последние 7 дней</p>
          <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={250} />
        </div>

        {/* Хронология и Изменения */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold">Хронология решений</h3>
            {[
              { status: 'Реализовано', color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={16}/> },
              { status: 'В процессе', color: 'text-orange-600 bg-orange-50', icon: <Clock size={16}/> },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-white border rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-medium">До 15 марта 2026</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${item.color}`}>
                    {item.icon} {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-lg">Удовлетворённость системой образования</h4>
                <p className="text-sm text-slate-500">Выделено дополнительное финансирование на повышение квалификации учителей — 45 млрд тенге</p>
                <div className="flex gap-6 pt-2 border-t text-sm">
                  <span className="font-bold">384 920 <span className="font-normal text-slate-400">голосов</span></span>
                  <span className="font-bold">Поддержка: <span className="text-slate-600">78%</span></span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Принятые изменения</h3>
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <CheckCircle2 className="text-emerald-500" />
              <p className="text-xs text-slate-400 uppercase font-bold">Какие действия предприняты:</p>
              <h4 className="font-bold text-lg">Улучшение качества образования</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Повышение зарплат педагогов на 25%, программа переподготовки, новые учебники
              </p>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase">Реализовано</span>
                <a href="#" className="text-blue-600 text-sm flex items-center gap-1 font-medium">
                  Подробнее <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
