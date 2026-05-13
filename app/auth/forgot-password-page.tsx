"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import { forgotPassword, resetPassword, isAuthenticated } from '../lib/api/auth';
import { useRouter, useSearchParams } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccessMessage(result.message || 'Код отправлен на вашу почту');
        setTimeout(() => {
          setSuccessMessage('');
          setStep('reset');
        }, 1500);
      } else {
        setError(result.message || 'Не удалось отправить код');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email, code, newPassword);

      if (result.success) {
        setSuccessMessage(result.message || 'Пароль успешно изменён');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(result.message || 'Не удалось сбросить пароль');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-[600px] w-full bg-white rounded-xl border border-gray-200 shadow-sm p-10">
        <div className="mb-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Вернуться к входу
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'email' ? 'Восстановление пароля' : 'Установка нового пароля'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'email'
              ? 'Введите email, указанный при регистрации. Мы отправим вам код для сброса пароля'
              : 'Введите код из письма и новый пароль'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm mb-6">
            {successMessage}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="example@mail.com"
                required
                disabled={isLoading}
                className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить код'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Код из письма</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="1234"
                required
                disabled={isLoading}
                maxLength={4}
                className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed text-center text-lg tracking-widest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Минимум 6 символов"
                required
                disabled={isLoading}
                minLength={6}
                className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Повторите новый пароль"
                required
                disabled={isLoading}
                className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !code || !newPassword || !confirmPassword}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Сброс...
                </>
              ) : (
                'Сбросить пароль'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              disabled={isLoading}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              ← Назад
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
