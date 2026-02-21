import { supabase } from '../src/lib/supabaseClient';

async function checkDatabase() {
  console.log('=== Supabaseデータベース情報 ===\n');

  try {
    // usersテーブルのデータを取得
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('usersテーブルエラー:', usersError);
    } else {
      console.log('📊 usersテーブル:');
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
      console.log('📊 scenariosテーブル: エラーまたは未作成');
    } else {
      console.log('📊 scenariosテーブル:');
      console.log(`  - レコード数: ${scenarios?.length || 0}\n`);
    }

    // learning_sessionsテーブルのデータを取得
    const { data: sessions, error: sessionsError } = await supabase
      .from('learning_sessions')
      .select('*');

    if (sessionsError) {
      console.log('📊 learning_sessionsテーブル: エラーまたは未作成');
    } else {
      console.log('📊 learning_sessionsテーブル:');
      console.log(`  - レコード数: ${sessions?.length || 0}\n`);
    }

    // evaluationsテーブルのデータを取得
    const { data: evaluations, error: evaluationsError } = await supabase
      .from('evaluations')
      .select('*');

    if (evaluationsError) {
      console.log('📊 evaluationsテーブル: エラーまたは未作成');
    } else {
      console.log('📊 evaluationsテーブル:');
      console.log(`  - レコード数: ${evaluations?.length || 0}\n`);
    }

    // community_postsテーブルのデータを取得
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*');

    if (postsError) {
      console.log('📊 community_postsテーブル: エラーまたは未作成');
    } else {
      console.log('📊 community_postsテーブル:');
      console.log(`  - レコード数: ${posts?.length || 0}\n`);
    }

  } catch (error) {
    console.error('データベース接続エラー:', error);
  }
}

checkDatabase();
