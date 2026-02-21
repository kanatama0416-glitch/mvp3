import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  Eye,
  Heart,
  Lightbulb,
  Calendar,
  Tag,
  Building,
  Globe,
  Lock,
  Sparkles,
  Bell,
  Award,
  Zap
} from 'lucide-react';
import { suggestedTags, departments, themes } from '../../data/mockData';
import { CommunityPost } from '../../types';
import PostForm from './PostForm';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { fetchOtherCasePosts } from '../../services/casePostService';

type ViewMode = 'list' | 'create' | 'detail';
type SortBy = 'latest' | 'popular' | 'views' | 'trending';
type FilterBy = 'all' | 'public' | 'department' | 'theme';

export default function Community({ reloadKey = 0 }: { reloadKey?: number }) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 「その他事例」用にDBから読み込み
    const load = async () => {
      console.log('Community: Loading posts from database...');
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOtherCasePosts();
        console.log('Community: Loaded posts:', data);
        setPosts(data);
      } catch (e) {
        console.error('Community: Error loading posts:', e);
        setError('投稿の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadKey]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'reaction',
      message: 'あなたの投稿「アニメファン接客事例」に👍いいねがつきました',
      timestamp: new Date('2024-01-20T10:30:00'),
      read: false
    },
    {
      id: '2',
      type: 'ai_adoption',
      message: 'あなたの投稿がAI学習データとして採用されました',
      timestamp: new Date('2024-01-19T15:45:00'),
      read: false
    }
  ]);

  const handleCreatePost = (postData: any) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      ...postData,
      author: {
        name: '田中 太郎',
        department: 'カード口コミ部',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      reactions: { like: 0, empathy: 0, helpful: 0 },
      comments: [],
      views: 0,
      createdAt: new Date(),
      aiSummary: 'AI分析中...',
      isApprovedForAI: false
    };
    
    // AIによる自動タグ提案とイベント判定のシミュレーション
    setTimeout(() => {
      const updatedPost = { ...newPost };
      
      // イベント関連投稿の自動判定
      const eventKeywords = ['呪術廻戦', 'MGAフェス', 'バレンタイン', 'イベント'];
      const isEventRelated = eventKeywords.some(keyword => 
        newPost.title.includes(keyword) || 
        newPost.tags.some(tag => tag.includes(keyword))
      );
      
      if (isEventRelated) {
        updatedPost.aiSummary = 'イベント関連の成功事例として自動分類されました。イベントページにも反映されます。';
      } else {
        updatedPost.aiSummary = 'AI分析完了：効果的な接客テクニックが含まれています。';
      }
      
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === newPost.id ? updatedPost : p)
      );
    }, 2000);
    
    setPosts([newPost, ...posts]);
    setViewMode('list');
  };

  const handleReaction = (postId: string, reactionType: 'like' | 'empathy' | 'helpful') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        
        // 既存のリアクションを取り消し
        if (post.userReaction) {
          newReactions[post.userReaction]--;
        }
        
        // 新しいリアクションを追加（同じものなら取り消し）
        if (post.userReaction !== reactionType) {
          newReactions[reactionType]++;
          return { ...post, reactions: newReactions, userReaction: reactionType };
        } else {
          return { ...post, reactions: newReactions, userReaction: null };
        }
      }
      return post;
    }));
  };

  const filteredAndSortedPosts = posts
    .filter(post => {
      // 検索クエリフィルター
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !post.situation.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // タグフィルター
      if (selectedTags.length > 0 && !selectedTags.some(tag => post.tags.includes(tag))) {
        return false;
      }
      
      // 公開範囲フィルター
      if (filterBy !== 'all' && post.visibility !== filterBy) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          const aTotal = a.reactions.like + a.reactions.empathy + a.reactions.helpful;
          const bTotal = b.reactions.like + b.reactions.empathy + b.reactions.helpful;
          return bTotal - aTotal;
        case 'views':
          return b.views - a.views;
        case 'trending':
          // 最近のリアクション数と閲覧数を重み付けして計算
          const aScore = (a.reactions.like + a.reactions.empathy + a.reactions.helpful) * 2 + a.views;
          const bScore = (b.reactions.like + b.reactions.empathy + b.reactions.helpful) * 2 + b.views;
          return bScore - aScore;
        case 'latest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const popularTags = suggestedTags.slice(0, 8);
  const totalReactions = posts.reduce((sum, post) => 
    sum + post.reactions.like + post.reactions.empathy + post.reactions.helpful, 0
  );
  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (viewMode === 'create') {
    return (
      <PostForm 
        onSubmit={handleCreatePost}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'detail' && selectedPost) {
    return (
      <PostDetail 
        post={selectedPost}
        onBack={() => setViewMode('list')}
        onReaction={handleReaction}
      />
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">

      {/* 今週の人気事例TOP3（先頭へ移動） */}
      <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-sunshine-yellow" />
          <h2 className="text-lg font-semibold text-gray-900">今週の人気事例TOP3</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts
            .sort((a, b) => {
              const aScore = a.reactions.like + a.reactions.empathy + a.reactions.helpful;
              const bScore = b.reactions.like + b.reactions.empathy + b.reactions.helpful;
              return bScore - aScore;
            })
            .slice(0, 3)
            .map((post, index) => (
              <div key={post.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-sunshine-yellow' :
                    index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{post.author.department}</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{post.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{post.reactions.like + post.reactions.empathy + post.reactions.helpful} リアクション</span>
                  <span>{post.views} 閲覧</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <MessageCircle className="w-5 h-5 text-vivid-red" />
          </div>
          <div className="text-xl font-bold text-gray-900">{posts.length}</div>
          <p className="text-sm text-gray-600">投稿事例</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 text-sunshine-yellow" />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {posts.filter(p => p.isApprovedForAI).length}
          </div>
          <p className="text-sm text-gray-600">AI学習採用</p>
        </div>
      </div>
      
      {/* 人気事例ランキング */}
      <div className="hidden bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-sunshine-yellow" />
          <h2 className="text-lg font-semibold text-gray-900">今週の人気事例TOP3</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts
            .sort((a, b) => {
              const aScore = a.reactions.like + a.reactions.empathy + a.reactions.helpful;
              const bScore = b.reactions.like + b.reactions.empathy + b.reactions.helpful;
              return bScore - aScore;
            })
            .slice(0, 3)
            .map((post, index) => (
              <div key={post.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-sunshine-yellow' : 
                    index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{post.author.department}</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{post.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{post.reactions.like + post.reactions.empathy + post.reactions.helpful} リアクション</span>
                  <span>{post.views} 閲覧</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* 検索・フィルター */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="事例を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
            >
              <option value="latest">最新順</option>
              <option value="popular">人気順</option>
              <option value="trending">トレンド順</option>
              <option value="views">閲覧数順</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="public">全社公開</option>
              <option value="department">部署限定</option>
              <option value="theme">テーマ別</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-sky-blue text-white border-sky-blue' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">人気タグで絞り込み</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-sky-blue text-white border-sky-blue'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* AI推奨事例 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-sky-blue" />
          <h3 className="font-semibold text-sky-blue">あなたにおすすめの事例</h3>
        </div>
        <p className="text-blue-700 text-sm mb-4">
          あなたのスキル診断結果に基づいて、参考になりそうな事例をAIが選びました
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0, 2).map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.situation}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{post.author.department}</span>
                  <span>•</span>
                  <span>{post.reactions.like + post.reactions.empathy + post.reactions.helpful} リアクション</span>
                </div>
                <button className="text-sky-blue hover:text-blue-600 text-sm font-medium">
                  詳細を見る
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 投稿一覧 */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            読み込み中...
          </div>
        )}
        {!loading && error && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && filteredAndSortedPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">該当する事例が見つかりません</h3>
            <p className="text-gray-600 mb-4">検索条件を変更するか、新しい事例を投稿してみましょう</p>
            <button
              onClick={() => setViewMode('create')}
              className="px-4 py-2 bg-vivid-red text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              事例を投稿する
            </button>
          </div>
        ) : (!loading && !error &&
          filteredAndSortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReaction={handleReaction}
              onClick={() => {
                setSelectedPost(post);
                setViewMode('detail');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
