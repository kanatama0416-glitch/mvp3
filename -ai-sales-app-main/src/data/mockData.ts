import { User, Scenario, Achievement, LearningStyle, LearningPlan, GrowthRecord, SkillComparison } from '../types';
import { CommunityPost } from '../types';

export const mockUser: User = {
  id: '1',
  name: '田中 太郎',
  email: 'tanaka@company.com',
  department: 'カード口コミ部',
  role: 'learner',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  participatingEvents: ['1', '3'] // 参加中のイベントID
};

export const mockScenarios: Scenario[] = [
  {
    id: '1',
    title: 'クレーム対応：商品不良',
    description: '商品不良によるクレームへの対応シナリオです',
    difficulty: 'beginner',
    category: 'クレーム対応',
    customerType: '不満を持つ顧客',
    objectives: ['顧客の不満を傾聴する', '適切な謝罪を行う', '解決策を提案する', '顧客満足を得る'],
    duration: 15
  },
  {
    id: '2',
    title: 'カード入会案内',
    description: 'エポスカードへの入会を提案するシナリオです',
    difficulty: 'intermediate',
    category: '接客・販売',
    customerType: '購入を検討している顧客',
    objectives: ['カードのメリットを説明する', '顧客の疑問に答える', '入会を促進する'],
    duration: 20
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: '口コミ初心者卒業',
    description: '基本シナリオを5回完了',
    icon: 'GraduationCap',
    unlockedAt: new Date('2024-01-15'),
    progress: 5,
    maxProgress: 5
  },
  {
    id: '2',
    title: 'カードマスター',
    description: 'カード口コミスコア80点以上を3回達成',
    icon: 'CreditCard',
    progress: 2,
    maxProgress: 3
  },
  {
    id: '3',
    title: 'イベント口コミの達人',
    description: 'アニメイベントシナリオで90点以上を取得',
    icon: 'Star',
    progress: 0,
    maxProgress: 1
  }
];

export const mockLearningStyles: LearningStyle[] = [
  {
    type: 'analytical',
    description: '論理的で詳細な説明を好む分析型',
    strengths: ['データに基づく説明', '体系的なアプローチ', '問題分析能力'],
    recommendations: ['事実に基づいたカード説明', '比較表の活用', 'ステップバイステップの提案']
  },
  {
    type: 'empathetic',
    description: '感情に寄り添う共感型',
    strengths: ['感情の理解', '信頼関係構築', '顧客の気持ちへの配慮'],
    recommendations: ['感情的なつながりを重視', '個人的な体験談の活用', '心地よい雰囲気づくり']
  },
  {
    type: 'assertive',
    description: '積極的で自信に満ちた主導型',
    strengths: ['リーダーシップ', '決断力', '積極的な提案'],
    recommendations: ['明確な提案', '即座の判断', '自信を持ったカード紹介']
  },
  {
    type: 'collaborative',
    description: '協力的で相互作用を重視する協調型',
    strengths: ['チームワーク', '相互理解', '合意形成'],
    recommendations: ['お客様との協力的な関係構築', '共同での解決策探し', '対話重視のアプローチ']
  }
];

export const mockLearningPlans: LearningPlan[] = [
  {
    id: '1',
    title: 'カード口コミ力強化プラン',
    description: 'レジでの自然な口コミテクニックを身につける',
    type: 'strength',
    estimatedDuration: 30,
    scenarios: ['1', '2'],
    tags: ['提案力', 'タイミング感覚']
  },
  {
    id: '2',
    title: 'イベント特化口コミプラン',
    description: 'アニメイベントでの効果的な口コミ手法をマスター',
    type: 'strength',
    estimatedDuration: 45,
    scenarios: ['2', '3'],
    tags: ['イベント対応', 'ファン心理理解']
  },
  {
    id: '3',
    title: '断り対応スキルアップ',
    description: '断られた時の適切な対応方法を習得',
    type: 'improvement',
    estimatedDuration: 25,
    scenarios: ['3'],
    tags: ['感情コントロール', '代替提案']
  }
];

export const mockGrowthRecords: GrowthRecord[] = [
  {
    date: new Date('2024-01-01'),
    scores: {
      communication: 65,
      productKnowledge: 70,
      empathy: 80,
      professionalism: 60,
      problemSolving: 55
    }
  },
  {
    date: new Date('2024-01-15'),
    scores: {
      communication: 72,
      productKnowledge: 75,
      empathy: 85,
      professionalism: 68,
      problemSolving: 62
    }
  },
  {
    date: new Date('2024-02-01'),
    scores: {
      communication: 78,
      productKnowledge: 82,
      empathy: 88,
      professionalism: 75,
      problemSolving: 70
    }
  }
];

