import React, { useMemo, useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { EVENT_TITLE_OPTIONS } from '../Events/Events';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
}

export interface PostFormData {
  title: string;
  hook: string;
  pullIn: string;
  cardDescription: string;
  attribute: string;
  other: string;
}

export default function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  const [searchText, setSearchText] = useState('');
  const [showEventList, setShowEventList] = useState(false);
  const [showHookHelp, setShowHookHelp] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    hook: '',
    pullIn: '',
    cardDescription: '',
    attribute: '',
    other: '',
  });

  const filteredEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return EVENT_TITLE_OPTIONS;
    return EVENT_TITLE_OPTIONS.filter((eventName) => eventName.toLowerCase().includes(query));
  }, [searchText]);

  const resetForm = () => {
    setSearchText('');
    setShowEventList(false);
    setShowHookHelp(false);
    setFormData({
      title: '',
      hook: '',
      pullIn: '',
      cardDescription: '',
      attribute: '',
      other: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('タイトル（イベント）を選択してください。');
      return;
    }
    onSubmit(formData);
    onClose();
    resetForm();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSelectEvent = (eventName: string) => {
    setFormData((prev) => ({ ...prev, title: eventName }));
    setSearchText(eventName);
    setShowEventList(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">ノウハウを投稿</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <button
            type="button"
            onClick={() => setShowHookHelp(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-blue text-white font-bold shadow-lg hover:bg-blue-600 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            先に口コミの構造を見る
          </button>

          <div>
            <label htmlFor="titleSearch" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル（イベントから選択） <span className="text-vivid-red">*</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="titleSearch"
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setShowEventList(true);
                  if (e.target.value !== formData.title) {
                    setFormData((prev) => ({ ...prev, title: '' }));
                  }
                }}
                onFocus={() => setShowEventList(true)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                placeholder="イベントを検索して選択"
              />
            </div>

            {showEventList && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((eventName) => (
                    <button
                      key={eventName}
                      type="button"
                      onClick={() => handleSelectEvent(eventName)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {eventName}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-gray-500">該当するイベントがありません</p>
                )}
              </div>
            )}

            {formData.title && (
              <p className="mt-2 text-xs text-gray-600">選択中: {formData.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="hook" className="block text-sm font-medium text-gray-700 mb-2">
              フック
            </label>
            <textarea
              id="hook"
              value={formData.hook}
              onChange={(e) => setFormData((prev) => ({ ...prev, hook: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="フックの内容を入力"
            />
          </div>

          <div>
            <label htmlFor="pullIn" className="block text-sm font-medium text-gray-700 mb-2">
              引き込み
            </label>
            <textarea
              id="pullIn"
              value={formData.pullIn}
              onChange={(e) => setFormData((prev) => ({ ...prev, pullIn: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="引き込みの内容を入力"
            />
          </div>

          <div>
            <label htmlFor="cardDescription" className="block text-sm font-medium text-gray-700 mb-2">
              カード説明
            </label>
            <textarea
              id="cardDescription"
              value={formData.cardDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, cardDescription: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="カード説明の内容を入力"
            />
          </div>

          <div>
            <label htmlFor="attribute" className="block text-sm font-medium text-gray-700 mb-2">
              属性
            </label>
            <textarea
              id="attribute"
              value={formData.attribute}
              onChange={(e) => setFormData((prev) => ({ ...prev, attribute: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="属性の内容を入力"
            />
          </div>

          <div>
            <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-2">
              その他
            </label>
            <textarea
              id="other"
              value={formData.other}
              onChange={(e) => setFormData((prev) => ({ ...prev, other: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="その他の補足を入力"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-vivid-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>

      {showHookHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-3 py-6">
          <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHookHelp(false)}
              className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800"
            >
              閉じる
            </button>
            <iframe
              title="口コミの構造"
              srcDoc={HOOK_HELP_HTML}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
