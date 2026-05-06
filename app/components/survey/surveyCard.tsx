import Link from "next/link";
import Image from "next/image";
import { SurveyEntity } from "@/app/lib/api/survey/surveys";

interface SurveyCardProps {
  survey: SurveyEntity;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  }).replace(/\//g, '.');
};

const getDateRange = (survey: SurveyEntity) => {
  return `${formatDate(survey.startDate)}-${formatDate(survey.validUntil)}.${new Date(survey.validUntil).getFullYear()}`;
};

export default function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <Link
      href={`/survey/${survey.id}`}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-900 transition-all group ${
        !survey.isActive ? 'opacity-75 hover:opacity-100' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${
          survey.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {survey.isActive ? 'АКТИВНЫЙ' : 'ЗАВЕРШЕН'}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors line-clamp-2">
        {survey.title}
      </h3>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {survey.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{survey.organization?.name || 'Государственный орган'}</span>
          <span className="font-medium">{survey.votedCount.toLocaleString()} голосов</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Image src='/nps.clock.png' width={12} height={12} alt="clock icon"/>
          <span>{getDateRange(survey)}</span>
        </div>
      </div>
    </Link>
  );
}
