"use client";

import React from 'react';
import { useTranslations } from '@/app/lib/locales/useTranslations';

const InstructionsSection = () => {
  const { t } = useTranslations();

  const steps = [
    {
      id: 1,
      title: t('instructions.step1.title'),
      desc: t('instructions.step1.desc')
    },
    {
      id: 2,
      title: t('instructions.step2.title'),
      desc: t('instructions.step2.desc')
    },
    {
      id: 3,
      title: t('instructions.step3.title'),
      desc: t('instructions.step3.desc')
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] mt-5 rounded-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xl font-bold mb-4 uppercase tracking-wide text-slate-800">
            {t('instructions.howItWorks')}
          </span>
          <p className="text-slate-500 italic">
            {t('instructions.subtitle')}
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