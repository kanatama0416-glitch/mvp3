import React, { useState } from 'react';
import { ArrowLeft, Play, Users, MessageCircle, Target, Clock, Star, User, Briefcase, AlertCircle, CreditCard, Phone, ShoppingBag, X } from 'lucide-react';
import SimulationSession from './SimulationSession';

interface SimulationProps {
  onBack?: () => void;
}

type LearningMode = 'customer' | 'staff';

interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  customerType: string;
  objectives: string[];
  duration: number;
  icon: string;
  completed?: boolean;
  score?: number;
}

const simulationScenarios: SimulationScenario[] = [
  {
    id: '1',
    title: 'クレーム対応：商品不良',
    description: '商品不良によるクレームへの対応シナリオです',
    difficulty: 'beginner',
    category: 'クレーム対応',
    customerType: '不満を持つ顧客',
    objectives: ['顧客の不満を傾聴する', '適切な謝罪を行う', '解決策を提案する', '顧客満足を得る'],
    duration: 15,
    icon: 'alert',
    completed: true,
    score: 85
  },
  {
    id: '2',
    title: 'カード入会案内',
    description: 'エポスカードへの入会を提案するシナリオです',
    difficulty: 'intermediate',
    category: '接客・販売',
    customerType: '購入を検討している顧客',
    objectives: ['カードのメリットを説明する', '顧客の疑問に答える', '入会を促進する'],
    duration: 20,
    icon: 'card',
    completed: true,
    score: 92
  },
  {
    id: '3',
    title: '難しい質問への対応',
    description: '専門的な質問にも適切に答えるシナリオです',
    difficulty: 'advanced',
    category: 'クレーム対応',
    customerType: '専門的な質問をする顧客',
    objectives: ['専門知識を活用する', '分かりやすく説明する', '信頼関係を構築する'],
    duration: 25,
    icon: 'message',
    completed: false
  },
  {
    id: '4',
    title: '電話応対：問い合わせ対応',
    description: '電話での商品問い合わせに対応するシナリオです',
    difficulty: 'beginner',
    category: '電話応対',
    customerType: '商品について問い合わせる顧客',
    objectives: ['明るく丁寧な応対をする', '必要な情報を正確に伝える', '次のアクションを案内する'],
    duration: 10,
    icon: 'phone',
    completed: false
  },
  {
    id: '5',
    title: '返品・交換対応',
    description: '返品や交換を希望されるお客様への対応シナリオです',
    difficulty: 'intermediate',
    category: 'クレーム対応',
    customerType: '返品を希望する顧客',
    objectives: ['返品理由を確認する', '規定に基づいて対応する', '顧客の理解を得る'],
    duration: 15,
    icon: 'alert',
    completed: false
  },
  {
    id: '6',
    title: 'セール時の混雑対応',
    description: 'セール時の混雑した状況での接客シナリオです',
    difficulty: 'intermediate',
    category: '接客・販売',
    customerType: '急いでいる顧客',
    objectives: ['迅速に対応する', '複数の顧客に気を配る', '効率的に業務を進める'],
    duration: 15,
    icon: 'shopping',
    completed: false
  }
];

function getScenarioIcon(iconType: string) {
  const iconProps = { className: "w-8 h-8" };
  switch (iconType) {
    case 'alert':
      return <AlertCircle {...iconProps} />;
    case 'card':
      return <CreditCard {...iconProps} />;
    case 'message':
      return <MessageCircle {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'shopping':
      return <ShoppingBag {...iconProps} />;
    default:
      return <Target {...iconProps} />;
  }
}

function getDifficultyColor(difficulty: string): string {
  const colors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-orange-100 text-orange-700 border-orange-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
}

function getDifficultyLabel(difficulty: string): string {
  const labels = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級'
  };
  return labels[difficulty as keyof typeof labels] || '不明';
}

