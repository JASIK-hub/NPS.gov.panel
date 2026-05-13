interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  ttl?: number;
  bypassCache?: boolean;
  staleWhileRevalidate?: boolean;
}

export class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000;

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

  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? (entry.data as T) : null;
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

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

export const apiCache = new ApiCache();

export function createCacheKey(parts: (string | number)[]): string {
  return parts.join(':');
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  const ttl = options?.ttl ?? apiCache['defaultTTL'];

  if (!options?.bypassCache) {
    const cached = apiCache.get<T>(key, ttl);
    if (cached !== null) return cached;
  }

  try {
    const data = await fetcher();
    apiCache.set(key, data, ttl);
    return data;
  } catch (error) {
    if (options?.staleWhileRevalidate) {
      const stale = apiCache.getStale<T>(key);
      if (stale !== null) return stale;
    }
    throw error;
  }
}
