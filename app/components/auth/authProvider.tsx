'use client';

import { useAuthRefresh } from '@/app/lib/hooks/useAuthRefresh';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthRefresh();
  return <>{children}</>;
}
