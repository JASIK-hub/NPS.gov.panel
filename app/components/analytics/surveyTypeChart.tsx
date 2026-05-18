import { fetchSurveyTypeStats, SurveyTypeStat } from '@/app/lib/api/analytics/analytics.api';
import React, { useEffect, useState } from 'react';
import { useTranslations } from '@/app/lib/locales/useTranslations';

export const TopicChart = () => {
  const { t, lang } = useTranslations();
  const [stats, setStats] = useState<SurveyTypeStat[]>([]);

  useEffect(() => {
     const fetchData = async () => {
       try {
         const data = await fetchSurveyTypeStats(lang);
         setStats(data);
       } catch (error) {
       } finally {
       }
     };
     fetchData();
   }, [lang]);

  const maxVal = Math.max(...stats.map(s => s.count), 1);

  return (
   <div className="bg-white p-8 rounded-xl border border-gray-200 w-full h-full">
  <h3 className="font-bold mb-6 text-black text-lg">{t('analytics.topicChart')}</h3>
  
  <div className="relative">
    <div className="absolute inset-0 flex justify-between pointer-events-none" style={{ marginLeft: '8rem' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-full w-px bg-gray-100 first:bg-transparent" />
      ))}
    </div>

    <div className="relative space-y-4">
      {stats.map((type, index) => {
        const barWidth = maxVal > 0 ? (type.count / maxVal) * 100 : 0;
        return (
          <div key={`type-${index}`} className="flex items-center gap-4">
            <span className="text-xs w-32 text-black font-medium truncate" title={type.type}>
              {type.type}
            </span>

            <div className="flex-1 h-10 relative">
              <div
                className="h-full bg-[#EAB308] rounded-md transition-all duration-500 relative z-10"
                style={{ width: `${Math.max(barWidth, 1)}%` }}
              />
            </div>

          </div>
        );
      })}
    </div>
  </div>
</div>
  );
};