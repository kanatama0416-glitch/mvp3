import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Pause, RotateCcw, ArrowRight, Mic, Send, Volume2, ThumbsUp, AlertCircle, TrendingUp, X } from 'lucide-react';

interface SimulationSessionProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    customerType: string;
    objectives: string[];
    duration: number;
  };
  mode: 'customer' | 'staff';
  onExit: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  feedback?: {
    type: 'good' | 'warning' | 'error';
    message: string;
  };
}

interface Feedback {
  type: 'good' | 'warning' | 'error';
  message: string;
  icon: string;
}

const TOTAL_STEPS = 5;

export default function SimulationSession({ scenario, mode, onExit }: SimulationSessionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'こんにちは。先日購入した商品に不具合がありまして...',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentScore, setCurrentScore] = useState(75);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [recentFeedback, setRecentFeedback] = useState<Feedback | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // ユーザーのメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    // フィードバックの生成（ランダムでデモ用）
    const feedbackTypes: Feedback[] = [
      { type: 'good', message: '共感が伝わっています 👍', icon: '👍' },
      { type: 'good', message: '丁寧な言葉遣いですね 😊', icon: '😊' },
      { type: 'warning', message: '提案が少し唐突です 🤔', icon: '🤔' },
      { type: 'warning', message: 'もう少し具体的に説明しましょう', icon: '💡' },
    ];
    const randomFeedback = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];

    userMessage.feedback = randomFeedback;
    setRecentFeedback(randomFeedback);

    // スコア更新
    if (randomFeedback.type === 'good') {
      setCurrentScore(Math.min(100, currentScore + 5));
    } else if (randomFeedback.type === 'warning') {
      setCurrentScore(Math.max(0, currentScore - 2));
    }

    setMessages([...messages, userMessage]);
    setInputText('');

    // AIの返答（デモ用）
    setTimeout(() => {
      const aiResponses = [
        'そうですか。詳しく教えていただけますか？',
        'ありがとうございます。それでは、この方法はいかがでしょうか？',
        'なるほど、わかりました。',
        'それは良いですね。他に何かございますか？',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // ステップを進める
      if (messages.length >= 8) {
        setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1));
      }
    }, 1000);
  };

  const handleComplete = () => {
    // 最終スコアと評価を計算
    setFinalScore(currentScore);
    setStrengths([
      '顧客の感情を受け止める姿勢ができていました',
      '丁寧な言葉遣いで対応できていました',
      '解決策を複数提示できていました'
    ]);
    setImprovements([
      '解決策を提示する前に共感をもう一度示すと良い',
      '顧客の要望を確認してから提案すると効果的です'
    ]);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setMessages([{
      id: '1',
      sender: 'ai',
      content: 'こんにちは。先日購入した商品に不具合がありまして...',
      timestamp: new Date(),
    }]);
    setCurrentStep(1);
    setCurrentScore(75);
    setInputText('');
    setRecentFeedback(null);
    setIsCompleted(false);
  };

  // 成績サマリー画面
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-light-gray p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-success-green rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">練習完了！</h2>
              <p className="text-gray-600">{scenario.title}</p>
            </div>
          </div>

          {/* 総合スコア */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">総合スコア</h3>
            <div className="text-6xl font-bold text-success-green mb-2">{finalScore}</div>
            <div className="text-gray-600">/ 100点</div>

            {/* スターレーティング */}
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`text-3xl ${
                    star <= Math.floor(finalScore / 20) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </div>
              ))}
            </div>
          </div>

          {/* よかったポイント */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-success-green" />
              <h3 className="text-lg font-semibold text-gray-900">よかったポイント</h3>
            </div>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-success-green text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 改善ポイント */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">改善ポイント</h3>
            </div>
            <div className="space-y-3">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-500 text-sm">!</span>
                  </div>
                  <p className="text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 次の学習導線 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">次のステップ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleRestart}
                className="p-4 border-2 border-success-green text-success-green rounded-lg hover:bg-green-50 transition-colors text-left"
              >
                <div className="font-semibold mb-1">もう一度練習する</div>
                <div className="text-sm">同じシナリオで復習</div>
              </button>
              <button
                onClick={onExit}
                className="p-4 border-2 border-sky-blue text-sky-blue rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <div className="font-semibold mb-1">類似シナリオを試す</div>
                <div className="text-sm">別のシナリオで練習</div>
              </button>
              <button
                onClick={onExit}
                className="p-4 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors text-left"
              >
                <div className="font-semibold mb-1">成功事例を見る</div>
                <div className="text-sm">コミュニティの投稿を確認</div>
              </button>
              <button
                onClick={onExit}
                className="p-4 border-2 border-vivid-red text-vivid-red rounded-lg hover:bg-red-50 transition-colors text-left"
              >
                <div className="font-semibold mb-1">教材で学習</div>
                <div className="text-sm">関連する動画・音声を視聴</div>
              </button>
            </div>
          </div>

          {/* 戻るボタン */}
          <button
            onClick={onExit}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            シナリオ選択に戻る
          </button>
        </div>
      </div>
    );
  }

  // 練習中画面
  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      {/* 上部シナリオ情報バー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{scenario.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>👤 {scenario.customerType}</span>
                  <span>⏱️ 約{scenario.duration}分</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    mode === 'staff' ? 'bg-green-100 text-success-green' : 'bg-blue-100 text-sky-blue'
                  }`}>
                    {mode === 'staff' ? '口コミ練習モード' : 'お客様モード'}
                  </span>
                </div>
              </div>
            </div>

            {/* スコアゲージ */}
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">現在のスコア</div>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-success-green">{currentScore}</div>
                <div className="text-gray-600">/100</div>
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Step {currentStep} / {TOTAL_STEPS}</span>
              <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-success-green rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {/* 対話エリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                  {/* メッセージ吹き出し */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-success-green text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-sky-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">AI</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">AI顧客</span>
                      </div>
                    )}
                    <p className={message.sender === 'user' ? 'text-white' : 'text-gray-900'}>
                      {message.content}
                    </p>
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* フィードバック */}
                  {message.sender === 'user' && message.feedback && (
                    <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                      message.feedback.type === 'good'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : message.feedback.type === 'warning'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span>{message.feedback.icon}</span>
                      <span>{message.feedback.message}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex space-x-3">
                <button className="p-3 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="メッセージを入力..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-success-green text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右側フィードバックパネル */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
          <h3 className="font-semibold text-gray-900 mb-4">リアルタイムフィードバック</h3>

          {/* 最新フィードバック */}
          {recentFeedback && (
            <div className={`p-4 rounded-lg mb-4 ${
              recentFeedback.type === 'good'
                ? 'bg-green-50 border border-green-200'
                : recentFeedback.type === 'warning'
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="text-2xl mb-2">{recentFeedback.icon}</div>
              <p className={`text-sm ${
                recentFeedback.type === 'good'
                  ? 'text-green-700'
                  : recentFeedback.type === 'warning'
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {recentFeedback.message}
              </p>
            </div>
          )}

          {/* 学習目標 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">学習目標</h4>
            <div className="space-y-2">
              {scenario.objectives.map((obj, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 下部操作ボタン */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-5xl mx-auto flex justify-center space-x-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Pause className="w-4 h-4" />
            <span>一時停止</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>やり直す</span>
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center space-x-2 px-6 py-2 bg-vivid-red text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            <span>練習を終了</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
