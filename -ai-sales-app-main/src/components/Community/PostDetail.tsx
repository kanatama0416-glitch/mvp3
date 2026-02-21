import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  Heart, 
  Lightbulb, 
  MessageCircle, 
  Eye, 
  Calendar,
  Globe,
  Building,
  Users,
  Sparkles,
  Send,
  Share2,
  Bookmark
} from 'lucide-react';
import { CommunityPost, CommunityComment } from '../../types';

interface PostDetailProps {
  post: CommunityPost;
  onBack: () => void;
  onReaction: (postId: string, reactionType: 'like' | 'empathy' | 'helpful') => void;
}

export default function PostDetail({ post, onBack, onReaction }: PostDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommunityComment[]>(post.comments);

  const getVisibilityInfo = () => {
    switch (post.visibility) {
      case 'public':
        return { icon: Globe, label: '全社公開', color: 'text-green-600 bg-green-100' };
      case 'department':
        return { icon: Building, label: post.targetDepartment || '部署限定', color: 'text-blue-600 bg-blue-100' };
      case 'theme':
        return { icon: Users, label: post.targetTheme || 'テーマ別', color: 'text-purple-600 bg-purple-100' };
      default:
        return { icon: Globe, label: '公開', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const visibilityInfo = getVisibilityInfo();
  const VisibilityIcon = visibilityInfo.icon;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: CommunityComment = {
      id: Date.now().toString(),
      author: {
        name: '田中 太郎',
        department: 'カード口コミ部',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      content: newComment,
      createdAt: new Date()
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleReactionClick = (reactionType: 'like' | 'empathy' | 'helpful') => {
    onReaction(post.id, reactionType);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 投稿者情報 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{post.author.name}</div>
                  <div className="text-sm text-gray-600">{post.author.department}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${visibilityInfo.color}`}>
                  <VisibilityIcon className="w-4 h-4" />
                  <span>{visibilityInfo.label}</span>
                </span>
                {post.isApprovedForAI && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
                    <Sparkles className="w-4 h-4" />
                    <span>AI学習採用</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{post.createdAt.toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} 回閲覧</span>
              </div>
            </div>
          </div>

          {/* AI要約 */}
          {post.aiSummary && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-sky-blue mt-1" />
                <div>
                  <h3 className="font-semibold text-sky-blue mb-2">AI要約</h3>
                  <p className="text-blue-700">{post.aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* 事例詳細 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 bg-blue-100 text-sky-blue rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>状況（顧客属性・場面）</span>
              </h3>
              <p className="text-gray-700 leading-relaxed pl-8">{post.situation}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 bg-green-100 text-success-green rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>工夫したこと（接客上の工夫・意識点）</span>
              </h3>
              <p className="text-gray-700 leading-relaxed pl-8">{post.innovation}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 bg-yellow-100 text-sunshine-yellow rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>結果（顧客反応・成果）</span>
              </h3>
              <p className="text-gray-700 leading-relaxed pl-8">{post.result}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>学び・気づき（得られた教訓）</span>
              </h3>
              <p className="text-gray-700 leading-relaxed pl-8">{post.learning}</p>
            </div>
          </div>

          {/* タグ */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">関連タグ</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* コメント */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>コメント ({comments.length})</span>
            </h3>

            {/* コメント投稿フォーム */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-3">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  alt="あなた"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを入力..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>投稿</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* コメント一覧 */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      <span className="text-sm text-gray-500">{comment.author.department}</span>
                      <span className="text-sm text-gray-400">
                        {comment.createdAt.toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* リアクション */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">リアクション</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleReactionClick('like')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  post.userReaction === 'like'
                    ? 'bg-blue-50 border-sky-blue text-sky-blue'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span>いいね</span>
                </div>
                <span className="font-semibold">{post.reactions.like}</span>
              </button>

              <button
                onClick={() => handleReactionClick('empathy')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  post.userReaction === 'empathy'
                    ? 'bg-red-50 border-vivid-red text-vivid-red'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>共感</span>
                </div>
                <span className="font-semibold">{post.reactions.empathy}</span>
              </button>

              <button
                onClick={() => handleReactionClick('helpful')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  post.userReaction === 'helpful'
                    ? 'bg-yellow-50 border-sunshine-yellow text-sunshine-yellow'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>参考になった</span>
                </div>
                <span className="font-semibold">{post.reactions.helpful}</span>
              </button>
            </div>
          </div>

          {/* 関連シミュレーション */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">関連シミュレーション</h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="font-medium text-gray-900 text-sm">アニメファン接客練習</div>
                <div className="text-xs text-gray-600 mt-1">この事例に基づいた練習シナリオ</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="font-medium text-gray-900 text-sm">趣味理解型口コミ</div>
                <div className="text-xs text-gray-600 mt-1">顧客の趣味に合わせた提案練習</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}