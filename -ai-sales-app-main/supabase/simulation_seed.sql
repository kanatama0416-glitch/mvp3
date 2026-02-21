-- ========================================
-- AIシミュレーション用サンプルデータ
-- ========================================

-- 1. シナリオ情報のサンプルデータ
INSERT INTO simulation_scenarios (title, description, difficulty, category, customer_type, objectives, duration, icon, total_steps, step_structure, reference_materials) VALUES
(
  'クレーム対応：商品不良',
  '商品不良によるクレームへの対応シナリオです。顧客の不満を受け止め、適切な解決策を提示する練習をします。',
  'beginner',
  'クレーム対応',
  '不満を持つ顧客',
  ARRAY['顧客の不満を傾聴する', '適切な謝罪を行う', '解決策を提案する', '顧客満足を得る'],
  15,
  'alert',
  5,
  '{"steps": [
    {"step": 1, "objective": "顧客の状況を確認する"},
    {"step": 2, "objective": "不満の内容を傾聴する"},
    {"step": 3, "objective": "誠実に謝罪する"},
    {"step": 4, "objective": "解決策を提示する"},
    {"step": 5, "objective": "顧客の了承を得る"}
  ]}'::jsonb,
  '{"materials": [
    {"type": "video", "title": "クレーム対応の基本", "url": "/materials/video/complaint-basics"},
    {"type": "case_study", "title": "成功事例：商品不良への対応", "url": "/community/posts/123"}
  ]}'::jsonb
),
(
  'カード入会案内',
  'エポスカードへの入会を提案するシナリオです。カードのメリットを分かりやすく説明し、顧客の疑問に答える練習をします。',
  'intermediate',
  '接客・販売',
  '購入を検討している顧客',
  ARRAY['カードのメリットを説明する', '顧客の疑問に答える', '入会を促進する'],
  20,
  'card',
  5,
  '{"steps": [
    {"step": 1, "objective": "カードの基本メリットを説明"},
    {"step": 2, "objective": "顧客のニーズを確認"},
    {"step": 3, "objective": "具体的な特典を紹介"},
    {"step": 4, "objective": "疑問や不安に答える"},
    {"step": 5, "objective": "入会を促す"}
  ]}'::jsonb,
  '{"materials": [
    {"type": "document", "title": "エポスカード完全ガイド", "url": "/materials/doc/epos-guide"},
    {"type": "audio", "title": "カード説明の成功パターン", "url": "/materials/audio/card-patterns"}
  ]}'::jsonb
),
(
  '難しい質問への対応',
  '専門的な質問にも適切に答えるシナリオです。知識を活用し、分かりやすく説明する技術を身につけます。',
  'advanced',
  'クレーム対応',
  '専門的な質問をする顧客',
  ARRAY['専門知識を活用する', '分かりやすく説明する', '信頼関係を構築する'],
  25,
  'message',
  5,
  '{"steps": [
    {"step": 1, "objective": "質問内容を正確に理解する"},
    {"step": 2, "objective": "専門知識を分かりやすく説明"},
    {"step": 3, "objective": "具体例を示す"},
    {"step": 4, "objective": "理解度を確認する"},
    {"step": 5, "objective": "追加の質問に答える"}
  ]}'::jsonb,
  '{"materials": [
    {"type": "article", "title": "専門用語を分かりやすく説明する技術", "url": "/materials/article/technical-explanation"}
  ]}'::jsonb
);

