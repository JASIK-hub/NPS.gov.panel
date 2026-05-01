import Image from 'next/image';
import { Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
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
              <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tight">Национальная система опросов</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Официальная платформа Республики Казахстан для сбора общественного мнения граждан.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-yellow-500" />
            Сертифицировано НКЦ РК
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold mb-6 text-white">Навигация</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Главная</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Активные опросы</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Аналитика</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold mb-6 text-white">Контакты</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">1414</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">info@nps.gov.kz</span>
            </li>
            <li className="flex items-center gap-3">
              <Globe className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">nps.gov.kz</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex md:row justify-between items-start md:items-center gap-4 text-xs text-slate-500">
        <div className="flex-col leading-relaxed gap-2">
          <p>© 2025 nps.gov — Национальная система опросов РК.</p>
          <p>Все права защищены.</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-white transition-colors">Условия использования</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;