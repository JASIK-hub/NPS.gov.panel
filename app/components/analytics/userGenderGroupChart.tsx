import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { fetchAndMapStats, UserStat } from '@/app/lib/api/analytics/analytics.api';
import { useTranslations } from '@/app/lib/locales/useTranslations';

export const GenderChart = () => {
  const { t } = useTranslations();
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: UserStat[] = await fetchAndMapStats('user/statistic/gender','gender');
        if (data.length > 0) {
          setSeries(data.map(item => item.count));
          setLabels(data.map(item => item.groupName === 'male' ? t('analytics.male') : t('analytics.female')));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const donutOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: labels, 
    colors: ['#00132D', '#F1B418'], 
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  if (loading) return <div className="p-6 text-center">{t('analytics.loading')}</div>;

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <h3 className="font-bold mb-9 text-black text-lg">{t('analytics.genderChart')}</h3>
      <Chart
        options={donutOptions}
        series={series}
        type="donut"
        width="100%"
      />
    </div>
  );
};