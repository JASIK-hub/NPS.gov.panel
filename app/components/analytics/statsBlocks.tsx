import Image from 'next/image';

interface StatsBlocksProps {
  totalVotes: number;
  participationRate: number;
  activeSurveys: number;
  regionsCount: number;
  loading?: boolean;
}

export function StatsBlocks({ totalVotes, participationRate, activeSurveys, regionsCount, loading = false }: StatsBlocksProps) {
  const statsData = [
    {
      label: "Всего голосов",
      value: loading ? "..." : totalVotes.toLocaleString('ru-RU'),
      icon: <Image src='/nps.vote.png' width={45} height={45} alt=''/>
    },
    {
      label: "Уровень участия",
      value: loading ? "..." : `${participationRate.toFixed(1)}%`,
      icon: <Image src='/nps.growth.png' width={45} height={45} alt='growth image'/>
    },
    {
      label: "Активных опросов",
      value: loading ? "..." : activeSurveys.toString(),
      icon: <Image src='/nps.analytics.png' width={45} height={45} alt='growth image'/>
    },
    {
      label: "Регионов участвует",
      value: loading ? "..." : regionsCount.toString(),
      icon: <Image src='/nps.locator.png' width={45} height={45} alt='growth image'/>
    },
  ];

  return (
    <>
      {statsData.map((item, idx) => (
        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            {item.icon}
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{item.value}</div>
          <div className="text-slate-500 text-sm">{item.label}</div>
        </div>
      ))}
    </>
  );
}
