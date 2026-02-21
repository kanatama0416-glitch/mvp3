import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  MessageCircle,
  Search,
  ChevronRight,
  ThumbsUp,
  X,
  Check,
  ExternalLink
} from 'lucide-react';
import { CommunityPost } from '../../types';
import EventPostForm from './EventPostForm';
import { useAuth } from '../../hooks/useAuth';
import { saveUserParticipatingEvents, getUserParticipatingEvents } from '../../services/eventService';
import { HOOK_HELP_HTML } from '../shared/hookHelpHtml';

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  tags: string[];
  totalPosts: number;
  totalViews: number;
  totalReactions: number;
  stores: string[];
  bestPractices: CommunityPost[];
  successPatterns: string[];
  keyPhrases: string[];
  aiSummary: string;
  essentialKnowledge?: {
    overview: string;
    mainCharacters: string[];
    fanBase: string[];
    precautions: string[];
    servicePoints: string[];
    officialSiteUrl?: string;
  };
}

type ViewMode = 'list' | 'detail';
type ViewModeWithCreate = 'list' | 'detail' | 'create';
const animeEvents: Event[] = [
  {
    id: 'deco27',
    name: 'DECO*27フェア（実証実験で使用）',
    description: 'ボカロP「DECO*27」とのコラボ企画。限定グッズ販売と抽選企画を実施。',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    status: 'active',
    tags: ['#DECO27', '#ボカロ', '#限定グッズ', '#抽選企画'],
    totalPosts: 10,
    totalViews: 420,
    totalReactions: 95,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['楽曲やMVの話題から自然に会話を開始', '限定性を伝えて来店動機を強化'],
    keyPhrases: ['「新曲、聴きました？」', '「会場限定グッズがあります」'],
    aiSummary: 'ファンの熱量が高いので、作品理解と限定感の演出が効果的でした。',
    essentialKnowledge: {
      overview: 'DECO*27はボーカロイド楽曲で人気のプロデューサー。',
      mainCharacters: ['代表曲の世界観', 'ファンコミュニティ'],
      fanBase: ['10代〜30代中心', 'SNS拡散力が高い'],
      precautions: ['作品理解を示す', '限定情報は正確に伝える'],
      servicePoints: ['楽曲への共感', '限定企画の案内'],
      officialSiteUrl: 'https://www.deco27.com/'
    }
  },
  {
    id: 'jujutsu',
    name: '呪術廻戦フェア（ダミー）',
    description: '人気アニメ「呪術廻戦」とのコラボイベント。限定グッズ販売とカード口コミ強化キャンペーン。',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    tags: ['#呪術廻戦', '#アニメコラボ', '#限定グッズ', '#カード口コミ'],
    totalPosts: 12,
    totalViews: 456,
    totalReactions: 89,
    stores: ['渋谷店', '新宿店', '池袋店', '有楽町店'],
    bestPractices: [],
    successPatterns: ['キャラクター愛に共感した声かけ', '限定特典を使った提案'],
    keyPhrases: ['「このキャラクター人気ですよね」', '「イベント期間限定の特典です」'],
    aiSummary: '共感と限定感を組み合わせた提案が効果的でした。',
    essentialKnowledge: {
      overview: '「呪術廻戦」は呪霊と呪術師の戦いを描く人気作品。',
      mainCharacters: ['虎杖悠仁', '五条悟', '伏黒恵'],
      fanBase: ['10代〜20代中心', '女性ファンも多い'],
      precautions: ['作品理解を示す', 'キャラ名の誤りに注意'],
      servicePoints: ['共感から会話開始', '限定特典の訴求'],
      officialSiteUrl: 'https://jujutsukaisen.jp/'
    }
  },
  {
    id: 'kimetsu',
    name: '鬼滅の刃 竈門炭治郎立志編（ダミー）',
    description: '「鬼滅の刃」コラボイベント。限定グッズとコラボカフェが登場。',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-01'),
    status: 'active',
    tags: ['#鬼滅の刃', '#アニメコラボ', '#限定グッズ', '#コラボカフェ'],
    totalPosts: 15,
    totalViews: 521,
    totalReactions: 102,
    stores: ['新宿店', '池袋店', '横浜店'],
    bestPractices: [],
    successPatterns: ['家族連れへの配慮', '限定グッズの希少性訴求'],
    keyPhrases: ['「期間限定グッズです」', '「ご家族でも楽しめます」'],
    aiSummary: 'ファミリー層にも刺さる案内が有効でした。',
    essentialKnowledge: {
      overview: '大正時代を舞台にした人気アニメ。',
      mainCharacters: ['竈門炭治郎', '竈門禰豆子', '我妻善逸'],
      fanBase: ['幅広い年齢層', 'ファミリー層が多い'],
      precautions: ['家族連れへの配慮', '作品理解を示す'],
      servicePoints: ['限定性の訴求', '丁寧な案内'],
      officialSiteUrl: 'https://kimetsu.com/anime'
    }
  },
  {
    id: 'spyfamily',
    name: 'SPY×FAMILY アーニャと一緒に（ダミー）',
    description: '体験型イベント。フォトスポットと限定グッズが登場。',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-01'),
    status: 'active',
    tags: ['#SPYFAMILY', '#体験型', '#フォトスポット', '#限定グッズ'],
    totalPosts: 8,
    totalViews: 389,
    totalReactions: 67,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['写真映えの案内', 'SNS投稿の促進'],
    keyPhrases: ['「写真映えスポットあります」', '「SNS投稿で特典」'],
    aiSummary: '体験型の魅力を伝える案内が効果的でした。',
    essentialKnowledge: {
      overview: 'スパイ一家のコメディ作品。',
      mainCharacters: ['ロイド', 'アーニャ', 'ヨル'],
      fanBase: ['若年層中心', 'SNS利用が多い'],
      precautions: ['撮影ルールの案内', '家族連れへの配慮'],
      servicePoints: ['体験の魅力訴求', 'SNS連動'],
      officialSiteUrl: 'https://spy-family.net/'
    }
  },
  {
    id: 'onepiece',
    name: 'ONE PIECE FILM RED（ダミー）',
    description: '映画公開記念イベント。限定グッズと特別展示。',
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-03-10'),
    status: 'active',
    tags: ['#ONEPIECE', '#映画', '#限定グッズ'],
    totalPosts: 18,
    totalViews: 723,
    totalReactions: 128,
    stores: ['渋谷店', '新宿店', '池袋店', '横浜店'],
    bestPractices: [],
    successPatterns: ['映画話題の共有', '限定グッズの案内'],
    keyPhrases: ['「映画ご覧になりました？」', '「今だけの展示です」'],
    aiSummary: '話題性を活かした声かけが効果的でした。',
    essentialKnowledge: {
      overview: '海賊王を目指す冒険作品。',
      mainCharacters: ['ルフィ', 'ゾロ', 'ナミ'],
      fanBase: ['全年齢層に人気', 'ファミリー層も多い'],
      precautions: ['作品理解を示す', '家族連れへの配慮'],
      servicePoints: ['話題性の共有', '限定感の訴求'],
      officialSiteUrl: 'https://one-piece.com/'
    }
  },
  {
    id: 'oshi',
    name: '【推しの子】POPUP STORE（ダミー）',
    description: 'ポップアップストア。限定グッズとフォトスポット。',
    startDate: new Date('2024-03-05'),
    endDate: new Date('2024-04-05'),
    status: 'active',
    tags: ['#推しの子', '#ポップアップ', '#限定グッズ'],
    totalPosts: 9,
    totalViews: 445,
    totalReactions: 76,
    stores: ['渋谷店', '新宿店'],
    bestPractices: [],
    successPatterns: ['アイドル要素への共感', 'SNS映えの案内'],
    keyPhrases: ['「推し活グッズあります」', '「写真スポットもあります」'],
    aiSummary: '推し活目線の案内が好評でした。',
    essentialKnowledge: {
      overview: '芸能界を舞台にした話題作。',
      mainCharacters: ['星野アイ', 'アクア', 'ルビー'],
      fanBase: ['若年層中心', 'SNS利用が多い'],
      precautions: ['作品理解を示す', '撮影ルールの案内'],
      servicePoints: ['推し活の共感', '限定感の訴求'],
      officialSiteUrl: 'https://ichigoproduction.com/'
    }
  },
  {
    id: 'tokyo-revengers',
    name: '東京リベンジャーズ 聖夜決戦編（ダミー）',
    description: '限定グッズと特別展示のイベント。',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-03-20'),
    status: 'completed',
    tags: ['#東京リベンジャーズ', '#限定グッズ'],
    totalPosts: 7,
    totalViews: 334,
    totalReactions: 58,
    stores: ['池袋店', '新宿店'],
    bestPractices: [],
    successPatterns: ['若年層への共感', '限定感の強調'],
    keyPhrases: ['「今だけの展示です」', '「限定グッズあります」'],
    aiSummary: '限定感を軸にした提案が効果的でした。',
    essentialKnowledge: {
      overview: 'タイムリープを描く人気作。',
      mainCharacters: ['花垣武道', '佐野万次郎', '龍宮寺堅'],
      fanBase: ['若年層中心', '男性ファンが多い'],
      precautions: ['作品理解を示す', '過度な煽りは避ける'],
      servicePoints: ['共感の声かけ', '限定性の訴求'],
      officialSiteUrl: 'https://tokyo-revengers-anime.com/'
    }
  },
  {
    id: 'chainsaw',
    name: 'チェンソーマン POPUP STORE（ダミー）',
    description: '限定グッズと特別展示のポップアップ。',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-04-15'),
    status: 'active',
    tags: ['#チェンソーマン', '#ポップアップ', '#限定グッズ'],
    totalPosts: 6,
    totalViews: 289,
    totalReactions: 45,
    stores: ['渋谷店', '池袋店'],
    bestPractices: [],
    successPatterns: ['作品の魅力共有', '限定感の強調'],
    keyPhrases: ['「今だけの展示です」', '「限定グッズ人気です」'],
    aiSummary: '作品の魅力共有が効果的でした。',
    essentialKnowledge: {
      overview: '悪魔と戦う少年のダークファンタジー。',
      mainCharacters: ['デンジ', 'パワー', 'マキマ'],
      fanBase: ['若年層中心', '男性ファンが多い'],
      precautions: ['表現の配慮', '作品理解を示す'],
      servicePoints: ['共感の声かけ', '限定感の訴求'],
      officialSiteUrl: 'https://chainsawman.dog/'
    }
  },
  {
    id: 'bocchi',
    name: 'ぼっち・ざ・ろっく！（ダミー）',
    description: 'ライブ映像上映と限定グッズのイベント。',
    startDate: new Date('2024-04-15'),
    endDate: new Date('2024-05-15'),
    status: 'upcoming',
    tags: ['#ぼっちざろっく', '#音楽', '#ライブ'],
    totalPosts: 5,
    totalViews: 201,
    totalReactions: 29,
    stores: ['渋谷店', '新宿店'],
    bestPractices: [],
    successPatterns: ['音楽好きへの共感', 'ライブ体験の案内'],
    keyPhrases: ['「ライブ映像あります」', '「限定グッズもあります」'],
    aiSummary: '音楽体験の魅力を伝える案内が効果的です。',
    essentialKnowledge: {
      overview: '音楽をテーマにした青春アニメ。',
      mainCharacters: ['後藤ひとり', '伊地知虹夏', '山田リョウ'],
      fanBase: ['若年層中心', '音楽ファンが多い'],
      precautions: ['作品理解を示す', '落ち着いた案内'],
      servicePoints: ['共感の声かけ', '体験の案内'],
      officialSiteUrl: 'https://bocchi.rocks/'
    }
  },
  {
    id: 'blue-lock',
    name: 'ブルーロック エゴイスト覚醒（ダミー）',
    description: '体験コーナーと限定グッズのイベント。',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-01'),
    status: 'upcoming',
    tags: ['#ブルーロック', '#サッカー', '#体験型'],
    totalPosts: 4,
    totalViews: 178,
    totalReactions: 23,
    stores: ['新宿店', '渋谷店'],
    bestPractices: [],
    successPatterns: ['スポーツファンへの共感', '体験型の案内'],
    keyPhrases: ['「体験コーナーあります」', '「限定グッズあります」'],
    aiSummary: '体験型の魅力訴求が効果的です。',
    essentialKnowledge: {
      overview: 'サッカーをテーマにした人気作。',
      mainCharacters: ['潔世一', '蜂楽廻', '千切豹馬'],
      fanBase: ['若年層中心', 'スポーツファンが多い'],
      precautions: ['スポーツ理解を示す', '体験ルールの案内'],
      servicePoints: ['共感の声かけ', '体験の案内'],
      officialSiteUrl: 'https://bluelock-pr.com/'
    }
  }
];

