"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './container';
import Image from 'next/image';
import { getAuthToken, removeAuthToken, removeRefreshToken, isAuthenticated as checkIsAuthenticated } from '../../lib/api/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/auth/login';
  const isRegisterPage = pathname === '/register';
  const isForgotPasswordPage = pathname === '/auth/forgot-password';
  const isVerifyCodePage = pathname === '/auth/verify-code';

  useEffect(() => {
    setIsAuthenticated(checkIsAuthenticated());
  }, [pathname]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'refresh_token' || e.key === null) {
        setIsAuthenticated(checkIsAuthenticated());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeRefreshToken();
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <header className="w-full flex flex-col z-50 justify-between">

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
            <div className="relative w-10 h-10">
              <Image
                src="/nps.logo.png"
                alt="Gerb"
                className="object-cover"
                fill
                priority
                sizes="40px"
                quality={90}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none tracking-tight">nps.gov</span>
              <span className="text-[9px] uppercase tracking-widest mt-1 font-medium">
                Национальная система опросов
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${(!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage) ? 'bg-white text-[#0a1b33] font-bold shadow-md' : 'text-white hover:bg-white/5'}`}>
              Главная
            </Link>
            <button className="px-6 py-2 text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all">
              Опросы
            </button>
            <button className="px-6 py-2 text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all">
              Аналитика
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center bg-[#051124] rounded-lg p-1 border border-white/10">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-[#0a1b33] rounded-md shadow-sm">RU</button>
              <button className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white transition-all">KZ</button>
            </div>
            {!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && !isAuthenticated && (
              <Link href="/auth/login" className="bg-[#f9bc06] hover:bg-[#e5ac05] text-[#0a1b33] px-5 py-2.5 rounded-lg text-sm transition-all font-bold">
                Войти
              </Link>
            )}
            {isAuthenticated && !isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && (
              <>
                <Link href="/profile" className="w-10 h-10 bg-[#f9bc06] rounded-full flex items-center justify-center hover:opacity-80 transition-all">
                  <User size={20} className="text-[#0a1b33]" />
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-white/80 hover:text-white rounded-lg text-sm transition-all">
                  Выйти
                </button>
              </>
            )}
            {(isAuthPage || isRegisterPage || isForgotPasswordPage || isVerifyCodePage) && (
              <Link href="/" className="px-5 py-2.5 border border-white/20 text-white hover:bg-white/5 rounded-lg text-sm transition-all">
                На главную
              </Link>
            )}
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
              <Link href="/" className={`text-left text-lg ${(!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage) ? 'font-bold text-yellow-500' : 'text-white/80'}`}>Главная</Link>
              <button className="text-left text-lg text-white/80">Опросы</button>
              <button className="text-left text-lg text-white/80">Аналитика</button>
            </nav>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white/10 rounded-lg font-bold text-white">RU</button>
                <button className="flex-1 py-3 bg-white/5 rounded-lg font-bold text-white/40">KZ</button>
              </div>
              {!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && !isAuthenticated && (
                <Link href="/auth/login" className="w-full bg-[#f9bc06] text-[#0a1b33] font-bold py-4 rounded-xl">
                  Войти
                </Link>
              )}
              {isAuthenticated && !isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && (
                <>
                  <Link href="/profile" className="flex items-center gap-3 py-3">
                    <div className="w-12 h-12 bg-[#f9bc06] rounded-full flex items-center justify-center">
                      <User size={24} className="text-[#0a1b33]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">Профиль</span>
                      <span className="text-white/60 text-sm">Личный кабинет</span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    Выйти
                  </button>
                </>
              )}
              {(isAuthPage || isRegisterPage || isForgotPasswordPage || isVerifyCodePage) && (
                <Link href="/" className="w-full border border-white/20 text-white font-bold py-3 rounded-xl">
                  На главную
                </Link>
              )}
            </div>
          </Container>
        </div>
      )}

    </header>
  );
};

export default Header;