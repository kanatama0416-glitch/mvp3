import React, { useState } from 'react';
import { ArrowLeft, Tag, Globe, Building, Users, Sparkles, AlertCircle, Zap, Shield } from 'lucide-react';
import { suggestedTags, departments, themes } from '../../data/mockData';
import { PostForm as PostFormType } from '../../types';

interface PostFormProps {
  onSubmit: (data: PostFormType) => void;
  onCancel: () => void;
}

export default function PostForm({ onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormType>({
    title: '',
    situation: '',
    innovation: '',
    result: '',
    learning: '',
    tags: [],
    visibility: 'public'
  });
  
  const [customTag, setCustomTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const handleInputChange = (field: keyof PostFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // AIによるタグ自動提案のシミュレーション
    if (field === 'title' || field === 'situation' || field === 'innovation') {
      setTimeout(() => {
        const suggestions = [];
        if (value.includes('アニメ') || value.includes('イベント')) {
          suggestions.push('#アニメファン', '#イベント対応');
        }
        if (value.includes('断り') || value.includes('拒否')) {
          suggestions.push('#断り対応', '#感情コントロール');
        }
        if (value.includes('シニア') || value.includes('年配')) {
          suggestions.push('#シニア層', '#丁寧対応');
        }
        setAiSuggestions(suggestions);
      }, 500);
    }
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 8) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setCustomTag('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'タイトルは必須です';
    if (!formData.situation.trim()) newErrors.situation = '状況の説明は必須です';
    if (!formData.innovation.trim()) newErrors.innovation = '工夫したことは必須です';
    if (!formData.result.trim()) newErrors.result = '結果の説明は必須です';
    if (!formData.learning.trim()) newErrors.learning = '学び・気づきは必須です';
    if (formData.tags.length === 0) newErrors.tags = '最低1つのタグを選択してください';
    
    if (formData.visibility === 'department' && !formData.targetDepartment) {
      newErrors.targetDepartment = '部署を選択してください';
    }
    if (formData.visibility === 'theme' && !formData.targetTheme) {
      newErrors.targetTheme = 'テーマを選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'department': return <Building className="w-4 h-4" />;
      case 'theme': return <Users className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const filteredSuggestions = suggestedTags.filter(tag => 
    tag.toLowerCase().includes(customTag.toLowerCase()) &&
    !formData.tags.includes(tag)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">成功事例を投稿</h1>
          <p className="text-gray-600 mt-1">あなたの接客成功体験を仲間と共有しましょう</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-sky-blue mt-0.5" />
          <div>
            <h3 className="font-medium text-sky-blue mb-1">AI学習データとして活用</h3>
            <p className="text-sm text-blue-700">
              投稿された事例は管理者承認後、AI学習データとして活用され、
              より良い学習コンテンツの作成に貢献します。
            </p>
          </div>
        </div>
      </div>

      {/* AI自動チェック */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-success-green mt-0.5" />
          <div>
            <h3 className="font-medium text-success-green mb-1">AIによる自動チェック</h3>
            <p className="text-sm text-green-700">
              投稿内容は自動で個人情報チェックを行い、適切でない内容は投稿前にお知らせします。
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              タイトル <span className="text-vivid-red">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="例：アニメファンのお客様への効果的なカード口コミ"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* 状況 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              状況（顧客属性・場面） <span className="text-vivid-red">*</span>
            </label>
            <textarea
              value={formData.situation}
              onChange={(e) => handleInputChange('situation', e.target.value)}
              placeholder="例：20代男性、アニメイベントでグッズ購入、初回来店"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                errors.situation ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            {errors.situation && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.situation}</span>
              </p>
            )}
          </div>

          {/* 工夫したこと */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              工夫したこと（接客上の工夫・意識点） <span className="text-vivid-red">*</span>
            </label>
            <textarea
              value={formData.innovation}
              onChange={(e) => handleInputChange('innovation', e.target.value)}
              placeholder="例：お客様の好きなアニメ作品について会話を始め、そのアニメの関連商品でポイントが貯まることを具体例で説明"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                errors.innovation ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={1000}
            />
            {errors.innovation && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.innovation}</span>
              </p>
            )}
          </div>

          {/* 結果 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              結果（顧客反応・成果） <span className="text-vivid-red">*</span>
            </label>
            <textarea
              value={formData.result}
              onChange={(e) => handleInputChange('result', e.target.value)}
              placeholder="例：お客様が興味を示し、「次回のイベントでも使えますね」と前向きな反応。その場でカード申込み"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                errors.result ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            {errors.result && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.result}</span>
              </p>
            )}
          </div>

          {/* 学び・気づき */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              学び・気づき（得られた教訓） <span className="text-vivid-red">*</span>
            </label>
            <textarea
              value={formData.learning}
              onChange={(e) => handleInputChange('learning', e.target.value)}
              placeholder="例：お客様の趣味に寄り添った具体例を示すことで、カードの価値を実感してもらえる"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                errors.learning ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            {errors.learning && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.learning}</span>
              </p>
            )}
          </div>
        </div>

        {/* タグ設定 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            タグ <span className="text-vivid-red">*</span>
            <span className="text-xs text-gray-500 ml-2">（最大8個まで）</span>
          </label>
          
          {/* AI提案タグ */}
          {aiSuggestions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-sky-blue" />
                <span className="text-sm font-medium text-sky-blue">AI提案タグ</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="px-3 py-1 bg-sky-blue text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* 選択済みタグ */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-sky-blue text-white text-sm rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* タグ入力 */}
          <div className="relative">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onFocus={() => setShowTagSuggestions(true)}
              placeholder="タグを入力または選択..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (customTag.trim() && !customTag.startsWith('#')) {
                    addTag('#' + customTag.trim());
                  } else if (customTag.trim()) {
                    addTag(customTag.trim());
                  }
                }
              }}
            />
            
            {/* タグ候補 */}
            {showTagSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      {tag}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    候補がありません
                  </div>
                )}
              </div>
            )}
          </div>
          
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.tags}</span>
            </p>
          )}
        </div>

        {/* 公開範囲設定 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            公開範囲 <span className="text-vivid-red">*</span>
          </label>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === 'public'}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="text-sky-blue focus:ring-sky-blue"
              />
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">全社オープン</div>
                <div className="text-sm text-gray-600">すべての社員が閲覧可能</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="visibility"
                value="department"
                checked={formData.visibility === 'department'}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="text-sky-blue focus:ring-sky-blue"
              />
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">部署限定</div>
                <div className="text-sm text-gray-600">指定した部署のメンバーのみ</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="visibility"
                value="theme"
                checked={formData.visibility === 'theme'}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="text-sky-blue focus:ring-sky-blue"
              />
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">テーマ別コミュニティ</div>
                <div className="text-sm text-gray-600">特定のテーマに興味のあるメンバー</div>
              </div>
            </label>
          </div>
          
          {/* 部署選択 */}
          {formData.visibility === 'department' && (
            <div className="mt-4">
              <select
                value={formData.targetDepartment || ''}
                onChange={(e) => handleInputChange('targetDepartment', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                  errors.targetDepartment ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">部署を選択してください</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.targetDepartment && (
                <p className="mt-1 text-sm text-red-600">{errors.targetDepartment}</p>
              )}
            </div>
          )}
          
          {/* テーマ選択 */}
          {formData.visibility === 'theme' && (
            <div className="mt-4">
              <select
                value={formData.targetTheme || ''}
                onChange={(e) => handleInputChange('targetTheme', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent ${
                  errors.targetTheme ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">テーマを選択してください</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
              {errors.targetTheme && (
                <p className="mt-1 text-sm text-red-600">{errors.targetTheme}</p>
              )}
            </div>
          )}
        </div>

        {/* プライバシー確認 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="mt-1 text-sky-blue focus:ring-sky-blue"
            />
            <div className="text-sm text-gray-700">
              <span className="font-medium">プライバシーポリシーに同意します</span>
              <p className="text-xs text-gray-500 mt-1">
                投稿内容にお客様の個人情報（名前、連絡先等）が含まれていないことを確認しました。
                投稿はAI学習データとして活用される場合があります。
              </p>
            </div>
          </label>
        </div>

        {/* 送信ボタン */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!privacyChecked}
            className="flex-1 px-6 py-3 bg-vivid-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}