import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { mockGrowthRecords } from '../../data/mockData';

export default function GrowthChart() {
  const latestRecord = mockGrowthRecords[mockGrowthRecords.length - 1];
  const previousRecord = mockGrowthRecords[mockGrowthRecords.length - 2];
  
  const skillLabels = {
    communication: 'ヒアリング力',
    empathy: '親しみやすさ',
    problemSolving: '柔軟対応力',
    productKnowledge: '口コミ力',
    professionalism: '会話スピード'
  };

  const getGrowthChange = (skill: keyof typeof skillLabels) => {
    if (!previousRecord) return 0;
    return latestRecord.scores[skill] - previousRecord.scores[skill];
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success-green';
    if (change < 0) return 'text-vivid-red';
    return 'text-gray-500';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-sky-blue" />
        <h3 className="text-lg font-semibold text-gray-900">成長記録</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-success-green">
              {mockGrowthRecords.length}
            </div>
            <div className="text-sm text-gray-600">診断回数</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-success-green">
              {Math.round(Object.values(latestRecord.scores).reduce((a, b) => a + b, 0) / 5)}
            </div>
            <div className="text-sm text-gray-600">最新スコア</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">前回からの変化</h4>
          {Object.entries(skillLabels).map(([key, label]) => {
            const change = getGrowthChange(key as keyof typeof skillLabels);
            const currentScore = latestRecord.scores[key as keyof typeof skillLabels];
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{currentScore}</span>
                  <span className={`text-sm font-medium ${getChangeColor(change)}`}>
                    {getChangeIcon(change)} {Math.abs(change)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-sunshine-yellow" />
            <span className="text-sm font-medium text-gray-900">次回診断予定</span>
          </div>
          <p className="text-sm text-gray-600">
            継続的な成長のため、1週間後の診断をお勧めします
          </p>
        </div>
      </div>
    </div>
  );
}