import { Suspense } from 'react';
import LoginPage from "../loginPage";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Загрузка...</div>}>
      <LoginPage />
    </Suspense>
  );
}
