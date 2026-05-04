"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loginWithCode, storeAuthToken, storeRefreshToken, isAuthenticated } from '../lib/api/auth';

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Перенаправляем вошедших пользователей на главную
    if (isAuthenticated()) {
      router.push('/');
    }
  }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const codeValue = code.join('');

    try {
      const result = await loginWithCode(email, codeValue);

      if (result.success) {
        if (result.accessToken) {
          storeAuthToken(result.accessToken);
        }
        if (result.refreshToken) {
          storeRefreshToken(result.refreshToken);
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        setError(result.message || 'Неверный код');
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (error) setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newCode = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setCode(newCode as typeof code);

    const nextEmptyIndex = newCode.findIndex((digit) => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  useEffect(() => {
    if (!email) {
      window.location.href = '/auth/forgot-password';
    } else {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-[600px] w-full bg-white rounded-xl border border-gray-200 shadow-sm p-10">
        <div className="mb-6">
          <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Назад
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Введите код
          </h1>
          <p className="text-gray-500 text-sm">
            Введите 4-значный код, отправленный на {email}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Код подтверждения</label>
            <div className="flex gap-3 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={code[index]}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  placeholder="•"
                  required
                  disabled={isLoading}
                  maxLength={1}
                  className="text-black w-16 h-16 text-center text-2xl font-bold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Введите 4 цифры из письма</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 4}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827]"
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>
          </div>

          <div className="text-center">
            {isLoading ? (
              <span className="text-sm text-gray-400 font-medium">
                Отправить код повторно
              </span>
            ) : (
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Отправить код повторно
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  );
}
