import React from 'react';
import { Star, Target, ArrowRight, Clock, Play } from 'lucide-react';
import { mockLearningPlans } from '../../data/mockData';

interface PersonalizedPlansProps {
  evaluationData: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
}

export default function PersonalizedPlans({ evaluationData }: PersonalizedPlansProps) {
  // 最も高いスコアのスキルを特定（得意分野）
  const skillScores = [
    { key: 'communication', label: 'ヒアリング力', score: evaluationData.communication },
    { key: 'empathy', label: '親しみやすさ', score: evaluationData.empathy },
    { key: 'problemSolving', label: '柔軟対応力', score: evaluationData.problemSolving },
    { key: 'productKnowledge', label: '提案力', score: evaluationData.productKnowledge },
    { key: 'professionalism', label: '会話スピード', score: evaluationData.professionalism }
  ];

  const topSkill = skillScores.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );

  const weakestSkill = skillScores.reduce((prev, current) => 
    prev.score < current.score ? prev : current
  );

  // 得意分野を伸ばすプランと課題克服プランを選択
  const strengthPlan = mockLearningPlans.find(plan => 
    plan.type === 'strength' && plan.targetSkill === topSkill.key
  ) || mockLearningPlans.find(plan => plan.type === 'strength');

  const improvementPlan = mockLearningPlans.find(plan => 
    plan.type === 'improvement' && plan.targetSkill === weakestSkill.key
  ) || mockLearningPlans.find(plan => plan.type === 'improvement');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-vivid-red" />
        <h3 className="text-lg font-semibold text-gray-900">あなた専用学習プラン</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 得意を伸ばすプラン */}
        {strengthPlan && (
          <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-success-green" />
              <span className="px-3 py-1 bg-green-100 text-success-green text-xs font-medium rounded-full">
                得意を伸ばす
              </span>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{strengthPlan.title}</h4>
            <p className="text-sm text-gray-700 mb-4">{strengthPlan.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">対象スキル:</span>
                <span className="font-medium text-success-green">{topSkill.label} ({topSkill.score}点)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">推定時間:</span>
                <span className="font-medium text-gray-900">{strengthPlan.estimatedDuration}分</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">シナリオ数:</span>
                <span className="font-medium text-gray-900">{strengthPlan.scenarios.length}個</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {strengthPlan.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-white text-success-green px-2 py-1 rounded border border-green-200">
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-success-green text-white rounded-lg hover:bg-emerald-green transition-colors font-medium">
              <Play className="w-4 h-4" />
              <span>学習を開始</span>
            </button>
          </div>
        )}
        
        {/* 課題克服プラン */}
        {improvementPlan && (
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-sky-blue" />
              <span className="px-3 py-1 bg-blue-100 text-sky-blue text-xs font-medium rounded-full">
                課題を克服
              </span>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{improvementPlan.title}</h4>
            <p className="text-sm text-gray-700 mb-4">{improvementPlan.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">対象スキル:</span>
                <span className="font-medium text-sky-blue">{weakestSkill.label} ({weakestSkill.score}点)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">推定時間:</span>
                <span className="font-medium text-gray-900">{improvementPlan.estimatedDuration}分</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">シナリオ数:</span>
                <span className="font-medium text-gray-900">{improvementPlan.scenarios.length}個</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {improvementPlan.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-white text-sky-blue px-2 py-1 rounded border border-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              <Play className="w-4 h-4" />
              <span>学習を開始</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-sunshine-yellow mb-2">💡 学習のコツ</h4>
        <p className="text-sm text-gray-700">
          得意分野を伸ばすことで自信がつき、全体的なパフォーマンス向上につながります。
          まずは「{topSkill.label}」をさらに磨いて、口コミの武器にしましょう！
        </p>
      </div>
    </div>
  );
}