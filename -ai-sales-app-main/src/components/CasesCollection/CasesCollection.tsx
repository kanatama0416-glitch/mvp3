import React, { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Events from '../Events/Events';
import PostModal, { PostFormData } from './PostModal';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';
import { useAuth } from '../../hooks/useAuth';
import { createOtherCasePost } from '../../services/casePostService';

interface CasesCollectionProps {
  initialShowHookHelp?: boolean;
  onInitialHookHelpHandled?: () => void;
}

export default function CasesCollection({
  initialShowHookHelp = false,
  onInitialHookHelpHandled,
}: CasesCollectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHookHelp, setShowHookHelp] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!initialShowHookHelp) return;
    const timer = setTimeout(() => {
      setShowHookHelp(true);
      onInitialHookHelpHandled?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [initialShowHookHelp, onInitialHookHelpHandled]);

  const handleSubmitPost = async (data: PostFormData) => {
    try {
      if (!user || user.id === 'guest') {
        alert('投稿するにはログインしてください。');
        return;
      }

      const success = await createOtherCasePost({
        authorId: user.id,
        title: data.title,
        situation: data.situation,
        approach: data.approach,
        result: data.result || '',
        notes: data.learning || '',
        tags: data.tags,
      });

      if (success) {
        alert('投稿が完了しました！');
      } else {
        alert('投稿に失敗しました。もう一度お試しください。');
      }
    } catch (e) {
      console.error(e);
      alert('投稿送信中にエラーが発生しました。');
    }
  };

  const handleOpenHookHelp = () => {
    setShowHookHelp(true);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">ノウハウ集</h1>
        <p className="text-gray-600 mt-1">イベントの好事例をまとめています</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleOpenHookHelp}
          className="inline-flex min-w-[220px] items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-sky-blue text-white font-bold shadow-lg shadow-sky-200 hover:bg-blue-600 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          口コミの構造
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex min-w-[220px] items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-vivid-red text-white font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          投稿
        </button>
      </div>

      <div>
        <Events />
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitPost}
      />

      {showHookHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6">
          <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
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
