export type CardType = 'diary' | 'effort' | 'spark' | 'favorite';

export interface SeasonCard {
  id: string;
  type: CardType;
  content: string;
  createdAt: number;
  meta?: {
    authorOrArtist?: string; // 收藏的作者/歌手/出处
    tag?: string;
    level?: 'small' | 'medium' | 'huge'; // 努力/心动程度
  };
}

export type RelicShape = 
  | 'shit'             // 💩 一坨大的（幽默自嘲）
  | 'tomb'             // 🪦 赛博墓碑
  | 'withered_flower'  // 🥀 枯萎的花（曾经绽放）
  | 'rock'             // 🪨 顽固的石头
  | 'spark_star'       // ⭐ 闪光碎片
  | 'rocket_wreck'     // 🚀 坠落的火箭（壮烈发射过）
  | 'blackhole'        // 🕳️ 虚无黑洞
  | 'crystal';         // 💎 沉淀结晶

export interface RelicConfig {
  shape: RelicShape;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface SeasonRecord {
  id: string;
  seasonNumber: number;
  title: string;
  reason?: string; // 结案原因：'giving_up' (放弃) | 'completed' (达成) | 'bored' (腻了/想重开) | 'stage_end' (自然阶段结束)
  reflection?: string; // 结案时的遗言/感想
  startedAt: number;
  endedAt?: number;
  cards: SeasonCard[];
  relicShape: RelicShape;
  status: 'active' | 'archived';
}

export interface SeasonStoreState {
  currentSeason: SeasonRecord;
  archivedSeasons: SeasonRecord[];
  activeTab: 'canvas' | 'terrain';
  isCeremonyOpen: boolean;
  isCollapsing: boolean;
  isBackupOpen: boolean;
  
  // Actions
  addCard: (type: CardType, content: string, meta?: SeasonCard['meta']) => void;
  updateCard: (id: string, content: string, meta?: SeasonCard['meta']) => void;
  deleteCard: (id: string) => void;
  
  // Ceremony & Termination
  openCeremony: () => void;
  closeCeremony: () => void;
  setCollapsing: (isCollapsing: boolean) => void;
  terminateSeason: (params: {
    title: string;
    reason: string;
    reflection: string;
    relicShape: RelicShape;
  }) => void;
  
  // Navigation & UI
  setActiveTab: (tab: 'canvas' | 'terrain') => void;
  setIsBackupOpen: (open: boolean) => void;
  
  // Backup & Restore
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAll: () => void;
}
