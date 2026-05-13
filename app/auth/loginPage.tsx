"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Loader, HelpCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  loginPassword,
  loginEcp,
  storeAuthToken,
  storeRefreshToken,
  storeUserId,
  isAuthenticated
} from '../lib/api/auth';
import { ncalayerService } from '../lib/ncalayer';
import NCALayerHelp from '../components/shared/ncaLayerHelp';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNCALayerLoading, setIsNCALayerLoading] = useState(false);
  const [showNCALayerHelp, setShowNCALayerHelp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    }
  }, [searchParams, router]);

  const handleNCALayerLogin = async () => {
    setIsNCALayerLoading(true);
    setError('');

    try {
      try {
        await ncalayerService.disconnect();
      } catch (e) {
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const isAvailable = await ncalayerService.isAvailable();

      if (!isAvailable) {
        setError('NCALayer не установлен или не запущен. Установите с сайта pki.gov.kz');
        return;
      }

      const result = await ncalayerService.signDataWithDialog('AUTH' + Date.now());

      if (!result || !result.signature) {
        setError('Не удалось подписать данные');
        return;
      }

      const loginResult = await loginEcp({ cms: result.signature, data: result.data });

      if (loginResult.success && loginResult.accessToken) {
        storeAuthToken(loginResult.accessToken);

        if (loginResult.refreshToken) {
          storeRefreshToken(loginResult.refreshToken);
        }

        if (loginResult.user?.id) {
          storeUserId(loginResult.user.id);
        }

        const redirect = searchParams.get('redirect');
        setTimeout(() => {
          window.location.href = redirect || '/';
        }, 500);
      } else {
        setError(loginResult.message || 'Ошибка входа через ЭЦП');
      }

    } catch (err: any) {
      setError(err.message || 'Ошибка работы с NCALayer');
    } finally {
      setIsNCALayerLoading(false);
      try {
        await ncalayerService.disconnect();
      } catch (e) {
      }
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginPassword({ identifier: email, password });

      if (result.success) {
        if (result.accessToken) {
          storeAuthToken(result.accessToken);
        }
        if (result.refreshToken) {
          storeRefreshToken(result.refreshToken);
        }
        if (result.user?.id) {
          storeUserId(result.user.id);
        }
        const redirect = searchParams.get('redirect');
        setTimeout(() => {
          window.location.href = redirect || '/';
        }, 500);
      } else {
        setError(result.message || 'Неверный email/ИИН или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Вернуться на главную
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Вход в систему</h1>
          <p className="text-gray-500 text-sm">Войдите, чтобы продолжить участие в опросах</p>
        </div>

        {/* ECP Login Block */}
        <div className="mb-6 p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNCALayerLogin}
              disabled={isNCALayerLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-400 text-[#0a1b33] font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isNCALayerLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Подключение к NCALayer...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Войти через ЭЦП
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowNCALayerHelp(true)}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-all"
              title="Помощь с NCALayer"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">или войдите через email</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Password Login Form */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email или ИИН</label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="example@mail.com или ИИН"
              required
              disabled={isLoading || isNCALayerLoading}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Введите пароль"
              required
              disabled={isLoading || isNCALayerLoading}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <Link
            href="/auth/forgot-password"
            className="block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Забыли пароль?
          </Link>

          <button
            type="submit"
            disabled={isLoading || isNCALayerLoading || !email || !password}
            className="w-full py-2 bg-[#666666] hover:bg-[#555555] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Еще нет аккаунта?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>

      {showNCALayerHelp && (
        <NCALayerHelp onClose={() => setShowNCALayerHelp(false)} />
      )}
    </div>
  );
};

export default LoginPage;
