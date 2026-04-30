import React from 'react';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { Survey } from '../../lib/api/surveys';

interface SurveyProps {
  title?: string;
  status?: 'active' | 'closed';
  surveys?: Survey[];
}

const ActiveSurveys = ({ title = "Активные опросы", status = 'active', surveys = [] }: SurveyProps) => {

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

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Нет доступных опросов</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${
                    survey.status === 'active'
                      ? 'bg-green-100 text-brand-success'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {survey.status === 'active' ? 'АКТИВНЫЙ' : 'ЗАВЕРШЕН'}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <MapPin size={13} /> {survey.location}
                  </span>
                </div>

                <h3 className="font-bold text-[17px] text-slate-900 leading-snug mb-3">
                  {survey.title}
                </h3>

                <p className="text-slate-500 text-sm line-clamp-2 mb-5">
                  {survey.description}
                </p>
              </div>

              <div className="border-t border-slate-200" />

              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {survey.deadline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={13} /> {survey.participants.toLocaleString()}
                  </span>
                </div>

                {survey.status === 'active' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Участие</span>
                      <span>{survey.participationPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-900 h-full rounded-full" style={{ width: `${survey.participationPercentage}%` }} />
                    </div>
                  </div>
                )}

                <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  survey.status === 'active'
                    ? 'bg-[#0f172a] text-white hover:bg-blue-900'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}>
                  {survey.status === 'active' ? 'Проголосовать' : 'Посмотреть результаты'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveSurveys;