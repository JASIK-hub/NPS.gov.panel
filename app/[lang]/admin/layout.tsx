"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './components/adminSidebar';
import { removeAuthToken, removeRefreshToken } from '@/app/lib/api/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    removeRefreshToken();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
