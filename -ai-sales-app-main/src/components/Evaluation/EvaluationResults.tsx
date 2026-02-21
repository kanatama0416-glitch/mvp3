import React from 'react';
import { Calendar, TrendingUp, Award, RotateCcw } from 'lucide-react';
import SkillRadar from './SkillRadar';
import PersonalizedPlans from './PersonalizedPlans';
import GrowthChart from './GrowthChart';

interface EvaluationResultsProps {
  evaluationData: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
    overallScore?: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
    emotionalAnalysis?: {
      tone: string;
      confidence: number;
      engagement: number;
    };
    sessionMessages: string[];
    completedAt: Date;
  };
  onRetakeDiagnosis: () => void;
}

export default function EvaluationResults({ evaluationData, onRetakeDiagnosis }: EvaluationResultsProps) {
  const overallScore = evaluationData.overallScore || Math.round(
    Object.values(evaluationData).slice(0, 5).reduce((a: number, b: number) => a + b, 0) / 5
  );

  const generateFeedback = (scores: any) => {
    // Geminiからのフィードバックがある場合はそれを使用
    if (evaluationData.feedback && evaluationData.strengths && evaluationData.improvements) {
      return {
        strengths: evaluationData.strengths,
        improvements: evaluationData.improvements
      };
    }
    
    // フォールバック評価
    const strengths = [];
    const improvements = [];

    if (scores.productKnowledge >= 85) {
      strengths.push('カード知識が豊富で、お客様に分かりやすく口コミできています');
    }
    if (scores.professionalism >= 85) {
      strengths.push('プロフェッショナルな対応で信頼感を与えています');
    }
    if (scores.empathy >= 85) {
      strengths.push('共感力を活かしてお客様の気持ちに寄り添えています');
    }

    if (scores.communication < 80) {
      improvements.push('もう少し積極的にコミュニケーションを取りましょう');
    }
    if (scores.problemSolving < 80) {
      improvements.push('問題解決において、より具体的な口コミを心がけましょう');
    }
    if (scores.empathy < 80) {
      improvements.push('お客様の立場に立った対応を意識してみてください');
    }

    return { strengths, improvements };
  };

  const feedback = generateFeedback(evaluationData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">診断結果</h1>
        </div>
        
        <button
          onClick={onRetakeDiagnosis}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>再診断</span>
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-6 border border-red-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-vivid-red mb-2">{overallScore}</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">総合スコア</div>
          {evaluationData.feedback ? (
            <div className="text-sm text-gray-700 max-w-2xl mx-auto">
              {evaluationData.feedback}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {overallScore >= 90 && '優秀な接客スキルです！'}
              {overallScore >= 80 && overallScore < 90 && '良好な接客ができています'}
              {overallScore >= 70 && overallScore < 80 && '標準的なレベルです'}
              {overallScore < 70 && '更なる向上の余地があります'}
            </div>
          )}
          
          {evaluationData.emotionalAnalysis && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-sky-blue">{evaluationData.emotionalAnalysis.confidence}</div>
                <div className="text-xs text-gray-600">自信度</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success-green">{evaluationData.emotionalAnalysis.engagement}</div>
                <div className="text-xs text-gray-600">積極性</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-sunshine-yellow">
                  {evaluationData.emotionalAnalysis.tone === 'positive' ? '前向き' : 
                   evaluationData.emotionalAnalysis.tone === 'negative' ? '消極的' : '普通'}
                </div>
                <div className="text-xs text-gray-600">トーン</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkillRadar scores={evaluationData} />
        </div>
        
        <div className="space-y-6">
          {feedback.strengths.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-success-green" />
                <h3 className="font-semibold text-gray-900">強み</h3>
              </div>
              <div className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {feedback.improvements.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-sunshine-yellow" />
                <h3 className="font-semibold text-gray-900">改善点</h3>
              </div>
              <div className="space-y-3">
                {feedback.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-sunshine-yellow rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <PersonalizedPlans evaluationData={evaluationData} />
      
      <GrowthChart />
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-sky-blue" />
          <h3 className="font-semibold text-gray-900">診断セッション詳細</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-sky-blue">{evaluationData.sessionMessages.length}</div>
            <div className="text-sm text-gray-600">AI応答回数</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-lime-green">
              {Math.floor(300 / 60)}分
            </div>
            <div className="text-sm text-gray-600">診断時間</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-sunshine-yellow">音声+映像</div>
            <div className="text-sm text-gray-600">分析方法</div>
          </div>
        </div>
      </div>
    </div>
  );
}