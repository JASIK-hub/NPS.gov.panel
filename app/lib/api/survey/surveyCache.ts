import { SurveyEntity, Survey } from './surveys';
import { apiCache, createCacheKey } from '../cache.util';

const DEFAULT_TTL = 5 * 60 * 1000;

export async function getCachedSurveyTypes(): Promise<string[]> {
  const { getSurveyTypes } = await import('./surveys');
  return getSurveyTypes();
}

export async function getCachedAllSurveyEntities(): Promise<SurveyEntity[]> {
  const { getAllSurveyEntities } = await import('./surveys');
  return getAllSurveyEntities();
}

export async function getCachedSurveysByType(type: string): Promise<SurveyEntity[]> {
  const { getSurveysByType } = await import('./surveys');
  return getSurveysByType(type);
}

export async function getCachedActiveSurveys(): Promise<Survey[]> {
  const { getActiveSurveys } = await import('./surveys');
  return getActiveSurveys();
}

export async function getCachedClosedSurveys(): Promise<Survey[]> {
  const { getClosedSurveys } = await import('./surveys');
  return getClosedSurveys();
}

export async function getCachedSurveyStats(): Promise<SurveyStats | null> {
  const { getSurveyStats } = await import('./surveys');
  return getSurveyStats();
}

export interface SurveyStats {
  totalVotes: number;
  participationRate: number;
  activeSurveys: number;
  regionsCount: number;
}

export function invalidateStats(): void {
  apiCache.invalidate('survey:stats');
  apiCache.invalidate('survey:active');
  apiCache.invalidate('survey:all');
}

export { clearSurveyCache } from './surveys';
