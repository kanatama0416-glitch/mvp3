import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, Building2, Mail, ArrowLeft } from 'lucide-react';

interface SignupProps {
  onSignup: (name: string, email: string, password: string, department: string) => Promise<boolean>;
  onBackToLogin: () => void;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
}

const departments = [
  '丸井新宿本店',
  '丸井渋谷店',
  '丸井池袋店',
  '丸井有楽町店',
  '丸井上野店',
  '丸井北千住店',
  '丸井錦糸町店',
  '丸井吉祥寺店',
  '丸井中野店',
  '丸井国分寺店',
  'マルイシティ横浜',
  'マルイファミリー溝口',
  'マルイシティ大宮',
  '静岡マルイ',
  '草加マルイ',
  '本部',
  'その他'
];

export default function Signup({ onSignup, onBackToLogin }: SignupProps) {
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('名前を入力してください');
      return false;
    }

    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('有効なメールアドレスを入力してください');
      return false;
    }

    if (!formData.password) {
      setError('パスワードを入力してください');
      return false;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return false;
    }

    if (!formData.department) {
      setError('部署を選択してください');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onSignup(
        formData.name,
        formData.email,
        formData.password,
        formData.department
      );

      if (!success) {
        setError('アカウント作成に失敗しました。メールアドレスが既に登録されている可能性があります。');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('アカウント作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-sky-blue/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-vivid-red rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">まなびー</h1>
          <p className="text-gray-600">新規アカウント作成</p>
        </div>

        {/* 新規登録フォーム */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 名前 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                名前 <span className="text-vivid-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="田中 太郎"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                メールアドレス <span className="text-vivid-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your-email@marui.co.jp"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 部署 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                部署 <span className="text-vivid-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent appearance-none"
                  disabled={isLoading}
                >
                  <option value="">部署を選択してください</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                パスワード <span className="text-vivid-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="6文字以上"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* パスワード確認 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                パスワード（確認） <span className="text-vivid-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="パスワードを再入力"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-vivid-red" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-vivid-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  登録中...
                </>
              ) : (
                'アカウントを作成'
              )}
            </button>
          </form>

          {/* ログインに戻る */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onBackToLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 text-gray-700 hover:text-sky-blue transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ログインに戻る
            </button>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 丸井グループ まなびー
          </p>
        </div>
      </div>
    </div>
  );
}
