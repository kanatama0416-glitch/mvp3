import React from 'react';
import { Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: 'learner' | 'admin';
    avatar?: string;
  } | null;
}

export default function Header({ title, onMenuToggle, onProfileClick, onLogout, user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src={`${import.meta.env.BASE_URL}app-icon.png?v=3`}
              alt="まなびー アイコン"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">まなびー</h1>
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-300" />
          <h2 className="hidden md:block text-base lg:text-lg text-gray-700">{title}</h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 sm:pl-4 sm:border-l border-gray-200">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs sm:text-sm text-gray-500 hover:bg-red-50 hover:text-vivid-red transition-colors"
            title="ログアウト"
          >
            <LogOut className="w-4 h-4" />
            <span>ログアウト</span>
          </button>
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
              alt={user?.name || 'ユーザー'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
            />
          </button>
          <div className="hidden sm:block">
            <div className="text-xs sm:text-sm font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.department}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
