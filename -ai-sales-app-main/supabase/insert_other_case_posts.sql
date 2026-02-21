-- 「その他事例」カテゴリの投稿を追加

-- まず、ユーザーが存在するか確認
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  IF user_count = 0 THEN
    RAISE EXCEPTION 'ユーザーが存在しません。先にseed.sqlを実行してください。';
  END IF;
END $$;

-- その他事例の投稿を作成
WITH authors AS (
  SELECT id, row_number() over (order by created_at) AS rn
  FROM users
  ORDER BY created_at
  LIMIT 3
)
INSERT INTO case_posts (
  author_id, category, title, related_event_id,
  situation, approach, result, notes, tags,
  like_count, empathy_count, helpful_count, is_ai_adopted
)
SELECT
  (SELECT id FROM authors a WHERE a.rn = ((g)::int - 1) % GREATEST((SELECT COUNT(*) FROM authors),1) + 1) AS author_id,
  'other' AS category,
  CONCAT('店舗運用の成功事例 #', g) AS title,
  NULL::uuid AS related_event_id,
  '通常営業の中での声かけ設計と動線工夫により成果を得た事例' AS situation,
  '動線上の「立ち止まりポイント」を活用。悩みを引き出す一言→特典提示→同行提案。' AS approach,
  '短時間でも顧客理解に基づく提案で、興味喚起からクロージング率が上昇。' AS result,
  'チーム共有用のフレーズ集（ケース別）を作成し、朝礼で展開。' AS notes,
  ARRAY['#その他事例', '#動線設計', '#声かけ'] AS tags,
  (floor(random()*15))::int AS like_count,
  (floor(random()*12))::int AS empathy_count,
  (floor(random()*10))::int AS helpful_count,
  (random() < 0.25) AS is_ai_adopted
FROM generate_series(1,15) AS g;

-- 具体的な事例を追加
INSERT INTO case_posts (
  author_id, category, title, related_event_id,
  situation, approach, result, notes, tags,
  like_count, empathy_count, helpful_count, is_ai_adopted
)
SELECT
  (SELECT id FROM users ORDER BY created_at LIMIT 1),
  'other',
  '家族連れへの丁寧な声かけ事例',
  NULL::uuid,
  '小さなお子さま連れのお客様に対し、通路幅やベビーカーの動線に配慮しながらご案内。',
  '混雑状況を踏まえて「空いているレジのご案内」と「短時間で済むお会計方法」を提案。',
  '待ち時間の短縮により満足度が向上し、口コミにも好意的なコメントを獲得。',
  '声量や距離感に気を配り、安心感を与えるトーンを意識。',
  ARRAY['#その他事例', '#家族連れ', '#配慮接客'],
  12, 6, 4, FALSE
UNION ALL
SELECT
  (SELECT id FROM users ORDER BY created_at LIMIT 1 OFFSET 1),
  'other',
  '雨天時の傘袋配布と動線改善でクレーム削減',
  NULL::uuid,
  '入口付近が濡れて滑りやすくなっていたため、来店直後の不満が出やすい状況。',
  '傘袋を先回りで配布し、マット増設と「足元ご注意」の声かけを徹底。',
  '転倒リスク低下と導線の円滑化でクレーム件数が減少。',
  '雨量が強まる時間帯の事前共有と、清掃担当との連携を強化。',
  ARRAY['#その他事例', '#安全配慮', '#動線設計'],
  9, 5, 3, TRUE
UNION ALL
SELECT
  (SELECT id FROM users ORDER BY created_at LIMIT 1 OFFSET 2),
  'other',
  '在庫切れ時の代替提案で満足度維持',
  NULL::uuid,
  '人気商品の在庫が一時的に欠品し、購入検討者の離脱が懸念される状況。',
  '用途を丁寧にヒアリングし、近い価格帯・機能の代替品を2案提示。取り寄せ可否も同時に案内。',
  '当日の代替購入と取り寄せ予約を獲得し、機会損失を最小化。',
  '在庫更新のタイミングとEC在庫の参照手順をチームで共有。',
  ARRAY['#その他事例', '#代替提案', '#在庫対応'],
  15, 7, 5, TRUE;

-- 確認：その他事例の投稿数
SELECT
  category,
  COUNT(*) as count
FROM case_posts
GROUP BY category
ORDER BY category;
