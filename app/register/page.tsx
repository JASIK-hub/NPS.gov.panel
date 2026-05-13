"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRoutePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/register');
  }, [router]);

  return null;
}
