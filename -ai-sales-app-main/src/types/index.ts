export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'learner' | 'admin';
  avatar?: string;
  participatingEvents?: string[]; // 参加中のイベントID配列
}

export interface LearningSession {
  id: string;
  userId: string;
  scenarioId: string;
  mode: 'customer' | 'staff';
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  evaluation?: Evaluation;
  completed: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotion?: 'positive' | 'neutral' | 'negative';
}

export interface Scenario {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'simulation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  customerType: string;
  objectives: string[];
  duration: number;
}

export interface Evaluation {
  id: string;
  sessionId: string;
  overallScore: number;
  categories: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
  feedback: string;
  improvements: string[];
  strengths: string[];
  createdAt: Date;
}

export interface LearningStyle {
  type: 'analytical' | 'empathetic' | 'assertive' | 'collaborative';
  description: string;
  strengths: string[];
  recommendations: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface LearningPlan {
  id: string;
  title: string;
  description: string;
  type: 'strength' | 'improvement';
  targetSkill: string;
  scenarios: string[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface SkillComparison {
  skill: string;
  userScore: number;
  averageScore: number;
  percentile: number;
}

export interface GrowthRecord {
  date: Date;
  scores: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
}

export interface CommunityPost {
  id: string;
  title: string;
  situation: string;
  innovation: string;
  result: string;
  learning: string;
  tags: string[];
  author: {
    name: string;
    department: string;
    avatar: string;
  };
  visibility: 'public' | 'department' | 'theme';
  targetDepartment?: string;
  targetTheme?: string;
  eventId?: string;
  reactions: {
    like: number;
    empathy: number;
    helpful: number;
  };
  userReaction?: 'like' | 'empathy' | 'helpful' | null;
  comments: CommunityComment[];
  views: number;
  createdAt: Date;
  aiSummary?: string;
  isApprovedForAI?: boolean;
}

export interface CommunityComment {
  id: string;
  author: {
    name: string;
    department: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
  isModerated?: boolean;
}

export interface PostForm {
  title: string;
  situation: string;
  innovation: string;
  result: string;
  learning: string;
  tags: string[];
  visibility: 'public' | 'department' | 'theme';
  targetDepartment?: string;
  targetTheme?: string;
}