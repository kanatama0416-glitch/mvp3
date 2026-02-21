import React from 'react';
import { BookOpen, FolderOpen } from 'lucide-react';

interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '学習', icon: BookOpen },
  { id: 'cases', label: 'ノウハウ', icon: FolderOpen },
];

export default function MobileMenu({ activeTab, onTabChange }: MobileMenuProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="grid grid-cols-2 gap-1 px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                isActive
                  ? 'text-vivid-red bg-red-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-none font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