export const mockSkillComparisons: SkillComparison[] = [
  {
    skill: 'ヒアリング力',
    userScore: 78,
    averageScore: 65,
    percentile: 75
  },
  {
    skill: '提案力',
    userScore: 82,
    averageScore: 70,
    percentile: 80
  },
  {
    skill: '親しみやすさ',
    userScore: 88,
    averageScore: 72,
    percentile: 90
  },
  {
    skill: 'タイミング感覚',
    userScore: 75,
    averageScore: 68,
    percentile: 70
  },
  {
    skill: '柔軟対応力',
    userScore: 70,
    averageScore: 75,
    percentile: 45
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'アニメファンのお客様への効果的なカード口コミ',
    situation: '20代男性、アニメイベントでグッズ購入、初回来店',
    innovation: 'お客様の好きなアニメ作品について会話を始め、そのアニメの関連商品でポイントが貯まることを具体例で説明',
    result: 'お客様が興味を示し、「次回のイベントでも使えますね」と前向きな反応。その場でカード申込み',
    learning: 'お客様の趣味に寄り添った具体例を示すことで、カードの価値を実感してもらえる',
    tags: ['#アニメファン', '#初回接客', '#具体例活用', '#趣味理解'],
    author: {
      name: '佐藤 花子',
      department: 'アニメイト渋谷店',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    visibility: 'public',
    eventId: '1',
    reactions: {
      like: 24,
      empathy: 18,
      helpful: 32
    },
    comments: [
      {
        id: '1',
        author: {
          name: '田中 一郎',
          department: 'アニメイト新宿店',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        content: '同じような場面でいつも困っていました。具体例を示すアプローチ、参考になります！',
        createdAt: new Date('2024-01-20T10:30:00')
      }
    ],
    views: 156,
    createdAt: new Date('2024-01-18T14:20:00'),
    aiSummary: '趣味に特化した具体例提示により、カードの価値を実感させる成功事例',
    isApprovedForAI: true
  },
  {
    id: '2',
    title: '五条悟推しのお客様とのキャラ愛トーク',
    situation: '10代女性、呪術廻戦フェアで五条悟グッズを大量購入',
    innovation: '「五条先生いいですよね！私も好きです」と共感。「次回のコラボでも五条先生グッズ出ると思うので、カードがあるとポイントでさらにグッズが買えますよ」と提案',
    result: 'お客様が「それは嬉しい！絶対作ります！」と即決。SNSでも「店員さんも五条推しで話が盛り上がった」と投稿',
    learning: 'キャラ愛を共有することで心の距離が縮まり、提案が自然に受け入れられる',
    tags: ['#呪術廻戦', '#キャラ愛', '#共感', '#ファン心理'],
    author: {
      name: '山田 美咲',
      department: 'マルイ渋谷店',
      avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    visibility: 'public',
    eventId: '1',
    reactions: {
      like: 45,
      empathy: 38,
      helpful: 52
    },
    comments: [
      {
        id: '2',
        author: {
          name: '鈴木 太郎',
          department: 'マルイ新宿店',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        content: 'ファンの気持ちに寄り添うの大事ですね！参考になります！',
        createdAt: new Date('2024-01-19T16:45:00')
      }
    ],
    views: 298,
    createdAt: new Date('2024-01-19T11:15:00'),
    aiSummary: 'キャラクター愛を共有することで信頼関係を築き、自然なカード提案につなげた成功事例',
    isApprovedForAI: true
  },
  {
    id: '3',
    title: 'クレーム対応からカード口コミへの転換',
    situation: '40代男性、商品の不具合でクレーム、怒りを感じている状態',
    innovation: 'まず誠実に謝罪し、迅速に交換対応。その後、「今後このようなことがないよう、カード会員様には優先サポートをご提供している」と自然に紹介',
    result: 'お客様の怒りが収まり、「そういうサービスがあるなら安心ですね」とカード申込み',
    learning: 'クレーム対応では信頼回復が最優先。その後の付加価値提案が効果的',
    tags: ['#クレーム対応', '#信頼回復', '#付加価値提案', '#優先サポート'],
    author: {
      name: '高橋 健太',
      department: 'マルイ池袋店',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    visibility: 'department',
    targetDepartment: 'マルイ各店舗',
    reactions: {
      like: 19,
      empathy: 35,
      helpful: 28
    },
    comments: [],
    views: 89,
    createdAt: new Date('2024-01-16T09:30:00'),
    aiSummary: 'クレーム対応後の信頼回復を活用したカード口コミの成功パターン'
  }
];

export const suggestedTags = [
  '#初回接客', '#リピート促進', '#クレーム対応', '#断り対応',
  '#アニメファン', '#ファミリー層', '#シニア層', '#学生',
  '#具体例活用', '#信頼関係', '#タイミング重視', '#感情配慮',
  '#QRコード活用', '#優先サポート', '#特典説明', '#ポイント活用'
];

export const departments = [
  'マルイ渋谷店', 'マルイ新宿店', 'マルイ池袋店', 'マルイ有楽町店',
  'アニメイト渋谷店', 'アニメイト新宿店', 'アニメイト池袋店',
  'エポスカード本社', 'フィンテック事業部', 'カスタマーサポート'
];

export const themes = [
  'リピート促進', 'クレーム対応', '新規開拓', 'ファン層攻略',
  'シニア対応', 'ファミリー対応', 'イベント活用', 'デジタル活用'
];