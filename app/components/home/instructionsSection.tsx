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
            <div key={step.id} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 transition-transform group-hover:scale-110 duration-300 shadow-lg">
                {step.id}
              </div>
              {step.id < 3 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-slate-200 -z-10" />
              )}

              <h3 className="text-xl font-bold mb-3 text-slate-800">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructionsSection;