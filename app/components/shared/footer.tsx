
const Footer = () => {
  return (
    <footer className="bg-[#001529] text-white pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">🇰🇿</div>
            <span className="font-bold text-xl tracking-tight">nps.gov</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Официальная платформа Республики Казахстан для сбора общественного мнения граждан.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Сертифицировано НКЦ РК
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-200">Навигация</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Главная</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Активные опросы</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Аналитика</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Архив опросов</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-200">Контакты</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-600">Единый контакт-центр</span>
              <span className="text-white font-semibold">1414</span>
            </li>
            <li className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-600">Email техподдержки</span>
              <span className="text-white">info@nps.gov.kz</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-200">Помощь</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-yellow-500">Техническая поддержка</a></li>
            <li><a href="#" className="hover:text-yellow-500">Политика конфиденциальности</a></li>
            <li><a href="#" className="hover:text-yellow-500">Условия использования</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 nps.gov — Национальная система опросов РК. Все права защищены.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Политика конфиденциальности</a>
          <a href="#" className="hover:text-white">Условия использования</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;