import React from 'react';
import { Trophy, Target } from 'lucide-react';
import { mockAchievements } from '../../data/mockData';
import AchievementCard from './AchievementCard';

export default function Achievements() {
  const unlockedCount = mockAchievements.filter(a => a.unlockedAt).length;
  const totalCount = mockAchievements.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">達成状況</h1>
          <p className="text-gray-600 mt-1">カード口コミ学習の成果とマイルストーンを確認しましょう</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ml-4">
          <div className="text-right sm:text-left">
            <div className="text-2xl font-bold text-vivid-red">{unlockedCount}</div>
            <div className="text-xs sm:text-sm text-gray-600">/ {totalCount} 達成</div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FF4D4D"
                strokeWidth="3"
                strokeDasharray={`${(unlockedCount / totalCount) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-vivid-red" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {mockAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-vivid-red" />
          <h3 className="text-lg font-semibold text-gray-900">次の目標</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">コミュニケーター獲得まで</h4>
            <div className="text-2xl font-bold text-sky-blue mb-1">1回</div>
            <p className="text-sm text-gray-600">コミュニケーションスコア80点以上が必要</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">問題解決マスター獲得まで</h4>
            <div className="text-2xl font-bold text-sunshine-yellow mb-1">1回</div>
            <p className="text-sm text-gray-600">クレーム対応で90点以上が必要</p>
          </div>
        </div>
      </div>
    </div>
  );
}