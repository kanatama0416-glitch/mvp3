import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockSkillComparisons } from '../../data/mockData';

interface SkillRadarProps {
  scores: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
}

export default function SkillRadar({ scores }: SkillRadarProps) {
  const skills = [
    { key: 'communication', label: 'ヒアリング力', value: scores.communication },
    { key: 'empathy', label: '親しみやすさ', value: scores.empathy },
    { key: 'problemSolving', label: '柔軟対応力', value: scores.problemSolving },
    { key: 'productKnowledge', label: '口コミ力', value: scores.productKnowledge },
    { key: 'professionalism', label: '会話スピード', value: scores.professionalism }
  ];

  const maxScore = 100;
  
  // 平均値との比較データを取得
  const getComparisonData = (skillKey: string) => {
    const skillMap: Record<string, string> = {
      communication: 'ヒアリング力',
      empathy: '親しみやすさ',
      problemSolving: '柔軟対応力',
      productKnowledge: '口コミ力',
      professionalism: '会話スピード'
    };
    
    return mockSkillComparisons.find(comp => comp.skill === skillMap[skillKey]);
  };
  
  const getComparisonIcon = (userScore: number, averageScore: number) => {
    const diff = userScore - averageScore;
    if (diff > 5) return <TrendingUp className="w-4 h-4 text-success-green" />;
    if (diff < -5) return <TrendingDown className="w-4 h-4 text-vivid-red" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">スキル分析</h3>
      
      <div className="space-y-4">
        {skills.map((skill) => {
          const percentage = (skill.value / maxScore) * 100;
          const comparisonData = getComparisonData(skill.key);
          
          return (
            <div key={skill.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{skill.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{skill.value}</span>
                  {comparisonData && getComparisonIcon(skill.value, comparisonData.averageScore)}
                </div>
              </div>
              
              <div className="relative w-full bg-gray-200 rounded-full h-3">
                {comparisonData && (
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-gray-400 rounded-full"
                    style={{ left: `${(comparisonData.averageScore / maxScore) * 100}%` }}
                    title={`平均: ${comparisonData.averageScore}`}
                  />
                )}
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    comparisonData && skill.value > comparisonData.averageScore
                      ? 'bg-gradient-to-r from-success-green to-emerald-green'
                      : 'bg-gradient-to-r from-sky-blue to-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {percentage >= 90 && '優秀'}
                  {percentage >= 80 && percentage < 90 && '良好'}
                  {percentage >= 70 && percentage < 80 && '標準'}
                  {percentage >= 60 && percentage < 70 && '要改善'}
                  {percentage < 60 && '要重点強化'}
                </span>
                {comparisonData && (
                  <span className="text-gray-400">
                    平均 {comparisonData.averageScore} | 上位{100 - comparisonData.percentile}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">総合評価</h4>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-vivid-red">
            {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)}
          </div>
          <div className="text-sm text-gray-600">
            /100点
          </div>
          <div className="ml-4 text-sm text-gray-600">
            社内平均: 75点
          </div>
        </div>
      </div>
    </div>
  );
}