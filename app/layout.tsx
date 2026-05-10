import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import './globals.css'
export const metadata: Metadata = {
  title: "nps.gov — Национальная система опросов",
  description: "Официальный портал для участия в государственных опросах",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-24 bg-[#051124]" />}>
            <Header />
          </Suspense>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}