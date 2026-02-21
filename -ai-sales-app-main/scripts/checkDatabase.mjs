import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehilabreyupqrivazpbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWxhYnJ5ZXVwcXJpdmF6cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzgzMzgsImV4cCI6MjA3NDk1NDMzOH0.gREb1JL26KbPie9-GSmVZ0bgFnDTsOuuLq3cGatPWfs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('=== Supabaseデータベース情報 ===\n');

  try {
    // usersテーブルのデータを取得
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('❌ usersテーブルエラー:', usersError.message);
    } else {
      console.log('✅ usersテーブル:');
      console.log(`  - レコード数: ${users?.length || 0}`);
      if (users && users.length > 0) {
        console.log('  - ユーザー一覧:');
        users.forEach((user, index) => {
          console.log(`    ${index + 1}. ${user.name} (${user.email}) - ${user.department} [${user.role}]`);
        });
      }
      console.log('');
    }

    // scenariosテーブルのデータを取得
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*');

    if (scenariosError) {
      console.log('❌ scenariosテーブル:', scenariosError.message);
    } else {
      console.log('✅ scenariosテーブル:');
      console.log(`  - レコード数: ${scenarios?.length || 0}\n`);
    }

    // learning_sessionsテーブルのデータを取得
    const { data: sessions, error: sessionsError } = await supabase
      .from('learning_sessions')
      .select('*');

    if (sessionsError) {
      console.log('❌ learning_sessionsテーブル:', sessionsError.message);
    } else {
      console.log('✅ learning_sessionsテーブル:');
      console.log(`  - レコード数: ${sessions?.length || 0}\n`);
    }

    // evaluationsテーブルのデータを取得
    const { data: evaluations, error: evaluationsError } = await supabase
      .from('evaluations')
      .select('*');

    if (evaluationsError) {
      console.log('❌ evaluationsテーブル:', evaluationsError.message);
    } else {
      console.log('✅ evaluationsテーブル:');
      console.log(`  - レコード数: ${evaluations?.length || 0}\n`);
    }

    // community_postsテーブルのデータを取得
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*');

    if (postsError) {
      console.log('❌ community_postsテーブル:', postsError.message);
    } else {
      console.log('✅ community_postsテーブル:');
      console.log(`  - レコード数: ${posts?.length || 0}\n`);
    }

    // achievementsテーブルのデータを取得
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');

    if (achievementsError) {
      console.log('❌ achievementsテーブル:', achievementsError.message);
    } else {
      console.log('✅ achievementsテーブル:');
      console.log(`  - レコード数: ${achievements?.length || 0}\n`);
    }

    console.log('=== 確認完了 ===');

  } catch (error) {
    console.error('❌ データベース接続エラー:', error);
  }
}

checkDatabase();
