import { useState, useEffect } from 'react';
import * as authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'learner' | 'admin';
  avatar?: string;
  participatingEvents?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const savedUser = localStorage.getItem('ai-teacher-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('ai-teacher-user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 空欄ログインを許可する一時対応
      if (!email && !password) {
        const guestUser: User = {
          id: 'guest',
          name: 'ゲスト',
          email: '',
          department: '',
          role: 'learner'
        };

        localStorage.setItem('ai-teacher-user', JSON.stringify(guestUser));
        setAuthState({
          user: guestUser,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }

      const user = await authService.login({ email, password });

      if (user) {
        // ローカルストレージに保存
        localStorage.setItem('ai-teacher-user', JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // ローカルストレージから削除
    localStorage.removeItem('ai-teacher-user');

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateUser = async (updatedUser: Partial<User>): Promise<boolean> => {
    if (authState.user) {
      try {
        const updated = await authService.updateUser(authState.user.id, updatedUser);

        if (updated) {
          localStorage.setItem('ai-teacher-user', JSON.stringify(updated));

          setAuthState(prev => ({
            ...prev,
            user: updated
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Update user failed:', error);
        return false;
      }
    }
    return false;
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    updateUser
  };
}