export default function Simulation({ onBack }: SimulationProps) {
  const [activeTab, setActiveTab] = useState<LearningMode>('staff');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handleStartSimulation = () => {
    if (selectedScenario) {
      setShowModal(false);
      setIsSessionActive(true);
    }
  };

  const handleExitSession = () => {
    setIsSessionActive(false);
    setSelectedScenario(null);
  };

  const handleCardClick = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    setShowModal(true);
  };

  const completedCount = simulationScenarios.filter(s => s.completed).length;
  const averageScore = simulationScenarios
    .filter(s => s.score)
    .reduce((sum, s) => sum + (s.score || 0), 0) / simulationScenarios.filter(s => s.score).length || 0;

  // セッション中の場合はSimulationSessionを表示
  if (isSessionActive && selectedScenario) {
    return (
      <SimulationSession
        scenario={selectedScenario}
        mode={activeTab}
        onExit={handleExitSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AIシミュレーション</h1>
          <p className="text-gray-600 mt-1">学習モードを選択してAIとの対話で実践的な接客スキルを身につけましょう</p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </button>
        )}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-sky-blue" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
          <p className="text-sm text-gray-600">完了シナリオ</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-success-green" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}</div>
          <p className="text-sm text-gray-600">平均スコア</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{simulationScenarios.length}</div>
          <p className="text-sm text-gray-600">利用可能シナリオ</p>
        </div>
      </div>

      {/* タブ切り替えUI */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* タブヘッダー */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 font-semibold transition-all ${
              activeTab === 'staff'
                ? 'bg-success-green text-white border-b-2 border-success-green'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>口コミ練習モード</span>
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 font-semibold transition-all ${
              activeTab === 'customer'
                ? 'bg-sky-blue text-white border-b-2 border-sky-blue'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span>お客様モード</span>
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">
          {/* モード説明 */}
          <div className={`mb-6 p-4 rounded-lg ${
            activeTab === 'customer' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
          }`}>
            {activeTab === 'customer' ? (
              <div>
                <h3 className="font-semibold text-sky-blue mb-2">お客様モードとは</h3>
                <p className="text-sm text-blue-700">
                  AIが店員役となり、あなたがお客様として体験します。店員の口コミ技術を客観的に学び、良い接客とは何かを理解できます。
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-success-green mb-2">口コミ練習モードとは</h3>
                <p className="text-sm text-green-700">
                  AIがお客様役となり、あなたが店員として口コミ練習をします。実践的なスキルを身につけ、様々な状況での対応力を向上させられます。
                </p>
              </div>
            )}
          </div>

          {/* シナリオカード一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulationScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleCardClick(scenario)}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-sky-blue transition-all duration-200 text-left group"
              >
                {/* アイコン */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  activeTab === 'customer'
                    ? 'bg-blue-100 text-sky-blue group-hover:bg-sky-blue group-hover:text-white'
                    : 'bg-green-100 text-success-green group-hover:bg-success-green group-hover:text-white'
                }`}>
                  {getScenarioIcon(scenario.icon)}
                </div>

                {/* タイトル */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {scenario.title}
                </h3>

                {/* バッジ */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(scenario.difficulty)}`}>
                    {getDifficultyLabel(scenario.difficulty)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
                    {scenario.category}
                  </span>
                </div>

                {/* 情報 */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{scenario.customerType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>約{scenario.duration}分</span>
                  </div>
                </div>

                {/* スコア表示（口コミ練習モードのみ、全カードに表示） */}
                {activeTab === 'staff' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">前回スコア</span>
                      {scenario.completed && scenario.score ? (
                        <span className="text-lg font-bold text-success-green">{scenario.score}点</span>
                      ) : (
                        <span className="text-sm text-gray-400">未履修</span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* モーダル */}
      {showModal && selectedScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeTab === 'customer' ? 'bg-blue-100 text-sky-blue' : 'bg-green-100 text-success-green'
                  }`}>
                    {getScenarioIcon(selectedScenario.icon)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedScenario.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(selectedScenario.difficulty)}`}>
                    {getDifficultyLabel(selectedScenario.difficulty)}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                    {selectedScenario.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-6">
              {/* 選択中のモード */}
              <div className={`p-4 rounded-lg ${
                activeTab === 'customer' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {activeTab === 'customer' ? <User className="w-5 h-5 text-sky-blue" /> : <Briefcase className="w-5 h-5 text-success-green" />}
                  <span className={`font-semibold ${activeTab === 'customer' ? 'text-sky-blue' : 'text-success-green'}`}>
                    {activeTab === 'customer' ? 'お客様モード' : '口コミ練習モード'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {activeTab === 'customer'
                    ? 'AIが店員として接客し、あなたは顧客として体験します'
                    : 'あなたが店員として、AIの顧客に接客します'}
                </p>
              </div>

              {/* シナリオ説明 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">シナリオ説明</h3>
                <p className="text-gray-700">{selectedScenario.description}</p>
              </div>

              {/* 想定顧客 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">想定顧客の特徴</h3>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{selectedScenario.customerType}</span>
                </div>
              </div>

              {/* 学習目標 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">学習目標</h3>
                <div className="space-y-2">
                  {selectedScenario.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activeTab === 'customer' ? 'bg-blue-100 text-sky-blue' : 'bg-green-100 text-success-green'
                      }`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 所要時間 */}
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>所要時間：約{selectedScenario.duration}分</span>
              </div>

              {/* ボタン */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleStartSimulation}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors font-semibold ${
                    activeTab === 'customer'
                      ? 'bg-sky-blue hover:bg-blue-600'
                      : 'bg-success-green hover:bg-green-600'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  <span>このシナリオで練習する</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
