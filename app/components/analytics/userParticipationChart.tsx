import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { fetchAndMapStats, UserStat } from '@/app/lib/api/analytics/analytics.api';

export const ParticipationChart = () => {
  const [data, setData] = useState<UserStat[]>([]);

  useEffect(() => {
       const fetchData = async () => {
         try {
           const stats = await fetchAndMapStats('user/survey/participation/statistic','date');
           setData(stats);
         } catch (error) {
         } finally {
         }
       };
       fetchData();
     }, []);

  const areaChartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      background: "transparent",
      animations: {
        enabled: true,
        animateGradually: { enabled: true },
        speed: 800,
      },
    },
    markers: {
      colors: ["#eab308"],
      strokeWidth: 2,
      size: 0,
      hover: {
        size: 6,
        sizeOffset: 2,
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      formatter: (val: number) =>
        val === Math.max(...data.map((d) => d.count))
          ? val.toLocaleString("ru-RU")
          : "",
      background: { enabled: false },
      style: {
        fontSize: "12px",
        fontWeight: "600",
        colors: ["#1e293b"],
      },
      offsetY: -10,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
      colors: ["#ca8a04"],
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.02,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#edaf2d", opacity: 0.55 },
          { offset: 100, color: "#fef08a", opacity: 0.02 },
        ],
      },
    },
    xaxis: {
      categories: data.map((item) => item.groupName),
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
          fontFamily: "inherit",
        },
        rotate: 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        width: 1,
        position: "back",
        opacity: 0.7,
        stroke: {
          color: "#ca8a04",
          width: 1,
          dashArray: 4,
        },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
          fontFamily: "inherit",
        },
        formatter: (val: number) => {
          if (val >= 1000) return `${Math.round(val / 1000)}k`;
          return `${val}`;
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 10, right: 10, bottom: 0, left: 10 },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      shared: true,
      intersect: false,
      fillSeriesColor:true,
      custom: ({ series, seriesIndex, dataPointIndex }: any) => {
        const val = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background: #edaf2d;
            color: #fff;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(202,138,4,0.35);
          ">
            Голосов: ${Number(val).toLocaleString("ru-RU")}
          </div>
        `;
      },
      followCursor: true,
      style: { fontSize: "12px" },
       x: { show: false },
      y: {
        title: { formatter: () => "Голосов:" },
        formatter: (val: number) => val.toLocaleString("ru-RU"),
      },
      marker: { show: false }
    },
  };
 
  const areaChartSeries = [
    {
      name: "Голосов",
      data: data.map((item) => item.count),
    },
  ];
 
  return (
  <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-8 h-full">
    <h3 className="m-0 mb-1 font-bold text-[15px] text-slate-900 leading-[1.3]">
      Динамика участия
    </h3>
    <p className="m-0 mb-5 text-[12px] text-slate-400 leading-[1.4]">
      Ежедневная активность голосований за последние 7 дней
    </p>
    <div className="w-full">
      <Chart
        options={areaChartOptions}
        series={areaChartSeries}
        type="area"
        height={250}
      />
    </div>
  </div>
);
};