"use client"; 

import React, { useState } from 'react';
import { ShieldCheck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Container } from './container';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col z-50">

      <div className="bg-[#051124] border-white/5">
        <Container className="flex justify-between items-center py-2 text-[11px] font-medium text-white/50">
          <div className="uppercase tracking-wider">
            Официальный портал Республики Казахстан
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-80">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Защищённое соединение</span>
          </div>
        </Container>
      </div>

      <div className="bg-[#051124] text-white">
        <Container className="flex justify-between items-center py-4">

          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-[#f9bc06] rounded-full flex items-center justify-center text-xl shadow-lg">
              <span className="mb-1">🇰🇿</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none tracking-tight">nps.gov</span>
              <span className="text-[9px] uppercase tracking-widest mt-1 font-medium">
                Национальная система опросов
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <button className="px-6 py-2 bg-white text-[#0a1b33] rounded-md font-bold text-sm transition-all shadow-md">
              Главная
            </button>
            <button className="px-6 py-2 text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all">
              Опросы
            </button>
            <button className="px-6 py-2 text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all">
              Аналитика
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center bg-[#051124] rounded-lg p-1 border border-white/10">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-[#0a1b33] rounded-md shadow-sm">RU</button>
              <button className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white transition-all">KZ</button>
            </div>
            <button className="bg-[#f9bc06] hover:bg-[#e5ac05] px-7 py-2.5 rounded-lg text-sm transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(249,188,6,0.2)]">
              Войти
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </Container>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-[#0a1b33] border-t border-white/10">
          <Container className="py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              <button className="text-left text-lg font-bold text-yellow-500">Главная</button>
              <button className="text-left text-lg text-white/80">Опросы</button>
              <button className="text-left text-lg text-white/80">Аналитика</button>
            </nav>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white/10 rounded-lg font-bold text-white">RU</button>
                <button className="flex-1 py-3 bg-white/5 rounded-lg font-bold text-white/40">KZ</button>
              </div>
              <button className="w-full bg-[#f9bc06] text-[#0a1b33] font-bold py-4 rounded-xl">
                Войти в личный кабинет
              </button>
            </div>
          </Container>
        </div>
      )}

    </header>
  );
};

export default Header;