import React from 'react';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

interface SurveyProps {
  title?: string;
  status?: 'active' | 'closed';
}

const ActiveSurveys = ({ title = "Активные опросы", status = 'active' }: SurveyProps) => {
  const surveys = [1, 2, 3];

  return (
    <section className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-2">Примите участие и выразите своё мнение</p>
        </div>
        <button className="text-blue-600 font-semibold flex items-center gap-2 hover:underline">
          Все опросы <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {surveys.map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${
                  status === 'active' 
                    ? 'bg-green-100 text-brand-success' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {status === 'active' ? 'АКТИВНЫЙ' : 'ЗАВЕРШЕН'}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin size={13} /> Вся РК
                </span>
              </div>

              <h3 className="font-bold text-[17px] text-slate-900 leading-snug mb-3">
                Развитие общественного транспорта в городах РК
              </h3>

              <p className="text-slate-500 text-sm line-clamp-2 mb-5">
                Оцените текущее состояние и предложите меры по улучшению городского транспорта в вашем...
              </p>
            </div>

            <div className="border-t border-slate-200" />

            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> До 15 мая 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> 142 850
                </span>
              </div>

              {status === 'active' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Участие</span>
                    <span>71%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-900 h-full w-[71%] rounded-full" />
                  </div>
                </div>
              )}

              <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                status === 'active' 
                  ? 'bg-[#0f172a] text-white hover:bg-blue-900' 
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}>
                {status === 'active' ? 'Проголосовать' : 'Посмотреть результаты'}
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveSurveys;