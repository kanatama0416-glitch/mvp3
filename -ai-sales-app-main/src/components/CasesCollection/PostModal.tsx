import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { EVENT_TITLE_OPTIONS } from '../Events/Events';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';
import { suggestedTags } from '../../data/mockData';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
}

export interface PostFormData {
  title: string;
  eventName: string;
  hook: string;
  pitch: string;
  card: string;
  memo: string;
  tags: string[];
}

export default function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  const [showHookHelp, setShowHookHelp] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    eventName: '',
    hook: '',
    pitch: '',
    card: '',
    memo: '',
    tags: [],
  });

  const resetForm = () => {
    setShowHookHelp(false);
    setTagInput('');
    setFormData({
      title: '',
      eventName: '',
      hook: '',
      pitch: '',
      card: '',
      memo: '',
      tags: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventName) {
      alert('イベントを選択してください。');
      return;
    }
    if (!formData.hook) {
      alert('フックを入力してください。');
      return;
    }
    if (!formData.pitch) {
      alert('引き込みを入力してください。');
      return;
    }
    if (!formData.card) {
      alert('カード説明を入力してください。');
      return;
    }
    onSubmit({ ...formData, title: formData.eventName });
    onClose();
    resetForm();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleAddTag = (tag: string) => {
    const normalized = tag.startsWith('#') ? tag : `#${tag}`;
    if (normalized.length > 1 && !formData.tags.includes(normalized)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, normalized] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
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
            <label htmlFor="eventSelect" className="block text-sm font-medium text-gray-700 mb-2">
              イベント <span className="text-vivid-red">*</span>
            </label>
            <select
              id="eventSelect"
              value={formData.eventName}
              onChange={(e) => setFormData((prev) => ({ ...prev, eventName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent bg-white"
            >
              <option value="">イベントを選択してください</option>
              {EVENT_TITLE_OPTIONS.map((eventName) => (
                <option key={eventName} value={eventName}>{eventName}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hook" className="block text-sm font-medium text-gray-700 mb-2">
              フック <span className="text-vivid-red">*</span>
              <span className="ml-1 text-xs text-gray-400 font-normal">どう話しかけたか</span>
            </label>
            <textarea
              id="hook"
              value={formData.hook}
              onChange={(e) => setFormData((prev) => ({ ...prev, hook: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="例: 「今日3000円超えている方が多いので、抽選会に参加できますがエポスカードお持ちですか？」"
            />
          </div>

          <div>
            <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
              引き込み <span className="text-vivid-red">*</span>
              <span className="ml-1 text-xs text-gray-400 font-normal">どう関心を引いたか</span>
            </label>
            <textarea
              id="pitch"
              value={formData.pitch}
              onChange={(e) => setFormData((prev) => ({ ...prev, pitch: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="例: スマホ入会で3000円割引、抽選会B賞プレゼントと伝えて関心を引いた"
            />
          </div>

          <div>
            <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-2">
              カード説明 <span className="text-vivid-red">*</span>
              <span className="ml-1 text-xs text-gray-400 font-normal">どう説明したか</span>
            </label>
            <textarea
              id="card"
              value={formData.card}
              onChange={(e) => setFormData((prev) => ({ ...prev, card: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="例: 年会費無料・次回のイベントでもお得に使えると説明し、その場で申し込み"
            />
          </div>

          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              補足メモ
              <span className="ml-1 text-xs text-gray-400 font-normal">客層・気づきなど</span>
            </label>
            <textarea
              id="memo"
              value={formData.memo}
              onChange={(e) => setFormData((prev) => ({ ...prev, memo: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              placeholder="例: 20代男性・アニメ好き。キャラ名を覚えておくと話が弾む"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput.trim()) handleAddTag(tagInput.trim());
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent text-sm"
                placeholder="タグを入力してEnter"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {suggestedTags
                .filter((t) => !formData.tags.includes(t))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
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
