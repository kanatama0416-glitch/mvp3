import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // 開発者向けの注意喚起。ユーザー画面には表示されません。
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_URL/ANON_KEY が未設定です。envとVite再起動を確認してください。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
