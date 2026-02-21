import React, { useState } from 'react';
import { Camera, Edit3, Heart, Lightbulb, MessageCircle, Save, ThumbsUp, Users, X } from 'lucide-react';
import { mockCommunityPosts } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

interface ProfileStats {
  knowhowPosts: number;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    introduction: '店頭での会話の質を高めるために、実践を重ねています。',
    learningGoals: '提案力とコミュニケーションスキルを重点的に強化中です。'
  });

  const profileStats: ProfileStats = {
    knowhowPosts: 12
  };

  const likedPosts = mockCommunityPosts.reduce((sum, post) => sum + post.reactions.like, 0);

  const handleSaveProfile = () => {
    if (user) {
      updateUser({ name: editedProfile.name });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || '',
      introduction: '店頭での会話の質を高めるために、実践を重ねています。',
      learningGoals: '提案力とコミュニケーションスキルを重点的に強化中です。'
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">ユーザー情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'キャンセル' : '編集'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={
                    user.avatar ||
                    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                  }
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-sky-blue text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-4 text-xl font-bold text-center w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900 mt-4">{user.name}</h2>
              )}

              <p className="text-gray-600">{user.department}</p>
              <p className="text-sm text-gray-500">社員ID: EMP001</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">自己紹介</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.introduction}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, introduction: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{editedProfile.introduction}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">学習目標</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.learningGoals}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, learningGoals: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{editedProfile.learningGoals}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-success-green text-white rounded-lg hover:bg-emerald-green transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>コミュニティ貢献</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <ThumbsUp className="w-5 h-5 text-sky-blue" />
                  <Heart className="w-5 h-5 text-vivid-red" />
                  <Lightbulb className="w-5 h-5 text-sunshine-yellow" />
                </div>
                <div className="text-xl font-bold text-gray-900">{likedPosts}</div>
                <div className="text-sm text-gray-600">いいねした投稿</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MessageCircle className="w-8 h-8 text-success-green mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{profileStats.knowhowPosts}</div>
                <div className="text-sm text-gray-600">投稿ノウハウ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