-- 2. 顧客ロールプレイ情報のサンプルデータ
INSERT INTO customer_roleplay (scenario_id, character_name, character_attributes, initial_message, emotion_label, scenario_branches, success_conditions, failure_conditions)
SELECT
  id,
  '田中さん',
  '{"age_group": "30代", "gender": "男性", "attitude": "怒っている", "personality": "直球タイプ"}'::jsonb,
  'すみません。先日購入した商品なんですが、家に帰って開けてみたら不良品でした。どうしてくれるんですか？',
  'angry',
  '{"branches": [
    {
      "condition": "謝罪あり",
      "response": "そうですか...まあ、謝ってくれるのは分かりました。で、どう対応してもらえるんですか？"
    },
    {
      "condition": "謝罪なし",
      "response": "ちょっと待ってください。謝罪もないんですか？こちらは困っているんですよ。"
    },
    {
      "condition": "解決策提示",
      "response": "分かりました。それなら安心しました。ありがとうございます。"
    }
  ]}'::jsonb,
  '{"conditions": ["謝罪の言葉がある", "解決策が明確", "顧客の気持ちを受け止める発言がある"]}'::jsonb,
  '{"conditions": ["謝罪がない", "責任転嫁する発言", "顧客を責める発言"]}'::jsonb
FROM simulation_scenarios
WHERE title = 'クレーム対応：商品不良';

INSERT INTO customer_roleplay (scenario_id, character_name, character_attributes, initial_message, emotion_label, scenario_branches, success_conditions, failure_conditions)
SELECT
  id,
  '佐藤さん',
  '{"age_group": "20代", "gender": "女性", "attitude": "フレンドリー", "personality": "慎重派"}'::jsonb,
  'すみません、エポスカードって実際どうなんですか？よく分からなくて...',
  'neutral',
  '{"branches": [
    {
      "condition": "メリット説明",
      "response": "なるほど、そういうメリットがあるんですね。でも、年会費とかかかりますか？"
    },
    {
      "condition": "具体例提示",
      "response": "それは良いですね！私もよく使うので助かりそうです。"
    },
    {
      "condition": "押し売り感",
      "response": "うーん、ちょっと考えさせてください..."
    }
  ]}'::jsonb,
  '{"conditions": ["メリットを具体的に説明", "顧客のニーズに合わせた提案", "疑問に丁寧に回答"]}'::jsonb,
  '{"conditions": ["押し売り感がある", "一方的な説明", "顧客の質問を無視"]}'::jsonb
FROM simulation_scenarios
WHERE title = 'カード入会案内';

-- 3. シナリオステップ詳細のサンプルデータ
INSERT INTO scenario_steps (scenario_id, step_number, step_title, ai_message, expected_keywords, success_patterns, feedback_criteria, hints)
SELECT
  id,
  1,
  '顧客の状況確認',
  'すみません。先日購入した商品なんですが、家に帰って開けてみたら不良品でした。どうしてくれるんですか？',
  ARRAY['申し訳ございません', 'ご迷惑', 'お聞かせ', '詳しく'],
  ARRAY['まず謝罪をする', '詳細を聞く姿勢を示す'],
  '{"empathy": {"weight": 30, "keywords": ["申し訳", "ご迷惑", "お気持ち"]}, "listening": {"weight": 30, "keywords": ["お聞かせ", "詳しく", "状況"]}, "tone": {"weight": 40, "polite_level": "丁寧"}}'::jsonb,
  ARRAY['まずは謝罪の言葉から始めましょう', '顧客の状況を詳しく聞く姿勢を示しましょう']
FROM simulation_scenarios
WHERE title = 'クレーム対応：商品不良';

INSERT INTO scenario_steps (scenario_id, step_number, step_title, ai_message, expected_keywords, success_patterns, feedback_criteria, hints)
SELECT
  id,
  2,
  '不満の傾聴',
  '開けてみたら、商品が壊れていたんです。これじゃあ使えないじゃないですか。',
  ARRAY['おつらい', 'ご不便', '確認', '状況'],
  ARRAY['共感を示す', '具体的な状況を確認する'],
  '{"empathy": {"weight": 40, "keywords": ["おつらい", "ご不便", "申し訳"]}, "clarification": {"weight": 30, "keywords": ["確認", "状況", "詳しく"]}, "tone": {"weight": 30, "polite_level": "丁寧"}}'::jsonb,
  ARRAY['顧客の気持ちに共感しましょう', '具体的にどう壊れているか確認しましょう']
