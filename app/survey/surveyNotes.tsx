import Link from 'next/link';
import { SurveyEntity } from '@/app/lib/api/survey/surveys';
import Image from 'next/image';
interface Props {
  otherSurveys: SurveyEntity[];
}

export default function SurveyNotes({ otherSurveys }: Props) {
  return (
    <div className="flex flex-col gap-0   overflow-hidden text-sm">

      <div className="flex gap-3">
        <div className="flex-1 p-5 bg-white border border-slate-200 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-3">О методологии опроса</h4>
          <ul className="space-y-1.5 text-slate-600">
            {[
              'Анонимное голосование — личность не раскрывается',
              'Каждый гражданин может проголосовать только один раз',
              'Результаты верифицируются через систему eGov',
              'Данные используются при формировании госпрограммы',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Image src='/nps.double-check.png' width={17} height={17} alt='double check image'/>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 p-5 bg-white border border-slate-200 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-3">Другие завершённые опросы</h4>
          {otherSurveys.length > 0 ? (
            <div className="space-y-3">
              {otherSurveys.slice(0, 2).map((s) => (
                <Link
                  key={s.id}
                  href={`/surveys/${s.id}`}
                  className="flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 group-hover:text-blue-900 transition-colors truncate">
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {s.vote.length.toLocaleString('ru-RU')} участников
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="block text-slate-300 text-base mt-0.5">›</span>
                  </div>
                </Link>
              ))}

              <Link
                href="/surveys"
                className="inline-block mt-4 text-xs font-semibold text-blue-900 hover:underline"
              >
                Все открытые результаты →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">
                Пока нету доступных опросов
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}