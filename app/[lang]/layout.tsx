import { ReactNode } from 'react';

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return (
    <>{children}</>
  );
}
