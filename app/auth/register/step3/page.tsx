"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader, CheckCircle, Mail } from 'lucide-react';
import { useRegisterData } from '../RegisterContext';
import { requestCode, completeRegistration, loginEcp, storeAuthToken, storeRefreshToken, storeUserId } from '../../../lib/api/auth';

const CODE_EXPIRATION_SECONDS = parseInt(process.env.NEXT_PUBLIC_CODE_EXPIRATION || '60', 10);

const RegisterStep3 = () => {
  const router = useRouter();
  const { data, updateData, resetData } = useRegisterData();

  const [emailCode, setEmailCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(CODE_EXPIRATION_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [isEmailAlreadyRegistered, setIsEmailAlreadyRegistered] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skipVerification, setSkipVerification] = useState(false);
  const hasInitializedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sendCode = useCallback(async () => {
    if (!data.email) return;

    setIsSending(true);
    setError('');
    setIsEmailAlreadyRegistered(false);

    try {
      const result = await requestCode(data.email);

      if (!result.success) {
        setError(result.message || 'Ошибка отправки кода');
        return;
      }

      setTimeLeft(CODE_EXPIRATION_SECONDS);
      setCanResend(false);
    } catch (err) {
      setError('Ошибка отправки кода. Попробуйте снова.');
    } finally {
      setIsSending(false);
    }
  }, [data.email]);

  const completeRegistrationDirectly = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (data.ecpSignature && data.ecpData) {
        const result = await loginEcp({
          cms: data.ecpSignature,
          data: data.ecpData,
        });

        if (!result.success) {
          setError(result.message || 'Ошибка входа через ЭЦП');
          setIsLoading(false);
          return;
        }

        if (result.accessToken) {
          storeAuthToken(result.accessToken);
        }
        if (result.refreshToken) {
          storeRefreshToken(result.refreshToken);
        }
        if (result.user?.id) {
          storeUserId(result.user.id);
        }

        setSuccess(true);
        resetData();

        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError('Отсутствуют данные ЭЦП');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации. Попробуйте позже.');
      setIsLoading(false);
    }
  }, [data, resetData, router]);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    if (!data.authMethod) {
      router.push('/auth/register');
      return;
    }

    if (data.authMethod === 'ecp') {
      setSkipVerification(true);
      completeRegistrationDirectly();
    } else {
      if (!data.email) {
        router.push('/auth/register');
        return;
      }
      sendCode();
    }
  }, []); 

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); 

  const handleResend = useCallback(() => {
    if (canResend && !isSending) {
      sendCode();
    }
  }, [canResend, isSending, sendCode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsEmailAlreadyRegistered(false);

    if (!emailCode || emailCode.length < 4) {
      setError('Введите код из письма');
      return;
    }

    setIsLoading(true);

    try {
      const finalData = {
        firstName: data.firstNameManual || data.firstName || '',
        lastName: data.lastNameManual || data.lastName || '',
        phone: data.phone || '',
        birthday: data.birthdayManual || data.birthday || '',
        gender: data.gender || 'male',
        emailCode,
        email: data.email || '',
        password: data.password,
      };

      const result = await completeRegistration(finalData);

      if (!result.success) {
        const errorMessage = result.message || 'Ошибка регистрации';
        setError(errorMessage);

        if (errorMessage.toLowerCase().includes('уже зарегистрирован') || errorMessage.toLowerCase().includes('already registered')) {
          setIsEmailAlreadyRegistered(true);
        }

        setIsLoading(false);
        return;
      }

      if (result.accessToken) {
        storeAuthToken(result.accessToken);
      }
      if (result.refreshToken) {
        storeRefreshToken(result.refreshToken);
      }
      if (result.user?.id) {
        storeUserId(result.user.id);
      }

      setSuccess(true);
      resetData();

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  }, [emailCode, data, resetData, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (skipVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            {success ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Регистрация завершена!</h2>
                <p className="text-gray-600 mb-6">
                  Вы будете перенаправлены на главную страницу
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Loader size={18} className="animate-spin text-[#0a1b33]" />
                  <span className="text-sm text-gray-600">Перенаправление...</span>
                </div>
              </>
            ) : (
              <>
                <Loader size={48} className="animate-spin text-[#0a1b33] mx-auto mb-4" />
                <p className="text-gray-600">Завершение регистрации...</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <button
            onClick={() => router.push('/auth/register/step2')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Назад
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h1>
          <p className="text-gray-500 text-sm">Шаг 3 из 3: Подтверждение email</p>
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 bg-green-500 rounded"></div>
          <div className="h-1 flex-1 bg-green-500 rounded"></div>
          <div className="h-1 flex-1 bg-[#0a1b33] rounded"></div>
        </div>

        {!success ? (
          <>
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0a1b33] rounded-full">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Код отправлен на email</p>
                  <p className="text-lg font-semibold text-gray-900">{data.email || ''}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Введите код из письма
                </label>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  placeholder="0000"
                  className="text-black w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm text-center">
                  <p className="mb-2">{error}</p>
                  {isEmailAlreadyRegistered && (
                    <button
                      type="button"
                      onClick={() => router.push('/auth/login')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Перейти на страницу входа
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !emailCode}
                className="w-full py-3 bg-[#0a1b33] hover:bg-[#1a2b43] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Проверка...
                  </>
                ) : (
                  'Подтвердить и завершить регистрацию'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Не получили код? {' '}
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isSending}
                      className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отправить снова
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      Отправить снова через {formatTime(timeLeft)}
                    </span>
                  )}
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Регистрация завершена!</h2>
            <p className="text-gray-600 mb-6">
              Вы будете перенаправлены на главную страницу
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader size={18} className="animate-spin text-[#0a1b33]" />
              <span className="text-sm text-gray-600">Перенаправление...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterStep3;
