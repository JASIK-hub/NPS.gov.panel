import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Survey } from '../../lib/api/survey/surveys';
import Link from 'next/link';
import SurveyCardHome from '../survey/surveyCardHome';

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
        <Link href="/surveys" className="text-blue-600 font-semibold flex items-center gap-2 hover:underline">
          Все опросы <ArrowRight size={18} />
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Нет доступных опросов</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <SurveyCardHome key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveSurveys;