import React from 'react';
import { Clock, Star, ChevronRight } from 'lucide-react';

interface SessionItem {
  id: string;
  scenario: string;
  mode: 'customer' | 'staff';
  score: number;
  duration: string;
  date: string;
}

const recentSessions: SessionItem[] = [
  {
    id: '1',
    scenario: 'カード口コミの基本',
    mode: 'staff',
    score: 85,
    duration: '15分',
    date: '今日'
  },
  {
    id: '2',
    scenario: 'アニメイベント口コミ実践',
    mode: 'customer',
    score: 78,
    duration: '20分',
    date: '昨日'
  },
  {
    id: '3',
    scenario: '特典活用口コミ技術',
    mode: 'staff',
    score: 92,
    duration: '18分',
    date: '3日前'
  }
];

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-lime-green bg-green-50';
  if (score >= 80) return 'text-sky-blue bg-blue-50';
  if (score >= 70) return 'text-sunshine-yellow bg-yellow-50';
  return 'text-vivid-red bg-red-50';
}

function getModeLabel(mode: 'customer' | 'staff'): string {
  return mode === 'customer' ? 'お客様役' : '接客役';
}

function getModeColor(mode: 'customer' | 'staff'): string {
  return mode === 'customer' ? 'bg-blue-100 text-sky-blue' : 'bg-green-100 text-lime-green';
}

export default function RecentSessions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">最近の学習履歴</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          すべて表示
        </button>
      </div>
      
      <div className="space-y-4">
        {recentSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">{session.scenario}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModeColor(session.mode)}`}>
                    {getModeLabel(session.mode)}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{session.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getScoreColor(session.score)}`}>
                <Star className="w-4 h-4" />
                <span className="font-medium">{session.score}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Note: MessageSquare import was missing, adding it here for the component
import { MessageSquare } from 'lucide-react';