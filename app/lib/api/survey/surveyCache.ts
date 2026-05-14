import { SurveyEntity, Survey, getAllSurveyEntities, getSurveysByType, getActiveSurveys, getClosedSurveys, getSurveyStats, getSurveyTypes } from './surveys';
import { apiCache, createCacheKey } from '../cache.util';


export async function getCachedSurveyTypes(): Promise<string[]> {
  return getSurveyTypes();
}

export async function getCachedAllSurveyEntities(): Promise<SurveyEntity[]> {
  return getAllSurveyEntities();
}

export async function getCachedSurveysByType(type: string): Promise<SurveyEntity[]> {
  return getSurveysByType(type);
}

export async function getCachedActiveSurveys(): Promise<Survey[]> {
  return getActiveSurveys();
}

export async function getCachedClosedSurveys(): Promise<Survey[]> {
  return getClosedSurveys();
}

export async function getCachedSurveyStats(): Promise<SurveyStats | null> {
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

export function invalidateActiveSurveys(): void {
  apiCache.invalidate('survey:active');
}

export function invalidateClosedSurveys(): void {
  apiCache.invalidate('survey:closed');
}

export { clearSurveyCache } from './surveys';
