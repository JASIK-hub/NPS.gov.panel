"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Loader, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  sendVerifyEmail,
  verifyEmailWithPassword,
  fetchWithAuth,
  storeAuthToken,
  isAuthenticated,
  getCurrentUserId,
  getAuthToken,
} from '@/app/lib/api/auth';
import { useTranslations } from '@/app/lib/locales/useTranslations';

interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  hasPassword?: boolean;
  emailVerified?: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || 'ru';
  const { t } = useTranslations();
  const [verifyEmailParam, setVerifyEmailParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setVerifyEmailParam(params.get('verifyEmail'));
    }
  }, []);

  const [user, setUser] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(verifyEmailParam === 'true' ? '' : '');
  const [showWelcome, setShowWelcome] = useState(verifyEmailParam === 'true');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadProfile();

    if (verifyEmailParam === 'true') {
      setMessage(t('profile.welcomeMessage'));
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_NPS_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEmail(data.email || '');
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const result = await sendVerifyEmail(email);

      if (result.success) {
        setMessage(result.message || t('profile.codeSent'));
        setTimeout(() => {
          setMessage('');
          setStep('verify');
        }, 1500);
      } else {
        setError(result.message || t('profile.codeSendFailed'));
      }
    } catch (err) {
      setError(t('profile.connectionError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password && password !== confirmPassword) {
      setError(t('profile.passwordsNotMatch'));
      return;
    }

    if (password && password.length < 6) {
      setError(t('profile.passwordMinLength'));
      return;
    }

    setIsSaving(true);

    try {
      const result = await verifyEmailWithPassword(email, code, password || undefined);

      if (result.success) {
        if (result.accessToken) {
          storeAuthToken(result.accessToken);
        }
        setMessage(t('profile.emailVerified'));

        setTimeout(() => {
          loadProfile();
          setStep('input');
          setCode('');
          setPassword('');
          setConfirmPassword('');
          setError('');
        }, 2000);
      } else {
        setError(result.message || t('profile.verifyEmailFailed'));
      }
    } catch (err) {
      setError(t('profile.connectionError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            {t('profile.backToMain')}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile.title')}</h1>

        {/* User Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.personalData')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('profile.firstName')}</label>
              <p className="text-gray-900">{user.firstName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('profile.lastName')}</label>
              <p className="text-gray-900">{user.lastName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('profile.phone')}</label>
              <p className="text-gray-900">{user.phone || '-'}</p>
            </div>
          </div>
        </div>

        {/* Email warning if not verified */}
        {user.email && !user.emailVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">{t('profile.verifyEmail')}</p>
                <p className="text-xs text-yellow-700 mt-1">Email {user.email} ожидает подтверждения. Проверьте вашу почту.</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Card - show to add email or when verifying */}
        {(!user.email || step === 'verify') && !user.emailVerified && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${user.emailVerified ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Mail size={20} className={user.emailVerified ? 'text-green-600' : 'text-blue-600'} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t('profile.emailForLogin')}</h2>
              <p className="text-sm text-gray-500">
                {user.emailVerified && user.email
                  ? `${t('profile.verified')}: ${user.email}`
                  : user.email
                  ? `${t('profile.emailForLogin')}: ${user.email}`
                  : t('profile.addEmailForLogin')
                }
              </p>
            </div>
            {user.emailVerified && user.email && (
              <CheckCircle size={24} className="text-green-500 ml-auto" />
            )}
          </div>

          {(!user.email || step === 'verify') ? (
            <div className="border-t border-gray-200 pt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm mb-4">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm mb-4">
                  {message}
                </div>
              )}

              {step === 'input' ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('profile.emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      required
                      disabled={isSaving}
                      className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || !email}
                    className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        {t('profile.sending')}
                      </>
                    ) : (
                      `${t('profile.sendCode')}`
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('profile.codeFromLetter')}
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="1234"
                      required
                      disabled={isSaving}
                      maxLength={4}
                      className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50 text-center text-lg tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('profile.passwordOptional')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="{t('profile.passwordMinLengthPlaceholder')}"
                      disabled={isSaving}
                      minLength={6}
                      className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('profile.createPasswordHint')}
                    </p>
                  </div>

                  {password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('profile.confirmPassword')}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="{t('profile.repeatPassword')}"
                        disabled={isSaving}
                        className="text-black w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm disabled:opacity-50"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('input');
                        setError('');
                        setMessage('');
                      }}
                      disabled={isSaving}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                    >
                      {t('profile.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !code}
                      className="flex-1 bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          {t('profile.verifying')}
                        </>
                      ) : (
                        `${t('profile.verifyEmailBtn')}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}
        </div>
        )}

        {/* Verified Email Badge */}
        {user.email && user.emailVerified && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Mail size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{t('profile.emailForLogin')}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
