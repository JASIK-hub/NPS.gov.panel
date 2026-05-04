"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Loader, HelpCircle } from 'lucide-react';
import { loginEcp, storeAuthToken, storeRefreshToken, isAuthenticated } from '../lib/api/auth';
import { ncalayerService } from '../lib/ncalayer';
import NCALayerHelp from '../components/shared/ncaLayerHelp';

const RegisterPage = () => {
  const router = useRouter();
  const [isNCALayerLoading, setIsNCALayerLoading] = useState(false);
  const [showNCALayerHelp, setShowNCALayerHelp] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
    acceptPolicy: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, []);

  const handleNCALayerRegistration = async () => {
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

      const result = await ncalayerService.signDataWithDialog('AUTH'+ Date.now());

      if (!result || !result.signature) {
        setError('Не удалось подписать данные');
        return;
      }
      const loginResult = await loginEcp({ cms: result.signature,data:result.data });
      if (loginResult.success && loginResult.accessToken) {
        storeAuthToken(loginResult.accessToken);

        if (loginResult.refreshToken) {
          storeRefreshToken(loginResult.refreshToken);
        }

        router.push('/');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendCode = async () => {
    if (!formData.email) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCodeSent(true);
    } catch (err) {
      setError('Ошибка отправки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.acceptPolicy) {
      setError('Необходимо принять условия использования');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/auth/login');
    } catch (err) {
      setError('Ошибка регистрации');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h1>
          <p className="text-gray-500 text-sm">Создайте аккаунт для участия в опросах</p>
        </div>

        <div className="mb-6 p-4">

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNCALayerRegistration}
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
                  Регистрация через ЭЦП
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

        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">или обычная регистраци</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полное имя (ФИО)
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Как в удостоверении личности"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Электронная почта
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.com"
                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!formData.email || isLoading || codeSent}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
              >
                {isLoading ? 'Отправка...' : codeSent ? 'Код отправлен' : 'Отправить код'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер телефона
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+7 (___) ___-__-__"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
            <div className="flex gap-2">
              <label className="border border-gray-300 p-3 w-full rounded-md flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-gray-700 text-sm">Мужской</span>
              </label>
              <label className="border border-gray-300 p-3 w-full rounded-md flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-gray-700 text-sm">Женский</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Создайте пароль"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Подтвердите пароль"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="acceptPolicy"
                checked={formData.acceptPolicy}
                onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                Я принимаю <Link href="/privacy" className="text-blue-600 hover:underline">Политику конфиденциальности</Link> и <Link href="/terms" className="text-blue-600 hover:underline">Условия использования</Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-[#666666] hover:bg-[#555555] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Уже есть аккаунт? {' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Войти
            </Link>
            {' '}или{' '}
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-medium">
              Забыли пароль?
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

export default RegisterPage;
