"use client";

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../shared/header';
import Footer from '../shared/footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-24 bg-[#051124]" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
