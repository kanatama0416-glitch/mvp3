import React from 'react';
import { 
  GraduationCap, 
  MessageCircle, 
  Lightbulb, 
  Trophy, 
  Star,
  Target
} from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
}

function getIcon(iconName: string) {
  const icons = {
    GraduationCap,
    MessageCircle,
    Lightbulb,
    Trophy,
    Star,
    Target
  };
  
  const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
  return <IconComponent className="w-6 h-6" />;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.unlockedAt !== undefined;
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 ${
      isUnlocked 
        ? 'border-sunshine-yellow bg-gradient-to-br from-yellow-50 to-red-50 shadow-lg' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isUnlocked ? 'bg-sunshine-yellow text-charcoal-gray' : 'bg-gray-200 text-gray-400'
        }`}>
          {getIcon(achievement.icon)}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm mt-1 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
          
          {isUnlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-sunshine-yellow font-medium">
              <div className="w-2 h-2 bg-success-green rounded-full" />
              {achievement.unlockedAt.toLocaleDateString('ja-JP')} に獲得
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">進捗</span>
          <span className="text-sm font-bold text-gray-900">
            {achievement.progress} / {achievement.maxProgress}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isUnlocked ? 'bg-sunshine-yellow' : 'bg-sky-blue'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}