import { Suspense } from 'react';
import ForgotPasswordPage from '../forgot-password-page';

export default function ForgotPasswordWrapper() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Загрузка...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
