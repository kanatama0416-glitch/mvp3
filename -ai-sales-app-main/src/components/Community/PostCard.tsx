import React from 'react';
import { 
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
  ChevronRight
} from 'lucide-react';
import { CommunityPost } from '../../types';

interface PostCardProps {
  post: CommunityPost;
  onReaction: (postId: string, reactionType: 'like' | 'empathy' | 'helpful') => void;
  onClick: () => void;
}

export default function PostCard({ post, onReaction, onClick }: PostCardProps) {
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
  
  const totalReactions = post.reactions.like + post.reactions.empathy + post.reactions.helpful;
  
  const handleReactionClick = (e: React.MouseEvent, reactionType: 'like' | 'empathy' | 'helpful') => {
    e.stopPropagation();
    onReaction(post.id, reactionType);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-sm text-gray-600">{post.author.department}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${visibilityInfo.color}`}>
            <VisibilityIcon className="w-3 h-3" />
            <span>{visibilityInfo.label}</span>
          </span>
          {post.isApprovedForAI && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
              <Sparkles className="w-3 h-3" />
              <span>AI学習採用</span>
            </span>
          )}
          {/* 新着マーク */}
          {new Date().getTime() - post.createdAt.getTime() < 24 * 60 * 60 * 1000 && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-vivid-red">
              <span>NEW</span>
            </span>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
      {/* タイトル */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-sky-blue transition-colors">
        {post.title}
      </h3>
      
      {/* AI要約 */}
      {post.aiSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-sky-blue mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-sky-blue mb-1">AI要約</div>
              <p className="text-sm text-blue-700">{post.aiSummary}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 内容プレビュー */}
      <div className="space-y-2 mb-4">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">状況</span>
          <p className="text-sm text-gray-700 line-clamp-2">{post.situation}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">工夫</span>
          <p className="text-sm text-gray-700 line-clamp-2">{post.innovation}</p>
        </div>
      </div>
      
      {/* タグ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.slice(0, 4).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
        {post.tags.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
            +{post.tags.length - 4}個
          </span>
        )}
      </div>
      
      {/* フッター */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {/* リアクションボタン */}
          <button
            onClick={(e) => handleReactionClick(e, 'like')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors ${
              post.userReaction === 'like'
                ? 'bg-blue-100 text-sky-blue'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.reactions.like}</span>
          </button>
          
          <button
            onClick={(e) => handleReactionClick(e, 'empathy')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors ${
              post.userReaction === 'empathy'
                ? 'bg-red-100 text-vivid-red'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{post.reactions.empathy}</span>
          </button>
          
          <button
            onClick={(e) => handleReactionClick(e, 'helpful')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors ${
              post.userReaction === 'helpful'
                ? 'bg-yellow-100 text-sunshine-yellow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{post.reactions.helpful}</span>
          </button>
          
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{post.createdAt.toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}