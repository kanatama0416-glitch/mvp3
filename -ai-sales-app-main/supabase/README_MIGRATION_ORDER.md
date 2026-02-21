# データベースセットアップガイド

## エラーの原因

`learning_sessions` テーブルが存在しないエラーが発生しています。
これは、**基本スキーマがデータベースに適用されていない**ためです。

---

## ✅ 正しい実行順序

以下の順序でSupabase SQL Editorで実行してください：

### 1️⃣ **基本スキーマの作成**（必須）

```sql
-- 1. メインスキーマ（usersテーブル、learning_sessionsテーブルなど）
```
📄 ファイル: `schema.sql`

このファイルには以下のテーブルが含まれています：
- users
- scenarios
- **learning_sessions** ← これが必要！
- messages
- evaluations
- achievements
- learning_plans
- community_posts
- community_comments
- post_reactions
- growth_records

---

### 2️⃣ **拡張スキーマの作成**（推奨）

```sql
-- 2. AIシミュレーション機能
```
📄 ファイル: `simulation_schema.sql`

```sql
-- 3. イベント管理機能
```
📄 ファイル: `events_schema.sql`

```sql
-- 4. 投稿機能（追加スキーマ）
```
📄 ファイル: `posts_schema.sql`

```sql
-- 5. ユーザーイベント参加
```
📄 ファイル: `user_participating_events_schema.sql`

---

### 3️⃣ **マイグレーション（フィールド追加）**

```sql
-- 6. パスワードフィールド追加
```
📄 ファイル: `add_password.sql`

```sql
-- 7. イベントエリアフィールド追加
```
📄 ファイル: `events_area_migration.sql`

```sql
-- 8. learning_sessionsテーブル拡張
```
📄 ファイル: `learning_sessions_enhancement.sql`

---

### 4️⃣ **サンプルデータ投入**（オプション）

```sql
-- 9. ユーザーサンプルデータ
```
📄 ファイル: `seed.sql`

```sql
-- 10. シナリオサンプルデータ
```
📄 ファイル: `scenarios_seed.sql`

```sql
-- 11. シミュレーションサンプルデータ
```
📄 ファイル: `simulation_seed.sql`

```sql
-- 12. イベントサンプルデータ
```
📄 ファイル: `events_seed.sql`

```sql
-- 13. アニメゲームイベントサンプルデータ
```
📄 ファイル: `events_anime_game_seed.sql`

```sql
-- 14. 投稿サンプルデータ
```
📄 ファイル: `posts_seed.sql`

---

## 🚀 実行手順（Supabase Studio）

### ステップ1: Supabaseにログイン
1. https://app.supabase.com/ にアクセス
2. プロジェクトを選択

### ステップ2: SQL Editorを開く
1. 左メニューから **SQL Editor** を選択
2. **New query** をクリック

### ステップ3: スキーマを順番に実行

#### まず最初に必ず実行:
```sql
-- schema.sql の内容を全てコピー＆ペーストして実行
```

#### 成功を確認したら:
```sql
-- learning_sessions_enhancement.sql の内容を実行
```

---

## ⚠️ 重要な注意点

### 1. **schema.sql を最初に実行しないとエラーが出ます**
   - `learning_sessions` テーブルはここで作成されます
   - 他のテーブルも依存関係があるため順序が重要

### 2. **既存データがある場合**
   - テーブルがすでに存在する場合は `CREATE TABLE` がエラーになります
   - その場合は、既存テーブルに対してマイグレーションのみ実行

### 3. **外部キー制約**
   - 親テーブルが存在しないと子テーブルは作成できません
   - 例: `users` テーブルがないと `learning_sessions` は作れません

---

## 🔍 現在のテーブル確認方法

Supabase SQL Editorで以下を実行して、現在のテーブル一覧を確認できます：

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 📝 次のステップ

1. ✅ `schema.sql` を実行
2. ✅ テーブル作成を確認
3. ✅ `learning_sessions_enhancement.sql` を実行
4. ✅ 他の拡張スキーマを必要に応じて実行
5. ✅ サンプルデータを投入（テスト用）

---

## ❓ トラブルシューティング

### Q: テーブルがすでに存在するエラーが出る
A: そのスキーマファイルはスキップして次に進んでください

### Q: 外部キー制約エラーが出る
A: 参照先のテーブルを先に作成してください（実行順序を確認）

### Q: カラムがすでに存在するエラーが出る
A: `IF NOT EXISTS` が付いている場合は問題ありません（スキップされます）
