import { FileText, BarChart3, Layers, Globe, ArrowRight } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { label: "Всего голосов", value: "4,218,650", icon: <FileText className="text-blue-600" /> },
    { label: "Уровень участия", value: "67.4%", icon: <BarChart3 className="text-blue-600" /> },
    { label: "Активных опросов", value: "12", icon: <Layers className="text-blue-600" /> },
    { label: "Регионов участвует", value: "17", icon: <Globe className="text-blue-600" /> },
  ];

  return (
    <section className="py-1 rounded-3xl px-8">
      <h2 className="text-2xl text-black font-bold text-center mb-10">Общая статистика</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{item.value}</div>
            <div className="text-slate-500 text-sm">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button className="bg-blue-950 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900">
          Перейти в аналитику <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default StatsSection;