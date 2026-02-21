import React from 'react';
import { Clock, TrendingUp, TrendingDown, BarChart3, Calendar, Star, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: Date;
  overallScore: number;
  categoryScores: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  duration: number;
}

interface EvaluationHistorySidebarProps {
  history: HistoryItem[];
  onHistoryItemClick: (item: HistoryItem) => void;
  currentView: 'diagnosis' | 'results';
}

export default function EvaluationHistorySidebar({ 
  history, 
  onHistoryItemClick, 
  currentView 
}: EvaluationHistorySidebarProps) {
  const getScoreChange = (currentScore: number, previousScore?: number) => {
    if (!previousScore) return null;
    return currentScore - previousScore;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success-green';
    if (score >= 75) return 'text-sky-blue';
    if (score >= 65) return 'text-sunshine-yellow';
    return 'text-vivid-red';
  };

  const getChangeIcon = (change: number | null) => {
    if (change === null) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3 text-success-green" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-vivid-red" />;
    return null;
  };

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.overallScore, 0) / history.length)
    : 0;

  const latestScore = history.length > 0 ? history[0].overallScore : 0;
  const previousScore = history.length > 1 ? history[1].overallScore : null;
  const scoreChange = getScoreChange(latestScore, previousScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-sky-blue" />
        <h3 className="text-lg font-semibold text-gray-900">診断履歴</h3>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-sky-blue">{history.length}</div>
          <div className="text-xs text-gray-600">診断回数</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-success-green">{averageScore}</div>
          <div className="text-xs text-gray-600">平均スコア</div>
        </div>
      </div>

      {/* 最新スコアと変化 */}
      {history.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">最新スコア</span>
            <div className="flex items-center space-x-1">
              <span className={`text-lg font-bold ${getScoreColor(latestScore)}`}>
                {latestScore}
              </span>
              {scoreChange !== null && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(scoreChange)}
                  <span className={`text-sm font-medium ${
                    scoreChange > 0 ? 'text-success-green' : 
                    scoreChange < 0 ? 'text-vivid-red' : 'text-gray-500'
                  }`}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {history[0].date.toLocaleDateString('ja-JP', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )}

      {/* 履歴リスト - スクロール可能 */}
      <div className="flex-1 overflow-hidden">
        <h4 className="text-sm font-medium text-gray-900 mb-3">過去の診断結果</h4>
        
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">まだ診断履歴がありません</p>
            <p className="text-xs text-gray-400 mt-1">診断を実行すると履歴が表示されます</p>
          </div>
        ) : (
          <div className="space-y-2 h-full overflow-y-auto pr-2">
            {history.map((item, index) => {
              const previousItem = history[index + 1];
              const change = getScoreChange(item.overallScore, previousItem?.overallScore);
              
              return (
                <button
                  key={item.id}
                  onClick={() => onHistoryItemClick(item)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-sky-blue transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(item.overallScore)}`}>
                        {item.overallScore}
                      </span>
                      {change !== null && (
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(change)}
                          <span className={`text-xs font-medium ${
                            change > 0 ? 'text-success-green' : 
                            change < 0 ? 'text-vivid-red' : 'text-gray-500'
                          }`}>
                            {change > 0 ? '+' : ''}{change}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sky-blue transition-colors" />
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {item.date.toLocaleDateString('ja-JP', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(item.duration / 60)}分</span>
                    </div>
                  </div>
                  
                  {/* スキル別スコアのミニ表示 */}
                  <div className="grid grid-cols-5 gap-1">
                    {Object.entries(item.categoryScores).map(([key, score]) => (
                      <div key={key} className="text-center">
                        <div className={`text-xs font-medium ${getScoreColor(score)}`}>
                          {score}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {key === 'communication' ? 'コミュ' :
                           key === 'empathy' ? '共感' :
                           key === 'problemSolving' ? '解決' :
                           key === 'productKnowledge' ? '知識' : 'プロ'}
                        </div>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 診断中の表示 */}
      {currentView === 'diagnosis' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-sky-blue rounded-full animate-pulse" />
            <span className="text-sm font-medium text-sky-blue">診断実行中</span>
          </div>
          <p className="text-xs text-blue-700">
            診断完了後、結果がこちらに追加されます
          </p>
        </div>
      )}

      {/* 成長トレンド */}
      {history.length >= 2 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-success-green" />
            <span>成長トレンド</span>
          </h4>
          <div className="text-xs text-gray-600">
            過去5回の平均: <span className="font-medium text-success-green">
              {Math.round(history.slice(0, 5).reduce((sum, item) => sum + item.overallScore, 0) / Math.min(5, history.length))}点
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            最高スコア: <span className="font-medium text-sunshine-yellow">
              {Math.max(...history.map(item => item.overallScore))}点
            </span>
          </div>
        </div>
      )}
    </div>
  );
}