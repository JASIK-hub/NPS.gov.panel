import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация — nps.gov",
  description: "Создайте аккаунт для участия в опросах",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="register-page-wrapper">
      {children}
    </div>
  );
}