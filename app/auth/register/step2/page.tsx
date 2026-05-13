"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, Phone as PhoneIcon } from 'lucide-react';
import { useRegisterData } from '../RegisterContext';

const RegisterStep2 = () => {
  const router = useRouter();
  const { data, updateData } = useRegisterData();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('+7');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data.authMethod) {
      router.push('/auth/register');
      return;
    }

    if (data.firstName) setFirstName(data.firstName);
    if (data.lastName) setLastName(data.lastName);
    if (data.birthday) setBirthday(data.birthday);
    if (data.phone) setPhone(data.phone);
    if (data.gender) setGender(data.gender);
  }, [data]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('7')) {
      digits = digits.substring(1);
    }
    digits = digits.substring(0, 10);
    setPhone('+7' + digits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName) {
      setError('Заполните имя и фамилию');
      return;
    }

    if (!phone || phone === '+7' || phone.length < 12) {
      setError('Введите корректный номер телефона');
      return;
    }

    if (!birthday) {
      setError('Укажите дату рождения');
      return;
    }

    updateData({
      firstNameManual: firstName,
      lastNameManual: lastName,
      birthdayManual: birthday,
      phone,
      gender,
    });

    router.push('/auth/register/step3');
  };

  const goBack = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Назад
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h1>
          <p className="text-gray-500 text-sm">Шаг 2 из 3: Заполните личные данные</p>
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 bg-green-500 rounded"></div>
          <div className="h-1 flex-1 bg-[#0a1b33] rounded"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
        </div>

        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {data.authMethod === 'ecp'
              ? 'Вы заходите через ЭЦП. Некоторые данные уже заполнены из вашего сертификата.'
              : 'Вы регистрируетесь через Email. Заполните свои данные.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Иван"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Иванов"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер телефона <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <PhoneIcon size={18} className="text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 700 123 45 67"
                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Номер телефона для связи
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата рождения
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
            <div className="flex gap-2">
              <label
                className={`flex-1 p-3 border rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  gender === 'male'
                    ? 'border-[#0a1b33] bg-[#0a1b33] text-white'
                    : 'text-black border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender('male')}
                  className="hidden"
                />
                <span className="text-sm font-medium">Мужчина</span>
              </label>
              <label
                className={`flex-1 p-3 border rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  gender === 'female'
                    ? 'border-[#0a1b33] bg-[#0a1b33] text-white'
                    : 'text-black border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender('female')}
                  className="hidden"
                />
                <span className="text-sm font-medium">Женщина</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0a1b33] hover:bg-[#1a2b43] text-white font-medium rounded-lg transition-all"
          >
            Продолжить
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStep2;
