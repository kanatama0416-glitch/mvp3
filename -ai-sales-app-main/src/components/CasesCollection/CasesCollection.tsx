import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, ChevronRight, Calendar } from 'lucide-react';
import Events from '../Events/Events';
import PostModal, { PostFormData } from './PostModal';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';
import { useAuth } from '../../hooks/useAuth';
import { createOtherCasePost, fetchRawCasePosts, RawCasePost } from '../../services/casePostService';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [posts, setPosts] = useState<RawCasePost[]>([]);
  const [selectedPost, setSelectedPost] = useState<RawCasePost | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!initialShowHookHelp) return;
    const timer = setTimeout(() => {
      setShowHookHelp(true);
      onInitialHookHelpHandled?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [initialShowHookHelp, onInitialHookHelpHandled]);

  useEffect(() => {
    fetchRawCasePosts().then(setPosts).catch(() => setPosts([]));
  }, [refreshKey]);

  const handleSubmitPost = async (data: PostFormData) => {
    try {
      if (!user || user.id === 'guest') {
        alert('投稿するにはログインしてください。');
        return;
      }
      const success = await createOtherCasePost({
        authorId: user.id,
        title: data.title,
        eventName: data.eventName || undefined,
        hook: data.hook,
        pitch: data.pitch,
        card: data.card,
        memo: data.memo,
        tags: data.tags,
      });
      if (success) {
        setRefreshKey(k => k + 1);
        alert('投稿が完了しました！');
      } else {
        alert('投稿に失敗しました。もう一度お試しください。');
      }
    } catch (e) {
      console.error(e);
      alert('投稿送信中にエラーが発生しました。');
    }
  };

  // ---- 投稿詳細モーダル ----
  if (selectedPost) {
    return (
      <div className="space-y-6 w-full max-w-full overflow-x-hidden">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          戻る
        </button>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          {selectedPost.event_title && (
            <span className="inline-block text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-widest">
              {selectedPost.event_title}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900">{selectedPost.title}</h2>

          <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100/70">
            <p className="font-bold text-orange-500 text-[10px] uppercase mb-2 tracking-widest">Hook / フック</p>
            <p className="whitespace-pre-wrap text-gray-700 text-[13px] leading-relaxed">{selectedPost.situation}</p>
          </div>

          <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100/70">
            <p className="font-bold text-green-600 text-[10px] uppercase mb-2 tracking-widest">Pitch / 引き込み</p>
            <p className="whitespace-pre-wrap text-gray-700 text-[13px] leading-relaxed">{selectedPost.approach}</p>
          </div>

          {selectedPost.result && (
            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/70">
              <p className="font-bold text-blue-600 text-[10px] uppercase mb-2 tracking-widest">Card / カード説明</p>
              <p className="whitespace-pre-wrap text-gray-700 text-[13px] leading-relaxed">{selectedPost.result}</p>
            </div>
          )}

          {selectedPost.notes && (
            <div className="bg-gray-100/60 p-5 rounded-3xl border border-gray-200/70">
              <p className="font-bold text-gray-500 text-[10px] uppercase mb-2 tracking-widest">Memo / 補足メモ</p>
              <p className="whitespace-pre-wrap text-gray-700 text-[13px] leading-relaxed">{selectedPost.notes}</p>
            </div>
          )}

          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedPost.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- メインビュー ----
  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">ノウハウ集</h1>
        <p className="text-gray-600 mt-1">イベントの好事例をまとめています</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setShowHookHelp(true)}
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

      {/* 静的イベントカード（変更なし） */}
      <div>
        <Events refreshKey={refreshKey} />
      </div>

      {/* DB投稿カード（イベントカードと同スタイル） */}
      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 px-1">みんなの投稿</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl border-2 border-gray-300 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-vivid-red">
                        投稿
                      </span>
                      {post.event_title && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-blue border border-sky-100 truncate max-w-[140px]">
                          {post.event_title}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-sky-blue transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.situation}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 mt-1 text-gray-400 group-hover:text-sky-blue transition-colors shrink-0" />
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                        +{post.tags.length - 3}件
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    {new Date(post.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}投稿
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
