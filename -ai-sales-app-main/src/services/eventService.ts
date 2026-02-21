import { supabase } from '../lib/supabaseClient';

// ユーザーの参加イベントを取得
export async function getUserParticipatingEvents(userId: string): Promise<string[]> {
  try {
    console.log('📖 参加イベント読み込み開始 - ユーザーID:', userId);

    const { data, error } = await supabase
      .from('user_event_participation')
      .select('event_id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('❌ Get user participating events error:', error);
      return [];
    }

    const eventIds = data ? data.map(item => item.event_id) : [];
    console.log('✅ 参加イベント読み込み完了:', eventIds);

    return eventIds;
  } catch (error) {
    console.error('❌ Get user participating events failed:', error);
    return [];
  }
}

// ユーザーの参加イベントを保存（既存の参加状態をすべて更新）
export async function saveUserParticipatingEvents(
  userId: string,
  eventIds: string[]
): Promise<boolean> {
  try {
    console.log('💾 参加イベント保存開始:', { userId, eventIds });

    // 1. ユーザーの既存データをすべて削除（シンプルなアプローチ）
    const { error: deleteError } = await supabase
      .from('user_event_participation')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('❌ Delete existing events error:', deleteError);
      return false;
    }
    console.log('✅ 既存データを削除しました');

    // 2. 選択されたイベントを新規挿入
    if (eventIds.length > 0) {
      const insertData = eventIds.map(eventId => ({
        user_id: userId,
        event_id: eventId,
        is_active: true
      }));

      console.log('📝 新規データを挿入中...', insertData);

      const { error: insertError } = await supabase
        .from('user_event_participation')
        .insert(insertData);

      if (insertError) {
        console.error('❌ Insert participation error:', insertError);
        console.error('❌ エラー詳細 - コード:', insertError.code, 'メッセージ:', insertError.message, '詳細:', insertError.details);
        return false;
      }

      console.log('✅ 新規データ挿入成功');
    }

    console.log('✅ 参加イベント保存完了');
    return true;
  } catch (error) {
    console.error('❌ Save user participating events failed:', error);
    return false;
  }
}

// 単一イベントの参加状態をトグル
export async function toggleEventParticipation(
  userId: string,
  eventId: string
): Promise<boolean> {
  try {
    // 既存のレコードがあるか確認
    const { data: existing, error: checkError } = await supabase
      .from('user_event_participation')
      .select('*')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (checkError) {
      console.error('Check existing participation error:', checkError);
      return false;
    }

    if (existing) {
      // 既存レコードがある場合は is_active をトグル
      const { error: updateError } = await supabase
        .from('user_event_participation')
        .update({ is_active: !existing.is_active })
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (updateError) {
        console.error('Toggle participation error:', updateError);
        return false;
      }
    } else {
      // 新規レコードを挿入
      const { error: insertError } = await supabase
        .from('user_event_participation')
        .insert([
          {
            user_id: userId,
            event_id: eventId,
            is_active: true
          }
        ]);

      if (insertError) {
        console.error('Insert participation error:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Toggle event participation failed:', error);
    return false;
  }
}
