import {  fetchAndMapStats, UserStat } from '@/app/lib/api/analytics/analytics.api';
import React, { useEffect, useState } from 'react';

export const AgeGroupChart = () => {
  const [data, setData] = useState<UserStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats:UserStat[] = await fetchAndMapStats('user/statistic/age-group','ageGroup');
        setData(stats);
      } catch (error) {
      } finally {
      }
    };
    fetchData();
  }, []);

  if (!data.length) return <div>Нет данных для отображения</div>;

  const maxVal = Math.max(...data.map(item => item.count));

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-2xl">
      <h3 className="font-bold mb-6 text-black text-lg">Возрастные группы</h3>
      
      <div className="relative">
        
        <div className="absolute inset-0 flex justify-between pointer-events-none" style={{ marginLeft: '3.5rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-full w-px bg-gray-200 first:bg-transparent" />
          ))}
        </div>

        <div className="relative space-y-4">
          {data.map((item,i) => {
            const barWidth = maxVal > 0 ? (item.count / maxVal) * 100 : 0;

            return (
              <div key={item.groupName} className="flex items-center ">
                <span className="text-xs w-12 text-slate-400 font-medium whitespace-nowrap">
                  {item.groupName}
                </span>

                <div className="flex-1 h-10 relative">
                  <div 
                    className="h-full bg-[#00132D] rounded-md transition-all duration-500 relative z-10" 
                    style={{ width: `${Math.max(barWidth, 1)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
};


