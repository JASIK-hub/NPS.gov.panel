"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requestCode, verifyCode } from '../lib/api/auth';

type AuthStep = 'email' | 'code' | 'success';

const LoginPage = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await requestCode(email);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Код отправлен на email');
        setStep('code');
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(result.message || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const codeValue = code.join('');

    try {
      const result = await verifyCode({ email, code: codeValue });

      if (result.success) {
        setStep('success');
        if (result.token) {
          localStorage.setItem('auth_token', result.token);
        }
        if (result.refreshToken) {
          localStorage.setItem('refresh_token', result.refreshToken);
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
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
    setCode(newCode as ['' | '', '', '', '']);

    const nextEmptyIndex = newCode.findIndex((digit) => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode(['', '', '', '']);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-[600px] w-full bg-white rounded-xl border border-gray-200 shadow-sm p-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Вернуться на главную
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'code' ? 'Введите код' : 'Вход в систему'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'code'
              ? `Введите 4-значный код, отправленный на ${email}`
              : 'Войдите, чтобы продолжить участие в опросах и просматривать аналитику'
            }
          </p>
        </div>

        {step === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-800 font-bold text-lg mb-2">Вход выполнен успешно!</div>
            <div className="text-green-600 text-sm">Перенаправление...</div>
          </div>
        ) : step === 'email' ? (
          <form onSubmit={handleRequestCode} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder=""
                required
                disabled={isLoading}
                className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827]"
              >
                {isLoading ? 'Отправка...' : 'Получить код'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
                {successMessage}
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

              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={isLoading}
                className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleRequestCode}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                Отправить код повторно
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Еще нет аккаунта? </span>
          <button className="text-gray-900 font-semibold underline hover:text-black">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;