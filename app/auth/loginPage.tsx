"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginPassword, storeAuthToken, storeRefreshToken, isAuthenticated } from '../lib/api/auth';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginPassword({ email, password });

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
        setError(result.message || 'Неверный email или пароль');
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
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Вернуться на главную
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Вход в систему</h1>
          <p className="text-gray-500 text-sm">
            Войдите, чтобы продолжить участие в опросах и просматривать аналитику
          </p>
        </div>

        <form onSubmit={handlePasswordLogin} className="space-y-6">
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
              placeholder="example@mail.com"
              required
              disabled={isLoading}
              className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
              disabled={isLoading || !email || !password}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827]"
            >
              {isLoading ? 'Загрузка...' : 'Войти'}
            </button>

            <Link
              href="/auth/forgot-password"
              className="block w-full text-center py-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Забыли пароль?
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Еще нет аккаунта? </span>
          <Link href="/register" className="text-gray-900 font-semibold underline hover:text-black">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;