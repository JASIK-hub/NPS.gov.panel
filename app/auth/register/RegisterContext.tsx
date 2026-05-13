"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RegistrationData {
  authMethod: 'ecp' | 'email' | null;
  email?: string;
  password?: string;
  ecpSignature?: string;
  ecpData?: string;
  firstName?: string;
  lastName?: string;
  iin?: string;
  birthday?: string;
  phone: string;
  gender?: 'male' | 'female';
  birthdayManual?: string;
  firstNameManual?: string;
  lastNameManual?: string;
  emailCode?: string;
}

interface RegisterContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  resetData: () => void;
}

const defaultData: RegistrationData = {
  authMethod: null,
  phone: '+7',
  gender: 'male',
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>(defaultData);

  const updateData = (newData: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <RegisterContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegisterData() {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegisterData must be used within RegisterProvider');
  }
  return context;
}
