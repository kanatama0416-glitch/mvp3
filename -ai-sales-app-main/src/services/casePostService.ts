import { supabase } from '../lib/supabaseClient';
import { CommunityPost } from '../types';

type CommunityPostRow = {
  id: string;
  author_id: string;
  title: string;
  situation: string;
  innovation: string;
  result: string;
  learning: string;
  tags: string[];
  visibility: string;
  target_department: string | null;
  target_theme: string | null;
  like_count: number;
  empathy_count: number;
  helpful_count: number;
  views: number;
  ai_summary: string | null;
  is_approved_for_ai: boolean | null;
  created_at: string;
};

type UserRow = {
  id: string;
  name: string;
  department: string;
  avatar?: string | null;
};

export async function fetchOtherCasePosts(): Promise<CommunityPost[]> {
  // 1) Fetch posts from community_posts
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<CommunityPostRow[]>();

  if (error) {
    console.error('Failed to fetch community_posts:', error.message, 'code:', error.code, 'details:', error.details);
    throw new Error(error.message || 'fetchOtherCasePosts failed');
  }

  if (!posts || posts.length === 0) {
    // 空配列はそのまま返却（UIで0件表示）
    return [];
  }

  const authorIds = Array.from(new Set((posts || []).map(p => p.author_id))).filter(Boolean);

  // 2) Fetch authors for the posts
  let usersById = new Map<string, UserRow>();
  if (authorIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id,name,department,avatar')
      .in('id', authorIds)
      .returns<UserRow[]>();

    if (usersError) {
      console.error('Failed to fetch users for community_posts:', usersError.message);
    } else if (users) {
      for (const u of users) usersById.set(u.id, u);
    }
  }

  // 3) Map DB rows to CommunityPost type used by UI
  return (posts || []).map<CommunityPost>((p) => {
    const u = usersById.get(p.author_id);
    return {
      id: p.id,
      title: p.title,
      situation: p.situation,
      innovation: p.innovation,
      result: p.result,
      learning: p.learning,
      tags: Array.isArray(p.tags) ? p.tags : [],
      author: {
        name: u?.name || '不明なユーザー',
        department: u?.department || '不明な部署',
        avatar: u?.avatar || 'https://placehold.co/80x80'
      },
      visibility: (p.visibility as 'public' | 'department' | 'theme') || 'public',
      eventId: undefined,
      reactions: {
        like: p.like_count ?? 0,
        empathy: p.empathy_count ?? 0,
        helpful: p.helpful_count ?? 0
      },
      comments: [],
      views: p.views ?? 0,
      createdAt: new Date(p.created_at),
      aiSummary: p.ai_summary || undefined,
      isApprovedForAI: Boolean(p.is_approved_for_ai)
    };
  });
}

export async function createOtherCasePost(params: {
  authorId: string;
  title: string;
  eventName?: string;
  hook: string;
  pitch: string;
  card: string;
  memo: string;
  tags: string[];
}): Promise<boolean> {
  const { authorId, title, eventName, hook, pitch, card, memo, tags } = params;
  const payload: Record<string, unknown> = {
    author_id: authorId,
    category: 'other',
    title,
    situation: hook,
    approach: pitch,
    result: card,
    notes: memo || null,
    tags,
  };
  if (eventName) {
    payload['event_title'] = eventName;
  }

  const { error } = await supabase
    .from('case_posts')
    .insert([payload]);

  if (error) {
    console.error('Failed to insert other case post:', error.message, 'code:', error.code, 'details:', error.details);
    return false;
  }
  return true;
}

export type RawCasePost = {
  id: string;
  author_id: string;
  title: string;
  event_title: string | null;
  situation: string;
  approach: string;
  result: string;
  notes: string | null;
  tags: string[];
  like_count: number;
  helpful_count: number;
  created_at: string;
};

export async function fetchRawCasePosts(): Promise<RawCasePost[]> {
  const { data, error } = await supabase
    .from('case_posts')
    .select('id,author_id,title,event_title,situation,approach,result,notes,tags,like_count,helpful_count,created_at')
    .eq('category', 'other')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchRawCasePosts error:', error);
    return [];
  }
  return (data as RawCasePost[]) || [];
}

export async function fetchFavoriteEventPosts(params?: {
  sinceDays?: number;
}): Promise<CommunityPost[]> {
  const sinceDays = params?.sinceDays ?? 7;
  const sinceIso = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

  let { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .returns<CommunityPostRow[]>();

  if (error) {
    console.error('Failed to fetch community_posts:', error.message, 'code:', error.code, 'details:', error.details);
    throw new Error(error.message || 'fetchFavoriteEventPosts failed');
  }

  // fallback: if no posts in recent window, fetch without date filter
  if (!posts || posts.length === 0) {
    const res = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<CommunityPostRow[]>();
    if (!res.error) posts = res.data || [];
  }

  const authorIds = Array.from(new Set((posts || []).map(p => p.author_id))).filter(Boolean);
  let usersById = new Map<string, UserRow>();
  if (authorIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id,name,department,avatar')
      .in('id', authorIds)
      .returns<UserRow[]>();
    if (!usersError && users) for (const u of users) usersById.set(u.id, u);
  }

  return (posts || []).map<CommunityPost>((p) => {
    const u = usersById.get(p.author_id);
    return {
      id: p.id,
      title: p.title,
      situation: p.situation,
      innovation: p.innovation,
      result: p.result,
      learning: p.learning,
      tags: Array.isArray(p.tags) ? p.tags : [],
      author: {
        name: u?.name || '不明なユーザー',
        department: u?.department || '不明な部署',
        avatar: u?.avatar || 'https://placehold.co/80x80'
      },
      visibility: (p.visibility as 'public' | 'department' | 'theme') || 'public',
      eventId: undefined,
      reactions: {
        like: p.like_count ?? 0,
        empathy: p.empathy_count ?? 0,
        helpful: p.helpful_count ?? 0
      },
      comments: [],
      views: p.views ?? 0,
      createdAt: new Date(p.created_at),
      aiSummary: p.ai_summary || undefined,
      isApprovedForAI: Boolean(p.is_approved_for_ai)
    };
  });
}
