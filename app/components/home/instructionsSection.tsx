import React from 'react';

const InstructionsSection = () => {
  const steps = [
    { 
      id: 1, 
      title: "Авторизация", 
      desc: "Войдите через ЭЦП или систему eGov для верификации личности гражданина." 
    },
    { 
      id: 2, 
      title: "Участие в опросе", 
      desc: "Выберите интересующий опрос, ознакомьтесь с описанием и оставьте свой голос." 
    },
    { 
      id: 3, 
      title: "Влияние", 
      desc: "Ваш голос учитывается при принятии важных государственных решений." 
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-wide text-slate-800">
            Порядок участия
          </h2>
          <p className="text-slate-500 italic">
            Простой и прозрачный процесс выражения вашего мнения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-4 group">
          <div className="flex-shrink-0 w-10 h-10 bg-[#001529] text-white rounded-full flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-105 duration-300 shadow-md">
            {step.id}
          </div>

          <div className="flex flex-col text-left">
            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-slate-500 leading-snug max-w-[250px]">
              {step.desc}
            </p>
          </div>
        </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructionsSection;