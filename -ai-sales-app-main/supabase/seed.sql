-- デモユーザーを追加
INSERT INTO users (name, email, department, role, avatar) VALUES
  ('田中 太郎', 'tanaka@marui.co.jp', 'カード口コミ部', 'learner', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
  ('佐藤 花子', 'sato@marui.co.jp', 'アニメイト渋谷店', 'learner', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
  ('管理者', 'admin@marui.co.jp', '本部', 'admin', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop')
ON CONFLICT (email) DO NOTHING;
