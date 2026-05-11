import { SurveyEntity, Survey } from './surveys';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SurveyCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 минут

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const maxAge = ttl || this.defaultTTL;

    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const surveyCache = new SurveyCacheService();

// Функции-обёртки с кэшированием
export async function getCachedSurveyTypes(): Promise<string[]> {
  const cacheKey = 'survey-types';
  const cached = surveyCache.get<string[]>(cacheKey);
  if (cached) return cached;

  const { getSurveyTypes } = await import('./surveys');
  const data = await getSurveyTypes();
  surveyCache.set(cacheKey, data, 10 * 60 * 1000); // 10 минут
  return data;
}

export async function getCachedAllSurveyEntities(): Promise<SurveyEntity[]> {
  const cacheKey = 'all-surveys';
  const cached = surveyCache.get<SurveyEntity[]>(cacheKey);
  if (cached) return cached;

  const { getAllSurveyEntities } = await import('./surveys');
  const data = await getAllSurveyEntities();
  surveyCache.set(cacheKey, data);
  return data;
}

export async function getCachedSurveysByType(type: string): Promise<SurveyEntity[]> {
  const cacheKey = `surveys-type-${type}`;
  const cached = surveyCache.get<SurveyEntity[]>(cacheKey);
  if (cached) return cached;

  const { getSurveysByType } = await import('./surveys');
  const data = await getSurveysByType(type);
  surveyCache.set(cacheKey, data);
  return data;
}

export async function getCachedActiveSurveys(): Promise<Survey[]> {
  const cacheKey = 'active-surveys';
  const cached = surveyCache.get<Survey[]>(cacheKey);
  if (cached) return cached;

  const { getActiveSurveys } = await import('./surveys');
  const data = await getActiveSurveys();
  surveyCache.set(cacheKey, data, 2 * 60 * 1000); // 2 минуты
  return data;
}

export async function getCachedClosedSurveys(): Promise<Survey[]> {
  const cacheKey = 'closed-surveys';
  const cached = surveyCache.get<Survey[]>(cacheKey);
  if (cached) return cached;

  const { getClosedSurveys } = await import('./surveys');
  const data = await getClosedSurveys();
  surveyCache.set(cacheKey, data, 5 * 60 * 1000); // 5 минут
  return data;
}

export async function getCachedSurveyStats(): Promise<{ totalVotes: number; participationRate: number; activeSurveys: number; regionsCount: number } | null> {
  const cacheKey = 'survey-stats';
  const cached = surveyCache.get<{ totalVotes: number; participationRate: number; activeSurveys: number; regionsCount: number }>(cacheKey);
  if (cached) return cached;

  const { getSurveyStats } = await import('./surveys');
  const data = await getSurveyStats();
  if (data) {
    surveyCache.set(cacheKey, data, 2 * 60 * 1000); // 2 минуты
  }
  return data;
}

export function invalidateStats() {
  surveyCache.invalidate('survey-stats');
  surveyCache.invalidate('active-surveys');
  surveyCache.invalidate('all-surveys');
}
