import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход — nps.gov",
  description: "Войдите в систему для участия в опросах",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page-wrapper">
      {children}
    </div>
  );
}