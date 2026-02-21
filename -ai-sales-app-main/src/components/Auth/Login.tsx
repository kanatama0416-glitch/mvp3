import React, { useState } from 'react';
import { AlertCircle, User } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onNavigateToSignup?: () => void;
}

const DEMO_USER = {
  email: 'tanaka@marui.co.jp',
  password: 'password123',
};

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(DEMO_USER.email, DEMO_USER.password);
      if (!success) {
        setError('ログインに失敗しました。時間をおいて再度お試しください。');
      }
    } catch (e) {
      setError('ログインに失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-sky-blue/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-vivid-red rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">まなびー</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {error && (
            <div className="flex items-center space-x-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-vivid-red" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-vivid-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                体験を開始中...
              </>
            ) : (
              'まなびーを体験する'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
