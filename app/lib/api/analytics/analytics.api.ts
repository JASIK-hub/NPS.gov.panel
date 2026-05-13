import { apiCache, createCacheKey, cachedFetch, CacheOptions } from '../cache.util';
import { fetchWithAuth } from '../auth';

export interface UserStat{
  groupName: string,
  count: number
}

export interface SurveyTypeStat extends UserStat {}

const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;
const DEFAULT_TTL = 5 * 60 * 1000;

export async function fetchAndMapStats(
  endpoint: string,
  keyName: string,
  options?: CacheOptions & { ttl?: number }
): Promise<UserStat[]> {
  const cacheKey = createCacheKey(['analytics', endpoint, keyName]);
  const ttl = options?.ttl ?? DEFAULT_TTL;
  return cachedFetch<UserStat[]>(
    cacheKey,
    async () => {
      const response = endpoint.includes('admin')
        ? await fetchWithAuth(`${NPS_API_URL}/${endpoint}`)
        : await fetch(`${NPS_API_URL}/${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: Math.floor(ttl / 1000) }
          });

      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: any) => ({
        groupName: item[keyName],
        count: item.count
      }));
    },
    { ...options, ttl, staleWhileRevalidate: true }
  );
}

export function clearAnalyticsCache(endpoint?: string): void {
  if (endpoint) {
    apiCache.invalidate(`analytics:${endpoint}`);
  } else {
    apiCache.invalidate('analytics');
  }
}
