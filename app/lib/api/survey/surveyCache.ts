import { SurveyEntity, Survey, getAllSurveyEntities, getSurveysByType, getActiveSurveys, getClosedSurveys, getSurveyStats, getSurveyTypes } from './surveys';
import { apiCache, createCacheKey } from '../cache.util';

export interface SurveyType {
  id: number;
  name: string;
  nameKz: string;
  nameRu:string
}

export async function getCachedSurveyTypes(lang?: string): Promise<SurveyType[]> {
  return getSurveyTypes(lang);
}


export async function getCachedAllSurveyEntities(): Promise<SurveyEntity[]> {
  return getAllSurveyEntities();
}

export async function getCachedSurveysByType(type: string): Promise<SurveyEntity[]> {
  return getSurveysByType(type);
}

export async function getCachedActiveSurveys(lang?: string): Promise<Survey[]> {
  return getActiveSurveys(undefined, lang);
}

export async function getCachedClosedSurveys(lang?: string): Promise<Survey[]> {
  return getClosedSurveys(undefined, lang);
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
