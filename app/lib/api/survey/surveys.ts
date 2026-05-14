import { fetchWithAuth } from '../auth';
import { apiCache, createCacheKey, cachedFetch, CacheOptions } from '../cache.util';

export interface Survey {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  location: string;
  deadline: string;
  participants: number;
  participationRate?: number;
  organizationName: string;
  type?: string;
}

export interface SurveyOption {
  id: number;
  text: string;
  voteCount?: number;
}

export enum RegionCodes {
  AST = 'AST',
  ALM = 'ALM',
  SHM = 'SHM',
  AKT = 'AKT',
  KAR = 'KAR',
}

interface Region {
  id: number
  name: string;
  code: RegionCodes;
}

export interface SurveyEntity {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  subTitle: string;
  organization: OrganizationEntity;
  vote: VoteEntity[];
  options: OptionEntity[];
  type: string;
  region: Region;
  votedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
  participationRate?: number
}

export interface VoteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface OrganizationEntity {
  id: number;
  createdAt: Date;
  name: string;
}

export interface OptionEntity {
  id: number;
  title: string;
}

export interface VoteEntity {
  id: number;
  user: UserEntity
  option: OptionEntity
}

export interface UserEntity {
  id: number;
  email: string;
  name?: string;
}

const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;

function mapSurveyEntity(entity: SurveyEntity): Survey {
  return {
    id: String(entity.id),
    title: entity.title,
    description: entity.description,
    isActive: entity.isActive,
    location: entity.region?.name || 'Вся РК',
    deadline: new Date(entity.validUntil).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    organizationName: entity.organization.name,
    participants: entity.votedCount,
    participationRate: entity.participationRate,
    type: entity.type
  };
}

export async function getActiveSurveys(options?: CacheOptions): Promise<Survey[]> {
  const cacheKey = createCacheKey(['survey', 'active']);
  const ttl = 2 * 60 * 1000;

  return cachedFetch<Survey[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey?isActive=true`, {
        next: { revalidate: 60 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      console.log('Active surveys from API:', data.map(d => ({ id: d.id, title: d.title, type: d.type })));
      return data.map(entity => ({
        ...mapSurveyEntity(entity),
        participationRate: entity.participationRate
      }));
    },
    { ...options, ttl }
  );
}

export async function getClosedSurveys(options?: CacheOptions): Promise<Survey[]> {
  const cacheKey = createCacheKey(['survey', 'closed']);
  const ttl = 10 * 60 * 1000;

  return cachedFetch<Survey[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey?isActive=false`, {
        next: { revalidate: 600 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      return data.map(entity => ({
        ...mapSurveyEntity(entity),
        participationRate: entity.participationRate
      }));
    },
    { ...options, ttl }
  );
}

export async function getAllSurveys(options?: CacheOptions): Promise<Survey[]> {
  const cacheKey = createCacheKey(['survey', 'all']);
  const ttl = 5 * 60 * 1000;

  return cachedFetch<Survey[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      return data.map(mapSurveyEntity);
    },
    { ...options, ttl }
  );
}

export async function getSurvey(id: string): Promise<SurveyEntity | null> {
  try {
    const response = await fetch(`${NPS_API_URL}/survey/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) return null;
    const data: SurveyEntity = await response.json();
    return data
  } catch (error) {
    return null;
  }
}

export async function voteSurvey(surveyId: string, optionId: number, comment?: string): Promise<VoteResponse> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/survey/${surveyId}/vote?optionId=${optionId}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Ошибка при голосовании'
      };
    }

    apiCache.invalidate(`survey:${surveyId}`);
    apiCache.invalidate('survey');

    return {
      success: true,
      message: 'Голос принят'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function checkUserParticipation(surveyId: string): Promise<boolean> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/survey/${surveyId}/user`, {
      cache: 'no-store'
    });

    if (!response.ok) return false;

    const hasVoted: boolean = await response.json();
    return hasVoted;
  } catch (error) {
    return false;
  }
}

export async function getAllSurveyEntities(options?: CacheOptions): Promise<SurveyEntity[]> {
  const cacheKey = createCacheKey(['survey', 'all', 'entities']);
  const ttl = 5 * 60 * 1000;

  return cachedFetch<SurveyEntity[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      console.log(data)
      return data;
    },
    { ...options, ttl }
  );
}

export async function getSurveyTypes(options?: CacheOptions): Promise<string[]> {
  const cacheKey = createCacheKey(['survey', 'types']);
  const ttl = 10 * 60 * 1000;

  return cachedFetch<string[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey/type`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data: string[] = await response.json();
      return data;
    },
    { ...options, ttl }
  );
}

export async function getSurveysByType(type: string, options?: CacheOptions): Promise<SurveyEntity[]> {
  const cacheKey = createCacheKey(['survey', 'type', type]);
  const ttl = 5 * 60 * 1000;

  return cachedFetch<SurveyEntity[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey?type=${type}`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      return data;
    },
    { ...options, ttl }
  );
}

export async function searchSurveys(query: string, options?: CacheOptions): Promise<Survey[]> {
  const cacheKey = createCacheKey(['survey', 'search', query]);
  const ttl = 60 * 1000;

  return cachedFetch<Survey[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey?search=${encodeURIComponent(query)}`, {
        next: { revalidate: 60 }
      });

      if (!response.ok) return [];

      const data: SurveyEntity[] = await response.json();
      return data.map(mapSurveyEntity);
    },
    { ...options, ttl }
  );
}

export interface SurveyStats {
  totalVotes: number;
  participationRate: number;
  activeSurveys: number;
  regionsCount: number;
}

export async function getSurveyStats(options?: CacheOptions): Promise<SurveyStats | null> {
  const cacheKey = createCacheKey(['survey', 'stats']);
  const ttl = 2 * 60 * 1000;

  return cachedFetch<SurveyStats | null>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/survey/statistics`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return null;

      const data: SurveyStats = await response.json();
      return data;
    },
    { ...options, ttl, staleWhileRevalidate: true }
  );
}

export interface RegionStats {
  id: string;
  name: string;
  votes: number;
  activity: number;
  path: string;
}

export async function getRegionClosedSurveyStats(options?: CacheOptions): Promise<RegionStats[]> {
  const cacheKey = createCacheKey(['region', 'stats', 'survey']);
  const ttl = 5 * 60 * 1000;

  return cachedFetch<RegionStats[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/region/statistic/survey`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data = await response.json();
      return data;
    },
    { ...options, ttl }
  );
}

export async function getRegionUserStats(options?: CacheOptions): Promise<RegionStats[]> {
  const cacheKey = createCacheKey(['region', 'stats', 'user']);
  const ttl = 5 * 60 * 1000;

  return cachedFetch<RegionStats[]>(
    cacheKey,
    async () => {
      const response = await fetch(`${NPS_API_URL}/region/statistic/user`, {
        next: { revalidate: 300 }
      });

      if (!response.ok) return [];

      const data = await response.json();
      return data;
    },
    { ...options, ttl }
  );
}

export function clearSurveyCache(pattern?: string): void {
  apiCache.invalidate(pattern ? `survey:${pattern}` : 'survey');
}
