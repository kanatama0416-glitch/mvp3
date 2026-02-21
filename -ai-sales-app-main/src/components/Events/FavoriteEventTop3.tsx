import React, { useEffect, useMemo, useState } from 'react';
import { Award, Eye } from 'lucide-react';
import { CommunityPost } from '../../types';
import { fetchFavoriteEventPosts } from '../../services/casePostService';
import PostDetail from '../Community/PostDetail';

export default function FavoriteEventTop3() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFavoriteEventPosts({ sinceDays: 7 });
        setPosts(data);
      } catch (e) {
        console.error(e);
        setError('人気事例の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const top3 = useMemo(() => {
    const withScore = posts.map(p => ({
      post: p,
      score: (p.reactions.like || 0) + (p.reactions.empathy || 0) + (p.reactions.helpful || 0)
    }));
    return withScore.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [posts]);

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-yellow-700">
        今週の人気事例TOP3を読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-red-600">
        {error}
      </div>
    );
  }

  if (top3.length === 0) return null;

  if (selectedPost) {
    const handleReaction = (postId: string, type: 'like' | 'empathy' | 'helpful') => {
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions } as any;
        reactions[type] = (reactions[type] || 0) + 1;
        return { ...p, reactions };
      }));
    };

    return (
      <div className="mb-6">
        <PostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onReaction={handleReaction}
        />
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Award className="w-6 h-6 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">今週の人気事例TOP3</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map(({ post, score }, idx) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white rounded-xl border border-yellow-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                {idx + 1}
              </span>
              <span className="text-xs text-gray-500">{post.author.department}</span>
            </div>
            <div className="text-sm text-gray-900 font-medium line-clamp-1 mb-1">{post.title}</div>
            <div className="text-xs text-gray-600 line-clamp-2 mb-3">{post.situation}</div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{score} リアクション</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
