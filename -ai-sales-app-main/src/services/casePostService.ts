import { supabase } from '../lib/supabaseClient';
import { CommunityPost } from '../types';

type CasePostRow = {
  id: string;
  author_id: string;
  category: string;
  title: string;
  related_event_id: string | null;
  situation: string;
  approach: string; // maps to innovation
  result: string;
  notes: string; // maps to learning
  tags: string[];
  like_count: number;
  empathy_count: number;
  helpful_count: number;
  is_ai_adopted: boolean | null;
  created_at: string;
};

type UserRow = {
  id: string;
  name: string;
  department: string;
  avatar?: string | null;
};

export async function fetchOtherCasePosts(): Promise<CommunityPost[]> {
  // 1) Fetch posts in 'other' category
  const { data: posts, error } = await supabase
    .from<CasePostRow>('case_posts')
    .select('*')
    .eq('category', 'other')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch case_posts (other):', error);
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
      .from<UserRow>('users')
      .select('id,name,department,avatar')
      .in('id', authorIds);

    if (usersError) {
      console.error('Failed to fetch users for case_posts:', usersError);
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
      innovation: p.approach,
      result: p.result,
      learning: p.notes,
      tags: Array.isArray(p.tags) ? p.tags : [],
      author: {
        name: u?.name || '不明なユーザー',
        department: u?.department || '不明な部署',
        avatar: u?.avatar || 'https://placehold.co/80x80'
      },
      visibility: 'public',
      eventId: p.related_event_id || undefined,
      reactions: {
        like: p.like_count ?? 0,
        empathy: p.empathy_count ?? 0,
        helpful: p.helpful_count ?? 0
      },
      comments: [],
      views: 0,
      createdAt: new Date(p.created_at),
      aiSummary: undefined,
      isApprovedForAI: Boolean(p.is_ai_adopted)
    };
  });
}

export async function createOtherCasePost(params: {
  authorId: string;
  title: string;
  situation: string;
  approach: string;
  result: string;
  notes: string;
  tags: string[];
}): Promise<boolean> {
  const { authorId, title, situation, approach, result, notes, tags } = params;
  const payload = {
    author_id: authorId,
    category: 'other',
    title,
    related_event_id: null,
    situation,
    approach,
    result,
    notes,
    tags,
    // counts defaulted by DB
  };

  const { error } = await supabase
    .from('case_posts')
    .insert([payload]);

  if (error) {
    console.error('Failed to insert other case post:', error);
    return false;
  }
  return true;
}

export async function fetchFavoriteEventPosts(params?: {
  sinceDays?: number;
}): Promise<CommunityPost[]> {
  const sinceDays = params?.sinceDays ?? 7;
  const sinceIso = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

  let { data: posts, error } = await supabase
    .from<CasePostRow>('case_posts')
    .select('*')
    .eq('category', 'favorite_event')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch favorite_event posts:', error);
    throw new Error(error.message || 'fetchFavoriteEventPosts failed');
  }

  // fallback: if no posts in recent window, fetch without date filter
  if (!posts || posts.length === 0) {
    const res = await supabase
      .from<CasePostRow>('case_posts')
      .select('*')
      .eq('category', 'favorite_event')
      .order('created_at', { ascending: false });
    if (!res.error) posts = res.data || [];
  }

  const authorIds = Array.from(new Set((posts || []).map(p => p.author_id))).filter(Boolean);
  let usersById = new Map<string, UserRow>();
  if (authorIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from<UserRow>('users')
      .select('id,name,department,avatar')
      .in('id', authorIds);
    if (!usersError && users) for (const u of users) usersById.set(u.id, u);
  }

  return (posts || []).map<CommunityPost>((p) => {
    const u = usersById.get(p.author_id);
    return {
      id: p.id,
      title: p.title,
      situation: p.situation,
      innovation: p.approach,
      result: p.result,
      learning: p.notes,
      tags: Array.isArray(p.tags) ? p.tags : [],
      author: {
        name: u?.name || '不明なユーザー',
        department: u?.department || '不明な部署',
        avatar: u?.avatar || 'https://placehold.co/80x80'
      },
      visibility: 'public',
      eventId: p.related_event_id || undefined,
      reactions: {
        like: p.like_count ?? 0,
        empathy: p.empathy_count ?? 0,
        helpful: p.helpful_count ?? 0
      },
      comments: [],
      views: 0,
      createdAt: new Date(p.created_at),
      aiSummary: undefined,
      isApprovedForAI: Boolean(p.is_ai_adopted)
    };
  });
}