FROM simulation_scenarios
WHERE title = 'クレーム対応：商品不良';

-- 4. 教材リンク・関連情報のサンプルデータ
INSERT INTO learning_materials (material_type, title, description, url, thumbnail_url, related_scenario_ids, recommended_timing, tags, difficulty, duration, view_count) VALUES
(
  'video',
  'クレーム対応の基本テクニック',
  'クレーム対応の基本的な流れと注意点を5分で学べる動画です',
  '/materials/video/complaint-basics',
  '/thumbnails/complaint-basics.jpg',
  ARRAY[(SELECT id FROM simulation_scenarios WHERE title = 'クレーム対応：商品不良')],
  'before_practice',
  ARRAY['クレーム対応', '基本', '初心者向け'],
  'beginner',
  5,
  1234
),
(
  'audio',
  'カード説明の成功パターン音声集',
  '実際の成功事例の音声を聞いて、効果的な説明方法を学びます',
  '/materials/audio/card-patterns',
  '/thumbnails/card-patterns.jpg',
  ARRAY[(SELECT id FROM simulation_scenarios WHERE title = 'カード入会案内')],
  'before_practice',
  ARRAY['カード口コミ', '事例', '音声'],
  'intermediate',
  10,
  856
),
(
  'case_study',
  '成功事例：怒っているお客様への対応',
  'コミュニティで共有された実際の成功事例です',
  '/community/posts/123',
  NULL,
  ARRAY[(SELECT id FROM simulation_scenarios WHERE title = 'クレーム対応：商品不良')],
  'after_practice',
  ARRAY['クレーム対応', '成功事例', '実践'],
  'beginner',
  3,
  2341
),
(
  'document',
  'エポスカード完全ガイド',
  'エポスカードの特典、ポイント制度、提携店舗などを網羅したガイドです',
  '/materials/doc/epos-guide',
  '/thumbnails/epos-guide.jpg',
  ARRAY[(SELECT id FROM simulation_scenarios WHERE title = 'カード入会案内')],
  'review',
  ARRAY['カード知識', '特典', 'ポイント'],
  'intermediate',
  15,
  3456
),
(
  'article',
  '専門用語を分かりやすく説明する技術',
  '難しい内容を誰にでも分かるように説明するコツを学びます',
  '/materials/article/technical-explanation',
  NULL,
  ARRAY[(SELECT id FROM simulation_scenarios WHERE title = '難しい質問への対応')],
  'before_practice',
  ARRAY['説明技術', '専門知識', 'コミュニケーション'],
  'advanced',
  8,
  1892
);

-- インデックスとビューの作成
CREATE INDEX IF NOT EXISTS idx_simulation_scenarios_created_at ON simulation_scenarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_started_at ON user_learning_history(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_materials_view_count ON learning_materials(view_count DESC);

-- 便利なビュー：シナリオと関連情報の統合ビュー
CREATE OR REPLACE VIEW scenario_with_details AS
SELECT
  s.id,
  s.title,
  s.description,
  s.difficulty,
  s.category,
  s.customer_type,
  s.objectives,
  s.duration,
  s.icon,
  s.total_steps,
  s.step_structure,
  s.reference_materials,
  c.character_name,
  c.character_attributes,
  c.initial_message,
  c.emotion_label,
  COUNT(DISTINCT lm.id) as related_materials_count,
  COUNT(DISTINCT ss.id) as step_count
FROM simulation_scenarios s
LEFT JOIN customer_roleplay c ON s.id = c.scenario_id
LEFT JOIN learning_materials lm ON s.id = ANY(lm.related_scenario_ids)
LEFT JOIN scenario_steps ss ON s.id = ss.scenario_id
GROUP BY s.id, c.id;
