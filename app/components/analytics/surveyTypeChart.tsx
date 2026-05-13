import { fetchAndMapStats, SurveyTypeStat } from '@/app/lib/api/analytics/analytics.api';
import React, { useEffect, useState } from 'react';

export const TopicChart = () => {
  const [stats, setStats] = useState<SurveyTypeStat[]>([]);

  useEffect(() => {
     const fetchData = async () => {
       try {
         const data:SurveyTypeStat[] = await fetchAndMapStats('survey/type/statistic','type');
         setStats(data);
       } catch (error) {
       } finally {
       }
     };
     fetchData();
   }, []);

  const maxVal = Math.max(...stats.map(s => s.count), 1);

  return (
   <div className="bg-white p-8 rounded-xl border border-gray-200 w-full h-full">
  <h3 className="font-bold mb-6 text-black text-lg">По тематике</h3>
  
  <div className="relative">
    <div className="absolute inset-0 flex justify-between pointer-events-none" style={{ marginLeft: '8rem' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-full w-px bg-gray-100 first:bg-transparent" />
      ))}
    </div>

    <div className="relative space-y-4">
      {stats.map((type) => {
        const barWidth = maxVal > 0 ? (type.count / maxVal) * 100 : 0;

        return (
          <div key={type.groupName} className="flex items-center gap-4">
            <span className="text-xs w-32 text-slate-500 font-medium truncate" title={type.groupName}>
              {type.groupName}
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