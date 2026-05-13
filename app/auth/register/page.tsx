"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Loader, HelpCircle, Mail, Lock } from 'lucide-react';
import { ncalayerService } from '../../lib/ncalayer';
import { loginEcp } from '../../lib/api/auth';
import { useRegisterData } from './RegisterContext';
import NCALayerHelp from '../../components/shared/ncaLayerHelp';

const RegisterStep1 = () => {
  const router = useRouter();
  const { data, updateData } = useRegisterData();

  const [isNCALayerLoading, setIsNCALayerLoading] = useState(false);
  const [showNCALayerHelp, setShowNCALayerHelp] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateData({ authMethod: null, phone: '+7', gender: 'male' });
  }, []);

  const handleNCALayerRegistration = async () => {
    setIsNCALayerLoading(true);
    setError('');

    try {
      try {
        await ncalayerService.disconnect();
      } catch (e) {}

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

      updateData({
        authMethod: 'ecp',
        ecpSignature: result.signature,
        ecpData: result.data,
      });

      router.push('/auth/register/step2');
    } catch (err: any) {
      setError(err.message || 'Ошибка работы с NCALayer');
    } finally {
      setIsNCALayerLoading(false);
      try {
        await ncalayerService.disconnect();
      } catch (e) {}
    }
  };

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (!acceptPolicy) {
      setError('Необходимо принять условия использования');
      return;
    }

    updateData({
      authMethod: 'email',
      email,
      password,
    });

    router.push('/auth/register/step2');
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
          <p className="text-gray-500 text-sm">Шаг 1 из 3: Выберите способ создания аккаунта</p>
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 bg-[#0a1b33] rounded"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={20} className="text-[#0a1b33]" />
            <h2 className="font-semibold text-gray-900">Быстрая регистрация через ЭЦП</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Используйте электронную цифровую подпись для мгновенной регистрации. Данные будут автоматически загружены из сертификата.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNCALayerRegistration}
              disabled={isNCALayerLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#0a1b33] text-[#0a1b33] font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a1b33] hover:text-white"
            >
              {isNCALayerLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Подключение...
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
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">или</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={20} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">Регистрация через Email</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Создайте аккаунт используя email и пароль
          </p>

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptPolicy}
                  onChange={(e) => setAcceptPolicy(e.target.checked)}
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
              className="w-full py-2.5 bg-[#0a1b33] hover:bg-[#1a2b43] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Продолжить
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600 mt-6">
          Уже есть аккаунт? {' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Войти
          </Link>
        </div>
      </div>

      {showNCALayerHelp && (
        <NCALayerHelp onClose={() => setShowNCALayerHelp(false)} />
      )}
    </div>
  );
};

export default RegisterStep1;
