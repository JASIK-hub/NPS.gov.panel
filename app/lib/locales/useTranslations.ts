"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LANGUAGE_KEY = "nps_language";

import ruTranslations from "./ru.json";
import kzTranslations from "./kz.json";

type Translations = typeof ruTranslations;
type TranslationKey = keyof Translations;
type NestedKey<T, K extends string = never> = K extends keyof T
  ? T[K] extends object
    ? `${K}.${NestedKey<T[K]>}`
    : K
  : never;
type TranslationPath = NestedKey<Translations> | string;

const getTranslations = (lang: "ru" | "kz") => {
  return lang === "kz" ? kzTranslations : ruTranslations;
};

export function useTranslations() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"ru" | "kz">("ru");

  useEffect(() => {
    const pathLang = pathname.split("/")[1] as "ru" | "kz";
    if (pathLang === "ru" || pathLang === "kz") {
      setLang(pathLang);
    } else {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as "ru" | "kz" | null;
      setLang(savedLang || "ru");
    }
  }, [pathname]);

  const t = (
    path: string,
    params?: Record<string, string | number>
  ): string => {
    const translations = getTranslations(lang);
    const keys = path.split(".");
    let result: any = translations;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        console.warn(`Translation not found: ${path}`);
        return path;
      }
    }

    if (typeof result !== "string") {
      console.warn(`Translation is not a string: ${path}`);
      return path;
    }

    if (params) {
      return result.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key]?.toString() || match;
      });
    }

    return result;
  };

  return { t, lang };
}

export function getServerTranslations(lang: "ru" | "kz" = "ru") {
  const translations = getTranslations(lang);

  const t = (path: string): string => {
    const keys = path.split(".");
    let result: any = translations;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        return path;
      }
    }

    return typeof result === "string" ? result : path;
  };

  return { t, lang };
}
