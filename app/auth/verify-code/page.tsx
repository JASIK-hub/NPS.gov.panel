import { Suspense } from 'react';
import VerifyCodePage from '../verify-code-page';

export default function VerifyCodeWrapper() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Загрузка...</div>}>
      <VerifyCodePage />
    </Suspense>
  );
}
