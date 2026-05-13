"use client";

import { RegisterProvider } from './RegisterContext';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegisterProvider>{children}</RegisterProvider>;
}
