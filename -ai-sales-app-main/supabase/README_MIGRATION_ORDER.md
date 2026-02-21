# データベースセットアップガイド

## 🚀 かんたんセットアップ（推奨）

**`setup.sql` を Supabase SQL Editor にコピペして実行するだけ！**

📄 ファイル: **`setup.sql`**

このファイル1つに以下がすべて含まれています：

| 内容 | テーブル |
|------|---------|
| 基本スキーマ | users, scenarios, learning_sessions, messages, evaluations, achievements, learning_plans, community_posts, community_comments, post_reactions, growth_records |
| シミュレーション機能 | simulation_scenarios, customer_roleplay, user_learning_history, simulation_feedback, learning_materials, scenario_steps, simulation_conversation_logs |
| イベント管理 | events, user_event_participation, event_best_practices, event_metrics, event_stores |
| 投稿機能 | case_posts |
| イベント知識ベース | event_knowledge_base |
| マイグレーション | password カラム追加、area カラム追加、learning_sessions 拡張 |
| RLSポリシー | 全テーブルの Row Level Security 設定 |
| サンプルデータ | デモユーザー3名、シナリオ8件、イベント9件 |

### 手順

1. https://app.supabase.com/ にログイン → プロジェクトを選択
2. 左メニューから **SQL Editor** → **New query**
3. **`setup.sql`** の内容を全てコピー＆ペースト
4. **Run** ボタンをクリック
5. 完了！ 🎉

> ⚠️ すべて `IF NOT EXISTS` 付きなので、既にテーブルがある場合も安全に再実行できます。

---

## 🔍 セットアップ後の確認

Supabase SQL Editorで以下を実行して、テーブル一覧を確認できます：

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 📁 個別ファイルで実行する場合（上級者向け）

`setup.sql` を使わず個別に実行したい場合は、以下の順序で実行してください。
**順序を間違えると外部キーエラーが出ます。**

### 1️⃣ 基本スキーマ（必須）
| 順番 | ファイル | 内容 |
|------|---------|------|
| 1 | `schema.sql` | users, scenarios, learning_sessions 等の基本テーブル |

### 2️⃣ 拡張スキーマ（推奨）
| 順番 | ファイル | 内容 |
|------|---------|------|
| 2 | `simulation_schema.sql` | AIシミュレーション機能 |
| 3 | `events_schema.sql` | イベント管理機能 |
| 4 | `posts_schema.sql` | 投稿機能（case_posts） |
| 5 | `user_participating_events_schema.sql` | ユーザーイベント参加 |
| 6 | `create_event_knowledge_base.sql` | イベント知識ベース |

### 3️⃣ マイグレーション
| 順番 | ファイル | 内容 |
|------|---------|------|
| 7 | `add_password.sql` | パスワードカラム追加 |
| 8 | `events_area_migration.sql` | イベント area カラム追加 |
| 9 | `learning_sessions_enhancement.sql` | learning_sessions 拡張 |

### 4️⃣ RLSポリシー修正
| 順番 | ファイル | 内容 |
|------|---------|------|
| 10 | `create_knowhow_posts.sql` | case_posts の RLS 設定 |

### 5️⃣ サンプルデータ（オプション）
| 順番 | ファイル | 内容 |
|------|---------|------|
| 11 | `seed.sql` | デモユーザー |
| 12 | `scenarios_seed.sql` | 学習シナリオ |
| 13 | `simulation_seed.sql` | シミュレーションデータ |
| 14 | `events_seed.sql` | イベントデータ |
| 15 | `posts_seed.sql` | 投稿データ |

---

## ❓ トラブルシューティング

### Q: `relation "users" does not exist` エラーが出る
A: **`setup.sql` を使ってください。** 個別ファイルの場合は `schema.sql` を最初に実行してください。

### Q: テーブルがすでに存在するエラーが出る
A: `setup.sql` は `IF NOT EXISTS` 付きなので安全に再実行できます。個別ファイルの場合はスキップして次に進んでください。

### Q: 外部キー制約エラーが出る
A: ファイルの実行順序を確認してください。親テーブルを先に作成する必要があります。
