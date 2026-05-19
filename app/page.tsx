"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LANGUAGE_KEY = 'nps_language';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem(LANGUAGE_KEY);
    const browserLang = navigator.language.startsWith('kz') ? 'kz' : 'ru';
    const lang = savedLang || browserLang;

    localStorage.setItem(LANGUAGE_KEY, lang);
    document.cookie = `${LANGUAGE_KEY}=${lang}; path=/; max-age=31536000`;

    router.replace(`/${lang}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="animate-pulse text-slate-600">Загрузка...</div>
    </div>
  );
}
