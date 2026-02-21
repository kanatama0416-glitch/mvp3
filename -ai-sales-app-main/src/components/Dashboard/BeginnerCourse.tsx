import React, { useState } from 'react';
import { Video, Headphones, MessageSquare, CheckCircle, Circle, Award, Play, Lock, Sparkles, Target, TrendingUp } from 'lucide-react';

interface CourseStep {
  id: number;
  title: string;
  type: 'video' | 'audio' | 'simulation' | 'quiz';
  duration: string;
  description: string;
  content: string;
  completed: boolean;
  locked: boolean;
}

const initialSteps: CourseStep[] = [
  {
    id: 1,
    title: '基礎を知る',
    type: 'video',
    duration: '10分',
    description: '口コミの全体像と基本行動を理解する',
    content: '「口コミって何？」成功事例の短いダイジェスト動画と基本フレーズ・態度を学びます',
    completed: false,
    locked: false
  },
  {
    id: 2,
    title: '実際の会話を聴く',
    type: 'audio',
    duration: '15分',
    description: 'リアルな会話のテンポや言い回しを耳で覚える',
    content: '先輩スタッフの会話を実際に聴き、良い例と悪い例を比較します',
    completed: false,
    locked: true
  },
  {
    id: 3,
    title: '練習してみる',
    type: 'simulation',
    duration: '20分',
    description: '実践体験を通して自信をつける',
    content: 'AIがお客様役になり、基本フレーズを言えるか確認します',
    completed: false,
    locked: true
  },
  {
    id: 4,
    title: 'まとめ＆確認テスト',
    type: 'quiz',
    duration: '10分',
    description: '学習定着と達成感の提供',
    content: '確認クイズ（5問程度）で理解度をチェックします',
    completed: false,
    locked: true
  }
];

function getStepIcon(type: string, size: 'sm' | 'lg' = 'sm') {
  const className = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  switch (type) {
    case 'video':
      return <Video className={className} />;
    case 'audio':
      return <Headphones className={className} />;
    case 'simulation':
      return <MessageSquare className={className} />;
    case 'quiz':
      return <Target className={className} />;
    default:
      return <Circle className={className} />;
  }
}

function getStepColor(type: string): string {
  switch (type) {
    case 'video':
      return 'bg-red-100 text-vivid-red';
    case 'audio':
      return 'bg-green-100 text-success-green';
    case 'simulation':
      return 'bg-purple-100 text-purple-600';
    case 'quiz':
      return 'bg-yellow-100 text-sunshine-yellow';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getStepLabel(type: string): string {
  switch (type) {
    case 'video':
      return '動画学習';
    case 'audio':
      return '音声学習';
    case 'simulation':
      return 'AIシミュレーション';
    case 'quiz':
      return '確認テスト';
    default:
      return type;
  }
}

export default function BeginnerCourse() {
  const [steps, setSteps] = useState<CourseStep[]>(initialSteps);
  const [selectedStep, setSelectedStep] = useState<CourseStep | null>(null);

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleCompleteStep = (stepId: number) => {
    setSteps(prev => {
      const updated = prev.map((step, index) => {
        if (step.id === stepId) {
          return { ...step, completed: true };
        }
        // 次のステップのロックを解除
        if (step.id === stepId + 1) {
          return { ...step, locked: false };
        }
        return step;
      });
      return updated;
    });
    setSelectedStep(null);
  };

  const handleStartStep = (step: CourseStep) => {
    if (!step.locked) {
      setSelectedStep(step);
    }
  };

  // ステップ詳細ビュー
  if (selectedStep) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">STEP{selectedStep.id}: {selectedStep.title}</h2>
            <p className="text-gray-600 mt-1">{selectedStep.description}</p>
          </div>
          <button
            onClick={() => setSelectedStep(null)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            戻る
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getStepColor(selectedStep.type)}`}>
            {getStepIcon(selectedStep.type, 'lg')}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
            {getStepLabel(selectedStep.type)}
          </h3>

          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {selectedStep.content}
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-8">
            <span>所要時間：</span>
            <span className="font-semibold">{selectedStep.duration}</span>
          </div>

          {/* 学習コンテンツのプレースホルダー */}
          <div className="bg-gray-50 rounded-xl p-12 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {selectedStep.type === 'video' && '動画コンテンツがここに表示されます'}
                {selectedStep.type === 'audio' && '音声コンテンツがここに表示されます'}
                {selectedStep.type === 'simulation' && 'AIシミュレーションがここで開始されます'}
                {selectedStep.type === 'quiz' && '確認テストがここに表示されます'}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => handleCompleteStep(selectedStep.id)}
              className="flex items-center space-x-2 px-8 py-3 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span>完了してSTEP{selectedStep.id + 1}へ進む</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // コース概要ビュー
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-sky-blue rounded-full flex items-center justify-center">
            <span className="text-2xl">🔰</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">初心者コース</h1>
            <p className="text-gray-600 text-sm">1日30分×1週間で口コミの基礎をマスター</p>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">学習進捗</span>
            <span className="text-sm font-bold text-sky-blue">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-sky-blue h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {completedSteps}/{totalSteps} ステップ完了
            {completedSteps === totalSteps && (
              <span className="ml-2 text-success-green font-semibold">🎉 コース完了！</span>
            )}
          </p>
        </div>

        {/* 学習時間の目安 */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>合計学習時間：2〜3時間</span>
          </div>
        </div>
      </div>

      {/* コース完了バッジ */}
      {completedSteps === totalSteps && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-sunshine-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">🎊 おめでとうございます！</h3>
              <p className="text-gray-700">
                称号「<span className="font-semibold text-sunshine-yellow">口コミスターター</span>」を獲得しました！
              </p>
              <p className="text-sm text-gray-600 mt-1">
                次は中級者コースに挑戦して、さらにスキルアップしましょう！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ステップ一覧 */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isLocked = step.locked;
          const isCurrent = !isCompleted && !isLocked;

          return (
            <div
              key={step.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                isCompleted
                  ? 'border-success-green bg-green-50'
                  : isCurrent
                  ? 'border-sky-blue shadow-md'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* ステップ番号とアイコン */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-success-green text-white'
                        : isCurrent
                        ? 'bg-sky-blue text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : isLocked ? (
                      <Lock className="w-8 h-8" />
                    ) : (
                      <span className="text-2xl font-bold">{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? 'bg-success-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* ステップ内容 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          STEP{step.id}: {step.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-xs bg-success-green text-white px-2 py-1 rounded-full font-medium">
                            完了
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-xs bg-sky-blue text-white px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>受講可能</span>
                          </span>
                        )}
                      </div>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium mb-2 ${getStepColor(step.type)}`}>
                        {getStepIcon(step.type, 'sm')}
                        <span>{getStepLabel(step.type)}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{step.duration}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                  <p className="text-gray-500 text-sm mb-4">{step.content}</p>

                  {!isLocked && !isCompleted && (
                    <button
                      onClick={() => handleStartStep(step)}
                      className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>学習を開始</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => handleStartStep(step)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>もう一度学習する</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ヒント */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-sky-blue mb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>💡 学習のポイント</span>
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• 1日1ステップずつ進めることで、無理なく学習できます</li>
          <li>• 各ステップは順番に解除されていきます</li>
          <li>• 動画→音声→シミュレーションの順で学ぶことで、段階的にスキルが身につきます</li>
          <li>• すべてのステップを完了すると「口コミスターター」の称号を獲得できます</li>
        </ul>
      </div>
    </div>
  );
}
