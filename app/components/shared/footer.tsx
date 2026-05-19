"use client";

import Image from 'next/image';
import { Phone, Mail, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '../../lib/locales/useTranslations';

const Footer = () => {
  const { t, lang } = useTranslations();

  const getLocalizedPath = (path: string) => {
    return `/${lang}${path}`;
  };

  return (
    <footer className="bg-[#001529] text-white pt-12 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10 pb-12">

        <div className="md:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/nps.logo.png"
                alt="Gerb"
                className="w-full h-full object-cover"
                width={22} height={22}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">nps.gov</h3>
              <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tight">{t('footer.nationalSurveySystem')}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            {t('footer.description')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-yellow-500" />
            {t('footer.securityStandard')}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold mb-6 text-white">{t('footer.navigation')}</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link href={`/${lang}`} className="hover:text-white transition-colors">{t('header.main')}</Link></li>
            <li><Link href={getLocalizedPath('/surveys')} className="hover:text-white transition-colors">{t('footer.activeSurveys')}</Link></li>
            <li><Link href={getLocalizedPath('/analytics')} className="hover:text-white transition-colors">{t('header.analytics')}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold mb-6 text-white">{t('footer.contacts')}</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">87785765648</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">info@nps.gov</span>
            </li>
            <li className="flex items-center gap-3">
              <Globe className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">support@nps.gov</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex md:row justify-between items-start md:items-center gap-4 text-xs text-slate-500">
        <div className="flex-col leading-relaxed gap-2">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.allRightsReserved')}</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.termsOfUse')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;