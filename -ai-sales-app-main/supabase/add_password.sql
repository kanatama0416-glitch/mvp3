-- usersテーブルにpasswordカラムを追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- 既存のユーザーにパスワードを設定
UPDATE users SET password = 'password123' WHERE email = 'tanaka@marui.co.jp';
UPDATE users SET password = 'password123' WHERE email = 'sato@marui.co.jp';
UPDATE users SET password = 'admin123' WHERE email = 'admin@marui.co.jp';
