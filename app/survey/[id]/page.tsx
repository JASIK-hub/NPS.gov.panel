import { getSurvey} from "@/app/lib/api/survey/surveys";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SurveyVotingForm from './surveyVotingForm';
import { Container } from '@/app/components/shared/container';
import Image from 'next/image'
export default async function SurveyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const survey = await getSurvey(id);

    if (!survey) {
      notFound();
    }

    const deadline = new Date(survey.validUntil).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
         <Container className="py-6">
          <Link
            href="/"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-slate-100 bg-[#F8FAFC] p-3 rounded-2xl">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Организатор</p>
                <p className="font-bold text-slate-800 text-sm">{survey.organization?.name || 'Государственный орган'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Срок окончания</p>
                <p className="font-bold text-slate-800 text-sm">
                  До {deadline}
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
          </div>
          <SurveyVotingForm survey={survey} />
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