export const EVENT_TITLE_OPTIONS = animeEvents.map((event) => event.name);

type FilterStatus = 'all' | 'active' | 'completed' | 'upcoming' | 'my-events';

export default function Events() {
  const { user, updateUser } = useAuth();
  const [viewMode, setViewMode] = useState<ViewModeWithCreate>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showEventSelectionModal, setShowEventSelectionModal] = useState(false);
  const [selectedParticipatingEvents, setSelectedParticipatingEvents] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'knowledge' | 'patterns' | 'phrases'>('knowledge');
  const [showHookHelp, setShowHookHelp] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [allEventsFilterArea, setAllEventsFilterArea] = useState<string>('all');
  const [allEventsFilterYear, setAllEventsFilterYear] = useState<string>('all');
  const [expandedStoresEventId, setExpandedStoresEventId] = useState<string | null>(null);
  const eventsSource = animeEvents;

  // ユーザーの参加イベントを取得
  useEffect(() => {
    const loadParticipatingEvents = async () => {
      if (user?.id) {
        const events = await getUserParticipatingEvents(user.id);
        setSelectedParticipatingEvents(events);
      }
    };
    loadParticipatingEvents();
  }, [user?.id]);

  useEffect(() => {
    const handleHookHelpMessage = (event: MessageEvent) => {
      if (event.data?.type === 'closeHookHelp') {
        setShowHookHelp(false);
      }
    };

    window.addEventListener('message', handleHookHelpMessage);
    return () => window.removeEventListener('message', handleHookHelpMessage);
  }, []);

  const filteredEvents = eventsSource.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' ||
                         event.status === filterStatus ||
                         (filterStatus === 'my-events' && selectedParticipatingEvents.includes(event.id));
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-success-green';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'upcoming': return 'bg-blue-100 text-sky-blue';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
      switch (status) {
        case 'active': return '開催中';
        case 'completed': return '終了';
        case 'upcoming': return '開催予定';
        default: return '未設定';
      }
    };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setViewMode('list');
  };

  const handleCreatePost = (postData: any) => {
  };

  const handleToggleEventParticipation = (eventId: string) => {
    setSelectedParticipatingEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSaveParticipatingEvents = async () => {
    if (!user?.id) {
      console.error('ユーザーIDが取得できません');
      return;
    }

    setIsLoading(true);
    try {
      const success = await saveUserParticipatingEvents(user.id, selectedParticipatingEvents);

      if (success) {
        const updatedEvents = await getUserParticipatingEvents(user.id);
        setSelectedParticipatingEvents(updatedEvents);
        setShowEventSelectionModal(false);
        alert('参加イベントを保存しました');
      } else {
        console.error('参加イベントの保存に失敗しました');
        alert('保存に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('参加イベントの保存でエラーが発生しました:', error);
      alert('保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const activeEvents = eventsSource.filter(e => {
    const year2024Match = e.startDate.getFullYear() === 2024 || e.endDate.getFullYear() === 2024;
    if (selectedArea === 'all') return year2024Match;

    const regionalKeywords: { [key: string]: string[] } = {
      '北海道': ['札幌', '函館'],
      '東北': ['仙台', '盛岡', '青森', '秋田', '山形', '福島'],
      '関東': ['東京', '新宿', '渋谷', '池袋', '横浜', '大宮', '柏', '千葉', '川崎', '吉祥寺', '有楽町'],
      '中部': ['名古屋', '静岡', '新潟', '金沢', '長野', '岐阜', '富山'],
      '関西': ['大阪', '梅田', '京都', '神戸', '奈良', '滋賀'],
      '中国': ['広島', '岡山', '山口', '鳥取', '島根'],
      '四国': ['高松', '松山', '徳島', '高知'],
      '九州': ['福岡', '博多', '熊本', '鹿児島', '長崎', '大分', '宮崎', '佐賀']
    };

    const keywords = regionalKeywords[selectedArea] || [];
    const matchesArea = e.stores.some(store =>
      keywords.some(keyword => store.includes(keyword))
    ) || e.stores.includes('全国');

    return year2024Match && matchesArea;
  });

  if (viewMode === 'create') {
    return (
      <EventPostForm 
        onSubmit={handleCreatePost}
        onCancel={handleBackToList}
        events={eventsSource.map(e => ({ id: e.id, name: e.name, status: e.status }))}
      />
    );
  }

  if (viewMode === 'detail' && selectedEvent) {
    type DetailPost = {
      id: number;
      staffName: string;
      eventName: string;
      storeName: string;
      tags: string[];
      hookWords: string[];
      pitchWords: string[];
      cardWords: string[];
      hookContent: string;
      pitchContent: string;
      cardContent: string;
      memoContent: string;
      adminComment?: string;
      adminAuthor?: string;
      adminUpdatedAt?: string;
      likes: number;
      helpful: number;
    };

    const decoPost: DetailPost = {
      id: 0,
      staffName: '櫻井さん',
      eventName: 'DECO*27',
      storeName: '有楽町',
      tags: ['男女比6:4', '高校生〜20代中心', '40代・親子連れもいる'],
      hookWords: [
        '今日3000円超えている方が多いので、抽選会に参加できますがエポスカードお持ちですか？',
        'エポスカードをお持ち前提で話す'
      ],
      pitchWords: [
        '高校卒業・18歳以上を確認する',
        'スマホ入会で3000円割引',
        '抽選会B賞ブロマイド8枚コンプセット'
      ],
      cardWords: [
        'マルイは年間300タイトル以上イベント開催',
        '次回以降も特典メリットあり',
        '所要約20分'
      ],
      hookContent: `【フック】\n・3000円以上買う方が多いので\n「DECO*27のイベントは今回で2回目なんですが、今日お会計3000円超えるので会場限定の非売品が当たる抽選会がこの後出来る権利があるんですが、エポスカード今日持って来ましたか？」と、持っている程でお話します。\n過去にもイベント開催してる事や抽選会・会場限定・非売品などの言葉を使うとお客様も話を聞いてくれる可能性が高くなります。`,
      pitchContent: `【引き込み】\nはじめの聞き方でお客様が持っていないと分かったら18歳以上高校卒業されている事を確認してから\n「今回このイベントに合わせてキャンペーンをやっていて、スマホから無料で入会して頂くと入場料分をこちらのお会計から3000円割引きさせて頂くのと、抽選会のB賞のブロマイド8枚コンプリートセットを会場で作って頂いた方に抽選会前にプレゼントしてるので作ってからお会計しませんか？」とさらに関心を高めます。`,
      cardContent: `【カード説明】\n「VISAの付いたマルイグループが発行しているクレジットカードで入会金・年会費や更新費など一切かからないので安心してお申し込み出来ます」「アーティストやアニメのイベントをマルイは年間で300タイトル以上やっているのでカード持っているとまた次回のイベントの時にご提示して現金払いでも抽選出来たり特典多くもらったり出来るので今日作ったカード払いでこの場で3000円引きで○○○円でお得にお買い物していきませんか？」\n※ここで作りますとなったらお時間20分くらい大丈夫ですか？や免許やマイナンバーなどお名前入ってる物お持ちですか？や今日カードが作れたらそのカードでお支払いして下さいね。など確認してご案内します。\n※ここまでお話しして断ったり、お時間ない方には無理おすすめせず「じゃ、またの機会にお願いしますね」とさっさと精算します。`,
      memoContent: `【補足メモ】\n▪️客層\n男女比6:4  高校生〜20代中心で\n40代や親子連れもいる。\nエポスのデザイン券面で「ピノキオピー」という同じボーカロイドのプロデューサーの券面が親和性があり、カードのおすすめの際に見せるとその券面でお申し込みする方が多い。前回もその券面が人気でした。`,
      adminComment: `【運営コメント】\n今回のイベントは「割引訴求」が強いので、\n1) 最初の一言は短く\n2) 「作る→会計」の導線を明確にする\n3) 迷っている方には券面を提示する\nを徹底すると成約率を上げやすくなります。\n\n※「無理に勧めない」判断も重要です。`,
      adminAuthor: 'まなびー運営',
      adminUpdatedAt: '2026-02-19',
      likes: 100,
      helpful: 0
    };

    const buildPostFromEvent = (event: Event): DetailPost => {
      const primaryStore = event.stores?.[0] || '未設定';
      const hookWords = event.keyPhrases.length > 0 ? event.keyPhrases.slice(0, 2) : ['まずは興味を引く一言から'];
      const pitchWords = event.successPatterns.length > 0 ? event.successPatterns.slice(0, 3) : ['特典やメリットを簡潔に伝える'];
      const cardWords = [
        '入会金・年会費は永年無料',
        `${event.name}に合わせた特典をご案内`,
        'お申し込み所要時間は約20分'
      ];

      return {
        id: Number(String(event.id).replace(/\D/g, '')) || 1,
        staffName: '達人スタッフ',
        eventName: event.name,
        storeName: primaryStore,
        tags: [...event.tags.slice(0, 3), `${event.status === 'active' ? '開催中' : event.status === 'upcoming' ? '開催予定' : '終了イベント'}`],
        hookWords,
        pitchWords,
        cardWords,
        hookContent: `【フック】\n${hookWords.join('\n')}\n\nまずはお客様が「少し聞いてみよう」と思える入口を作ります。`,
        pitchContent: `【引き込み】\n${pitchWords.join('\n')}\n\nイベントの魅力とお客様メリットを短く具体的に伝えます。`,
        cardContent: `【カード説明】\n入会金・年会費は永年無料で、安心してお申し込みいただけます。\n${event.aiSummary}\n\n最後に所要時間と必要な確認事項を伝えて、判断しやすくします。`,
        memoContent: `【補足メモ】\nイベント概要: ${event.description}\n推奨店舗: ${event.stores.join(' / ')}\n注意点: ${(event.essentialKnowledge?.precautions || ['誤案内を避けるため、最新の公式情報を確認']).join(' / ')}`,
        adminComment: `【運営コメント】\nこのイベントでは「${event.successPatterns[0] || '共感から会話を始める'}」を最優先にしてください。\n次に「${event.successPatterns[1] || '限定メリットを明確にする'}」を添えると、会話が自然につながります。`,
        adminAuthor: 'まなびー運営',
        adminUpdatedAt: '2026-02-19',
        likes: Math.max(event.totalReactions, 1),
        helpful: 0
      };
    };

    const primaryPost = selectedEvent.id === 'deco27' ? decoPost : buildPostFromEvent(selectedEvent);
    const detailPosts: DetailPost[] = [];
    const sortedPosts = [primaryPost, ...detailPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    const topPost = sortedPosts[0];

    return (
      <div className="space-y-6 pb-10">
        <div>
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            戻る
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl shadow-gray-200">
          <div className="absolute -right-4 -top-4 text-9xl opacity-10">★</div>
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
            Current Event
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight">{selectedEvent.name}</h2>
          <p className="mt-1 text-xs font-medium text-white/70">達人のトークから学び、自分なりにアレンジしよう</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {selectedEvent.essentialKnowledge?.officialSiteUrl ? (
            <a
              href={selectedEvent.essentialKnowledge.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl border border-gray-200 p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">イベント詳細</span>
            </a>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-4 flex flex-col items-center text-center gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">イベント詳細</span>
            </div>
          )}

          <a
            href="https://www.eposcard.co.jp/gecard/ec00013/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-3xl border border-gray-200 p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">関連カード</span>
          </a>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">運営からのコメント</p>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                  {topPost.adminAuthor || '運営'}{topPost.adminUpdatedAt ? ` ・ ${topPost.adminUpdatedAt}` : ''}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
              改善ヒント
            </span>
          </div>
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[13px] whitespace-pre-wrap text-gray-700 leading-relaxed">
              {topPost.adminComment || '運営コメントはまだありません。'}
            </p>
          </div>
        </section>

        <div className="px-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">達人の投稿</h3>
          </div>
          <button
            onClick={() => setShowHookHelp(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 bg-sky-blue text-white font-bold shadow-lg shadow-sky-200 hover:bg-blue-600 transition-colors"
          >
            口コミの構造を見る
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {sortedPosts.map((post, idx) => {
            const medalColor = idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-600';
            const borderColor = idx === 0 ? 'border-blue-500' : 'border-gray-300';
            return (
              <div key={post.id} className={`bg-white rounded-3xl border border-gray-200 border-l-8 ${borderColor} p-6 shadow-sm`}>
                <div className="flex justify-between items-start mb-6 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-widest">
                        {post.eventName}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{post.storeName}</span>
                    </div>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <span className={medalColor}>●</span>
                      {post.staffName}
                    </h4>
                  </div>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-xs font-bold text-gray-700 active:scale-95 transition-transform">
                    <ThumbsUp className="w-4 h-4 text-gray-500" />
                    {post.helpful}
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="pl-4 border-l-[3px] border-orange-400">
                    <span className="text-[10px] font-bold tracking-wider text-orange-500 uppercase">Hook / フック</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.hookWords.map((w, i) => (
                        <span key={`${post.id}-hook-${i}`} className="px-3 py-1 text-[11px] font-semibold rounded-xl bg-orange-50 text-orange-700 border border-orange-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pl-4 border-l-[3px] border-green-500">
                    <span className="text-[10px] font-bold tracking-wider text-green-600 uppercase">Pitch / 引き込み</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.pitchWords.map((w, i) => (
                        <span key={`${post.id}-pitch-${i}`} className="px-3 py-1 text-[11px] font-semibold rounded-xl bg-green-50 text-green-700 border border-green-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pl-4 border-l-[3px] border-blue-500">
                    <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Card / 説明</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.cardWords.map((w, i) => (
                        <span key={`${post.id}-card-${i}`} className="px-3 py-1 text-[11px] font-semibold rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t, i) => (
                      <span key={`${post.id}-tag-${i}`} className="px-2 py-1 text-[10px] font-semibold rounded-xl bg-gray-100 text-gray-600 border border-gray-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <details className="mt-5 pt-4 border-t border-gray-100 group">
                  <summary className="list-none flex justify-center items-center gap-2 text-xs font-bold cursor-pointer">
                    <span className="text-blue-600 group-open:hidden">トーク全文を読む</span>
                    <span className="text-gray-400 hidden group-open:inline">閉じる</span>
                    <ChevronRight className="w-3 h-3 text-blue-600 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div className="bg-orange-50/50 p-5 rounded-3xl text-sm leading-relaxed border border-orange-100/70">
                      <p className="font-bold text-orange-500 text-[10px] uppercase mb-2 tracking-widest">Hook 全文</p>
                      <div className="whitespace-pre-wrap text-gray-700 text-[13px]">{post.hookContent}</div>
                    </div>
                    <div className="bg-green-50/50 p-5 rounded-3xl text-sm leading-relaxed border border-green-100/70">
                      <p className="font-bold text-green-600 text-[10px] uppercase mb-2 tracking-widest">Pitch 全文</p>
                      <div className="whitespace-pre-wrap text-gray-700 text-[13px]">{post.pitchContent}</div>
                    </div>
                    <div className="bg-blue-50/50 p-5 rounded-3xl text-sm leading-relaxed border border-blue-100/70">
                      <p className="font-bold text-blue-600 text-[10px] uppercase mb-2 tracking-widest">Info 全文</p>
                      <div className="whitespace-pre-wrap text-gray-700 text-[13px]">{post.cardContent}</div>
                    </div>
                    <div className="bg-gray-100/60 p-5 rounded-3xl text-sm leading-relaxed border border-gray-200/70">
                      <p className="font-bold text-gray-500 text-[10px] uppercase mb-2 tracking-widest">Memo / 補足メモ</p>
                      <div className="whitespace-pre-wrap text-gray-700 text-[13px]">{post.memoContent}</div>
                    </div>
                    {post.adminComment && (
                      <div className="bg-indigo-50/60 p-5 rounded-3xl text-sm leading-relaxed border border-indigo-100">
                        <p className="font-bold text-indigo-600 text-[10px] uppercase mb-2 tracking-widest">
                          Admin / 運営コメント {post.adminAuthor ? `・ ${post.adminAuthor}` : ''} {post.adminUpdatedAt ? `・ ${post.adminUpdatedAt}` : ''}
                        </p>
                        <div className="whitespace-pre-wrap text-gray-700 text-[13px]">{post.adminComment}</div>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://docs.google.com/forms/d/1ZVv_aefg2sSfXiKEzNXprRJEb0C0tQiUAH50M_l-RAs/edit?usp=forms_home&ouid=117951192700997366273&ths=true"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white rounded-2xl py-4 font-semibold shadow-lg shadow-blue-200 text-center"
          >
            投稿
          </a>
          <a
            href="https://docs.google.com/forms/d/1P8QJ34C5Mt6PQq82GSrHhbm3K8mQK-gSNp33HA9at9k/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-2xl py-4 font-bold text-gray-700 text-center"
          >
            アンケート
          </a>
        </div>

        <div className="mt-3 px-1 space-y-1">
          <p className="text-[11px] text-gray-500">※運営中にお気づきの点があれば、「投稿」からぜひ共有してください（いつでもOK）</p>
          <p className="text-[11px] text-gray-500">※ご利用後に「アンケート」へのご回答にご協力をお願いいたします</p>
        </div>

        {showHookHelp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6"
            onClick={() => setShowHookHelp(false)}
          >
            <div
              className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title="口コミの構造"
                srcDoc={HOOK_HELP_HTML}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="イベント名やタグで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
          >
            <option value="all">すべて</option>
            <option value="my-events">参加イベント</option>
            <option value="active">開催中</option>
            <option value="upcoming">開催予定</option>
            <option value="completed">終了</option>
          </select>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className={`bg-white rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${
              selectedParticipatingEvents.includes(event.id)
                ? 'border-purple-400 bg-purple-50/40'
                : 'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-blue border border-sky-100">
                    投稿数 {event.totalPosts}
                  </span>
                  {selectedParticipatingEvents.includes(event.id) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                      <Users className="w-3 h-3" />
                      <span>参加イベント</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-sky-blue transition-colors">
                  {event.name}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 mt-1 text-gray-400 group-hover:text-sky-blue transition-colors shrink-0" />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                  +{event.tags.length - 3}件
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1.5 min-w-0">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {event.startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} - 
                  {event.endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedStoresEventId((prev) => (prev === event.id ? null : event.id));
                }}
                aria-expanded={expandedStoresEventId === event.id}
                className={`flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md border text-xs font-semibold transition-colors ${
                  expandedStoresEventId === event.id
                    ? 'text-sky-blue border-sky-200 bg-sky-50'
                    : 'text-gray-600 border-gray-200 bg-white hover:text-sky-blue hover:border-sky-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{event.stores.length}店舗</span>
                <span className="text-[10px] text-gray-400">表示</span>
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    expandedStoresEventId === event.id ? 'rotate-90 text-sky-blue' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {expandedStoresEventId === event.id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <p className="text-[11px] font-semibold text-gray-500 mb-2">対象店舗</p>
                <div className="flex flex-wrap gap-1.5">
                  {event.stores.map((store) => (
                    <span
                      key={`${event.id}-${store}`}
                      className="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-700"
                    >
                      {store}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'my-events' ? '参加イベントがありません' : '該当するイベントが見つかりません'}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'my-events'
                ? '参加するイベントを選択するとここに表示されます。'
                : '検索条件を変更してお試しください。'
              }
            </p>
        </div>
      )}

      {showEventSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">参加イベントを選択</h2>
                  <p className="text-gray-600 mt-1">参加するイベントを選択してください</p>
                </div>
                <button
                  onClick={() => setShowEventSelectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">エリア:</span>
                {['all','北海道','東北','関東','中部','関西','中国','四国','九州'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedArea === area
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area === 'all' ? 'すべて' : area}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="p-6 space-y-4">
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleToggleEventParticipation(event.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedParticipatingEvents.includes(event.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-success-green">
                            開催中
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {event.startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} -
                              {event.endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.stores.length}店舗蜿ょ刈</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の投稿</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        selectedParticipatingEvents.includes(event.id)
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedParticipatingEvents.includes(event.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">該当するイベントがありません</p>
                </div>
              )}
            </div>

            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedParticipatingEvents.length}件のイベントを選択中
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEventSelectionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveParticipatingEvents}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? '保存中...' : '保存する'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showAllEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">全イベント一覧</h2>
                  <p className="text-gray-600 mt-1">すべてのイベントを確認できます</p>
                </div>
                <button
                  onClick={() => setShowAllEventsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">エリア</label>
                  <select
                    value={allEventsFilterArea}
                    onChange={(e) => setAllEventsFilterArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  >
                    <option value="all">すべてのエリア</option>
                    <option value="北海道">北海道</option>
                    <option value="東北">東北</option>
                    <option value="関東">関東</option>
                    <option value="中部">中部</option>
                    <option value="関西">関西</option>
                    <option value="中国">中国</option>
                    <option value="四国">四国</option>
                    <option value="九州">九州</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">年度</label>
                  <select
                    value={allEventsFilterYear}
                    onChange={(e) => setAllEventsFilterYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  >
                    <option value="all">すべての年度</option>
                    <option value="2024">2024年</option>
                    <option value="2023">2023年</option>
                    <option value="2022">2022年</option>
                    <option value="2021">2021年</option>
                  </select>
                </div>
              </div>
            </div>

            
            <div className="p-6 space-y-4">
              {eventsSource
                .filter(event => {
                  const getAreaFromStore = (storeName: string): string => {
                    const keywordToArea: { [key: string]: string } = {
                      札幌: '北海道',
                      函館: '北海道',
                      仙台: '東北',
                      盛岡: '東北',
                      青森: '東北',
                      秋田: '東北',
                      山形: '東北',
                      福島: '東北',
                      東京: '関東',
                      新宿: '関東',
                      渋谷: '関東',
                      池袋: '関東',
                      横浜: '関東',
                      大宮: '関東',
                      柏: '関東',
                      千葉: '関東',
                      川崎: '関東',
                      吉祥寺: '関東',
                      有楽町: '関東',
                      名古屋: '中部',
                      静岡: '中部',
                      新潟: '中部',
                      金沢: '中部',
                      長野: '中部',
                      岐阜: '中部',
                      富山: '中部',
                      大阪: '関西',
                      梅田: '関西',
                      京都: '関西',
                      神戸: '関西',
                      奈良: '関西',
                      滋賀: '関西',
                      広島: '中国',
                      岡山: '中国',
                      山口: '中国',
                      鳥取: '中国',
                      島根: '中国',
                      高松: '四国',
                      松山: '四国',
                      徳島: '四国',
                      高知: '四国',
                      福岡: '九州',
                      博多: '九州',
                      熊本: '九州',
                      鹿児島: '九州',
                      長崎: '九州',
                      大分: '九州',
                      宮崎: '九州',
                      佐賀: '九州'
                    };

                    const key = Object.keys(keywordToArea).find(k => storeName.includes(k));
                    return key ? keywordToArea[key] : 'その他';
                  };

                  const areaMatch = allEventsFilterArea === 'all' ||
                    event.stores.some(store => {
                      const storeArea = getAreaFromStore(store);
                      return storeArea === allEventsFilterArea;
                    }) ||
                    (allEventsFilterArea === '蜈ｨ蝗ｽ' && event.stores.includes('全国'));

                  const yearMatch = allEventsFilterYear === 'all' ||
                    event.startDate.getFullYear().toString() === allEventsFilterYear;

                  return areaMatch && yearMatch;
                })
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setShowAllEventsModal(false);
                      handleEventClick(event);
                    }}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-sky-blue hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                            {getStatusLabel(event.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {event.startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} -
                              {event.endDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.stores.length}店舗蜿ょ刈</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{event.totalPosts}件の投稿</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

























