import { supabase } from '../lib/supabaseClient';
import { getUserParticipatingEvents } from './eventService';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'learner' | 'admin';
  avatar?: string;
  participatingEvents?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  department: string;
  role?: 'learner' | 'admin';
}

// ログイン処理
export async function login(credentials: LoginCredentials): Promise<User | null> {
  try {
    // メールアドレスとパスワードでユーザーを検索
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .eq('password', credentials.password)
      .limit(1);

    if (error) {
      console.error('Login error:', error);
      return null;
    }

    if (!users || users.length === 0) {
      console.error('User not found or password incorrect');
      return null;
    }

    const user = users[0];

    // 参加イベント情報を取得
    const participatingEvents = await getUserParticipatingEvents(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      participatingEvents
    };
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

// ユーザー登録処理
export async function register(data: RegisterData): Promise<User | null> {
  try {
    // メールアドレスの重複チェック
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', data.email)
      .limit(1);

    if (checkError) {
      console.error('Email check error:', checkError);
      return null;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.error('Email already exists');
      return null;
    }

    // 新規ユーザーを作成
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name: data.name,
          email: data.email,
          password: data.password,
          department: data.department,
          role: data.role || 'learner'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return null;
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      role: newUser.role,
      avatar: newUser.avatar
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return null;
  }
}

// ユーザー情報更新
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      return null;
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      department: updatedUser.department,
      role: updatedUser.role,
      avatar: updatedUser.avatar
    };
  } catch (error) {
    console.error('Update user failed:', error);
    return null;
  }
}

// ユーザー情報取得
export async function getUser(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    // 参加イベント情報を取得
    const participatingEvents = await getUserParticipatingEvents(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      participatingEvents
    };
  } catch (error) {
    console.error('Get user failed:', error);
    return null;
  }
}
