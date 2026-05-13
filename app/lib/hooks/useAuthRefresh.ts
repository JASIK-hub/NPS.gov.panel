import { useEffect, useRef } from 'react';
import { isTokenExpired, refreshAccessToken, getAuthToken, isRefreshTokenExpired } from '../api/auth';

export function useAuthRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      if (isRefreshTokenExpired()) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        return;
      }

      if (isTokenExpired()) {
        const result = await refreshAccessToken();
        if (!result.success) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
        }
      }
    };

    checkAndRefreshToken();

    intervalRef.current = setInterval(checkAndRefreshToken, 30 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
}
