"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  FileText,
  Bot,
  FileEdit,
  LogOut,
} from 'lucide-react';

const sidebarItems = [
  {
    href: '/admin',
    icon: Home,
    label: 'Главная',
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    label: 'Аналитика',
  },
  {
    href: '/admin/reports',
    icon: FileText,
    label: 'Отчеты и AI',
  },
  {
    href: '/admin/drafts',
    icon: FileEdit,
    label: 'Черновики',
  },
];

interface AdminSidebarProps {
  onLogout?: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#051124] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 bg-[#f9bc06] rounded-lg flex items-center justify-center">
              <span className="text-[#051124] font-bold text-lg">N</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white leading-none">nps.gov</span>
            <span className="text-[10px] uppercase tracking-wider text-white/50 mt-1">
              Админ панель
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#f9bc06] text-[#051124] font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
