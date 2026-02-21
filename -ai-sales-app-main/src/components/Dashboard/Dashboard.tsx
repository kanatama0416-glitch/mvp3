import React, { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import Consultation from '../Consultation/ConsultationClean';

interface LatestUpdate {
  id: string;
  title: string;
  summary: string;
  date: string;
  isNew?: boolean;
}

const latestUpdates: LatestUpdate[] = [
  {
    id: 'u1',
    title: '本人確認書類の内容が変わりました',
    summary: '本人確認に使える書類が変更になっています。必ず確認してください。',
    date: '2026/02/05',
    isNew: true
  },
  {
    id: 'u2',
    title: '2月追加の新券面',
    summary: '2月に新しく追加された新券面が10件あります。',
    date: '2026/02/03'
  },
  {
    id: 'u3',
    title: 'ステラ端末導入後について',
    summary: '端末変更に伴い、精算機器の操作方法が変更になりました。',
    date: '2026/02/01',
    isNew: true
  }
];

const pastUpdates: LatestUpdate[] = [
  {
    id: 'p1',
    title: 'ポイント付与ルールの確認',
    summary: '一部のキャンペーンで付与条件が変わりました。',
    date: '2026/01/28'
  },
  {
    id: 'p2',
    title: '本人確認の手順まとめ',
    summary: '確認手順のポイントを短くまとめました。',
    date: '2026/01/22'
  },
  {
    id: 'p3',
    title: 'カード申込フローの見直し',
    summary: '申込時の案内順序を更新しています。',
    date: '2026/01/18'
  },
  {
    id: 'p4',
    title: 'よくある質問の追加',
    summary: '現場で多い質問を追加しました。',
    date: '2026/01/12'
  },
  {
    id: 'p5',
    title: '精算機器の注意点',
    summary: '端末操作時の注意点をまとめました。',
    date: '2026/01/08'
  },
  {
    id: 'p6',
    title: '案内トーク例の更新',
    summary: '導入トークの例文を一部変更しています。',
    date: '2026/01/05'
  },
  {
    id: 'p7',
    title: 'キャンペーン案内の統一',
    summary: '案内文言を統一しました。',
    date: '2025/12/28'
  },
  {
    id: 'p8',
    title: '新券面の告知まとめ',
    summary: '新券面の案内情報を整理しました。',
    date: '2025/12/22'
  },
  {
    id: 'p9',
    title: '申込時の注意点',
    summary: '入力ミスを防ぐポイントを共有します。',
    date: '2025/12/15'
  },
  {
    id: 'p10',
    title: '会員特典の説明補足',
    summary: '説明時の補足ポイントを追加しました。',
    date: '2025/12/08'
  }
];

interface DashboardProps {
  onNavigateToSimulation: () => void;
}

export default function Dashboard({ onNavigateToSimulation: _onNavigateToSimulation }: DashboardProps) {
  const [dashboardTab, setDashboardTab] = useState<'learning' | 'practice'>('learning');
  const [showPastUpdates, setShowPastUpdates] = useState(false);
  const [pastUpdatesPage, setPastUpdatesPage] = useState(1);
  const [showEposNaviModal, setShowEposNaviModal] = useState(false);
  const [showEposZukanModal, setShowEposZukanModal] = useState(false);
  const [showLatestModal, setShowLatestModal] = useState(false);
  const [showPastModal, setShowPastModal] = useState(false);

  const handleDashboardTabChange = (tab: 'learning' | 'practice') => {
    setDashboardTab(tab);
  };

  const topTabs = (
    <div className="bg-white rounded-xl border border-gray-200 p-1 overflow-hidden">
      <div className="flex space-x-2 w-full">
        <button
          type="button"
          onClick={() => handleDashboardTabChange('learning')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
            dashboardTab === 'learning'
              ? 'bg-sky-blue text-white'
              : 'text-gray-600 hover:bg-blue-50 hover:text-sky-blue'
          }`}
        >
          学習
        </button>
        <button
          type="button"
          onClick={() => handleDashboardTabChange('practice')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
            dashboardTab === 'practice'
              ? 'bg-success-green text-white'
              : 'text-gray-600 hover:bg-green-50 hover:text-success-green'
          }`}
        >
          練習
        </button>
      </div>
    </div>
  );

  if (dashboardTab === 'practice') {
    return (
      <div className="space-y-6">
        {topTabs}
        <Consultation />
      </div>
    );
  }

  const pastUpdatesPerPage = 5;
  const pastUpdatesTotalPages = Math.ceil(pastUpdates.length / pastUpdatesPerPage);
  const pastUpdatesStartIndex = (pastUpdatesPage - 1) * pastUpdatesPerPage;
  const visiblePastUpdates = pastUpdates.slice(
    pastUpdatesStartIndex,
    pastUpdatesStartIndex + pastUpdatesPerPage
  );

  return (
    <div className="space-y-6">
      {topTabs}
      <div />

      <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-white rounded-xl border border-blue-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">最新情報</h2>
            <p className="text-sm text-gray-600 mt-1">最新のアップデートやお知らせを確認しましょう</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestUpdates.map((update) => (
            <button
              key={update.id}
              type="button"
              onClick={() => setShowLatestModal(true)}
              className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm hover:border-sky-blue hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {update.isNew && (
                    <span className="text-xs bg-sky-blue text-white px-2 py-0.5 rounded-full shadow-sm">重要</span>
                  )}
                  <span className="text-xs text-gray-500">更新日 {update.date}</span>
                </div>
                <span className="text-xs text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{update.title}</h3>
              <p className="text-xs text-gray-600">{update.summary}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setShowPastUpdates((prev) => !prev)}
            className="text-sm font-medium text-sky-blue hover:text-blue-600 transition-colors"
          >
            過去投稿はこちら
          </button>
        </div>
      </div>

      {showPastUpdates && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">過去の最新情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visiblePastUpdates.map((update) => (
              <button
                key={update.id}
                type="button"
                onClick={() => setShowPastModal(true)}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:border-sky-blue hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">更新日 {update.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{update.title}</h3>
                <p className="text-xs text-gray-600">{update.summary}</p>
              </button>
            ))}
          </div>
          {pastUpdatesTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: pastUpdatesTotalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === pastUpdatesPage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPastUpdatesPage(pageNumber)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-blue text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-sky-blue hover:text-sky-blue'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowEposNaviModal(true)}
          className="bg-white rounded-xl border-2 border-sky-200 p-6 text-left shadow-sm hover:border-sky-blue hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-100 text-sky-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">エポスナビ</h3>
              <p className="text-sm text-gray-600 mt-1">カードやそれに関わるサービスについてはこちらをご確認ください。</p>
              <p className="text-xs text-gray-500 mt-3">検索する・開く</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setShowEposZukanModal(true)}
          className="bg-white rounded-xl border-2 border-sky-200 p-6 text-left shadow-sm hover:border-sky-blue hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-100 text-sky-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">エポス図鑑</h3>
              <p className="text-sm text-gray-600 mt-1">達人たちのインタビューからマインドや考えを学ぼう</p>
              <p className="text-xs text-gray-500 mt-3">すぐに相談できる</p>
            </div>
          </div>
        </button>
      </div>

      {showEposNaviModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEposNaviModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">作成中</h3>
            <p className="text-sm text-gray-600 mb-6">エポスナビは現在作成中です。</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowEposNaviModal(false)}
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showEposZukanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEposZukanModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">作成中</h3>
            <p className="text-sm text-gray-600 mb-6">エポス図鑑は現在作成中です。</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowEposZukanModal(false)}
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showLatestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLatestModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">作成中</h3>
            <p className="text-sm text-gray-600 mb-6">最新情報の詳細は現在作成中です。</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowLatestModal(false)}
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showPastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPastModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">作成中</h3>
            <p className="text-sm text-gray-600 mb-6">過去の最新情報の詳細は現在作成中です。</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPastModal(false)}
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
