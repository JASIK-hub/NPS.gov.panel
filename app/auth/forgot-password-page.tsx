"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requestCode, isAuthenticated } from '../lib/api/auth';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await requestCode(email);

      if (result.success) {
        setSuccessMessage(result.message || 'Код отправлен на email');
        setTimeout(() => {
          router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setError(result.message || 'Ошибка отправки кода');
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
            Восстановление пароля
          </h1>
          <p className="text-gray-500 text-sm">
            Введите email, указанный при регистрации. Мы отправим вам 4-значный код для входа
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              {successMessage}
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

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#111827]"
            >
              {isLoading ? 'Отправка...' : 'Отправить код'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
