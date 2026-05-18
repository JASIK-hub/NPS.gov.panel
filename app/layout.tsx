import type { Metadata } from "next";
import { AuthProvider } from "./components/auth/authProvider";
import { LayoutWrapper } from "./components/layout/layoutWrapper";
import './globals.css'
export const metadata: Metadata = {
  title: "nps.gov — Национальная система опросов",
  description: "Официальный портал для участия в государственных опросах",
  verification: {
    google: "prJUqSxGTUyDGwD-3EVjybXHkNwhYqHkDH_QHuLTCrc", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}