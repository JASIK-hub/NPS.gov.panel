"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './container';
import Image from 'next/image';
import { getAuthToken, removeAuthToken, removeRefreshToken, isAuthenticated as checkIsAuthenticated, isAdmin } from '../../lib/api/auth';
import { useTranslations } from '../../lib/locales/useTranslations';

const LANGUAGE_KEY = 'nps_language';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [currentLang, setCurrentLang] = useState<'ru' | 'kz'>('ru');
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslations();

  useEffect(() => {
    setIsAuthenticated(checkIsAuthenticated());
    setUserIsAdmin(isAdmin());

    const pathLang = pathname.split('/')[1] as 'ru' | 'kz';
    if (pathLang === 'ru' || pathLang === 'kz') {
      setCurrentLang(pathLang);
    } else {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as 'ru' | 'kz' | null;
      setCurrentLang(savedLang || 'ru');
    }
  }, [pathname]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'refresh_token' || e.key === null) {
        setIsAuthenticated(checkIsAuthenticated());
        setUserIsAdmin(isAdmin());
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

  const handleLanguageChange = (lang: 'ru' | 'kz') => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.cookie = `${LANGUAGE_KEY}=${lang}; path=/; max-age=31536000`;
    setCurrentLang(lang);

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'ru' || segments[0] === 'kz') {
      segments[0] = lang;
      router.push('/' + segments.join('/'));
    } else {
      router.push('/' + lang);
    }
    setIsMenuOpen(false);
  };

  const getLocalizedPath = (path: string) => {
    return `/${currentLang}${path}`;
  };

  const isAuthPage = pathname.includes('/auth/login');
  const isRegisterPage = pathname.includes('/register');
  const isForgotPasswordPage = pathname.includes('/auth/forgot-password');
  const isVerifyCodePage = pathname.includes('/auth/verify-code');

  return (
    <header className="w-full flex flex-col z-50 justify-between">

      <div className="bg-[#051124] border-white/5">
        <Container className="flex justify-between items-center py-2 text-[11px] font-medium text-white/50">
          <div className="uppercase tracking-wider">
            {t('header.officialPortal')}
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-80">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>{t('header.secureConnection')}</span>
          </div>
        </Container>
      </div>

      <div className="bg-[#051124] text-white">
        <Container className="flex justify-between items-center py-4">

          <Link href={`/${currentLang}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
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
                {t('header.nationalSurveySystem')}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href={`/${currentLang}`} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${pathname === `/${currentLang}` ? 'bg-white text-[#0a1b33] font-bold shadow-md' : 'text-white hover:bg-white/5'}`}>
              {t('header.main')}
            </Link>
            <Link href={getLocalizedPath('/surveys')} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${pathname.includes('/surveys') ? 'bg-white text-[#0a1b33] font-bold shadow-md' : 'text-white hover:bg-white/5'}`}>
              {t('header.surveys')}
            </Link>
            <Link href={getLocalizedPath('/analytics')} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${pathname.includes('/analytics') ? 'bg-white text-[#0a1b33] font-bold shadow-md' : 'text-white hover:bg-white/5'}`}>
              {t('header.analytics')}
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center bg-[#051124] rounded-lg p-1 border border-white/10">
              <button
                onClick={() => handleLanguageChange('ru')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md shadow-sm transition-all ${
                  currentLang === 'ru' ? 'bg-white text-[#0a1b33]' : 'text-white/50 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => handleLanguageChange('kz')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md shadow-sm transition-all ${
                  currentLang === 'kz' ? 'bg-white text-[#0a1b33]' : 'text-white/50 hover:text-white'
                }`}
              >
                KZ
              </button>
            </div>
            {!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && !isAuthenticated && (
              <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`} className="bg-[#f9bc06] hover:bg-[#e5ac05] text-[#0a1b33] px-5 py-2.5 rounded-lg text-sm transition-all font-bold">
                {t('header.login')}
              </Link>
            )}
            {isAuthenticated && !isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && (
              <>
                <Link href={userIsAdmin ? getLocalizedPath('/admin') : getLocalizedPath('/profile')} className="w-10 h-10 bg-[#f9bc06] rounded-full flex items-center justify-center hover:opacity-80 transition-all">
                  <User size={20} className="text-[#0a1b33]" />
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-white/80 hover:text-white rounded-lg text-sm transition-all">
                  {t('header.logout')}
                </button>
              </>
            )}
            {(isAuthPage || isRegisterPage || isForgotPasswordPage || isVerifyCodePage) && (
              <Link href={`/${currentLang}`} className="px-5 py-2.5 border border-white/20 text-white hover:bg-white/5 rounded-lg text-sm transition-all">
                {t('header.toMain')}
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
              <Link href={`/${currentLang}`} onClick={() => setIsMenuOpen(false)} className={`text-left text-lg ${pathname === `/${currentLang}` ? 'font-bold text-yellow-500' : 'text-white/80'}`}>{t('header.main')}</Link>
              <Link href={getLocalizedPath('/surveys')} onClick={() => setIsMenuOpen(false)} className={`text-left text-lg ${pathname.includes('/surveys') ? 'font-bold text-yellow-500' : 'text-white/80'}`}>{t('header.surveys')}</Link>
              <Link href={getLocalizedPath('/analytics')} onClick={() => setIsMenuOpen(false)} className={`text-left text-lg ${pathname.includes('/analytics') ? 'font-bold text-yellow-500' : 'text-white/80'}`}>{t('header.analytics')}</Link>
            </nav>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('ru')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    currentLang === 'ru' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => handleLanguageChange('kz')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    currentLang === 'kz' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  KZ
                </button>
              </div>
              {!isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && !isAuthenticated && (
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`} className="w-full bg-[#f9bc06] text-[#0a1b33] font-bold py-4 rounded-xl">
                  {t('header.login')}
                </Link>
              )}
              {isAuthenticated && !isAuthPage && !isRegisterPage && !isForgotPasswordPage && !isVerifyCodePage && (
                <>
                  <Link href={userIsAdmin ? getLocalizedPath('/admin') : getLocalizedPath('/profile')} className="flex items-center gap-3 py-3">
                    <div className="w-12 h-12 bg-[#f9bc06] rounded-full flex items-center justify-center">
                      <User size={24} className="text-[#0a1b33]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{userIsAdmin ? t('header.admin') : t('header.profile')}</span>
                      <span className="text-white/60 text-sm">{userIsAdmin ? t('header.adminPanel') : t('header.profileLink')}</span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    {t('header.logout')}
                  </button>
                </>
              )}
              {(isAuthPage || isRegisterPage || isForgotPasswordPage || isVerifyCodePage) && (
                <Link href={`/${currentLang}`} className="w-full border border-white/20 text-white font-bold py-3 rounded-xl">
                  {t('header.toMain')}
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
