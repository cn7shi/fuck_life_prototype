import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SeasonRecord, SeasonStoreState, CardType, RelicConfig } from '../types/season';

export const RELIC_PRESETS: RelicConfig[] = [
  {
    shape: 'shit',
    label: '一坨大的',
    icon: '💩',
    color: 'from-amber-700 to-amber-900',
    description: '彻底烂尾，但烂得理直气壮，坦然面对。'
  },
  {
    shape: 'tomb',
    label: '赛博墓碑',
    icon: '🪦',
    color: 'from-slate-700 to-slate-900',
    description: '这里安葬着一段曾经雄心勃勃的计划。'
  },
  {
    shape: 'withered_flower',
    label: '枯萎的花',
    icon: '🥀',
    color: 'from-rose-900 to-stone-900',
    description: '它虽然枯萎了，但在绽放的几天里确实很好看。'
  },
  {
    shape: 'rocket_wreck',
    label: '坠毁火箭',
    icon: '🚀',
    color: 'from-orange-700 to-red-950',
    description: '点火起飞过，轰轰烈烈炸在半空中，虽败犹荣。'
  },
  {
    shape: 'spark_star',
    label: '闪光残片',
    icon: '⭐',
    color: 'from-amber-400 to-yellow-600',
    description: '虽没走完全程，但在某些瞬间闪闪发光过。'
  },
  {
    shape: 'crystal',
    label: '结案晶体',
    icon: '💎',
    color: 'from-cyan-600 to-blue-900',
    description: '圆满达成或高质量阶段收尾，凝结成珍贵矿石。'
  },
  {
    shape: 'rock',
    label: '路边顽石',
    icon: '🪨',
    color: 'from-stone-600 to-stone-800',
    description: '平平淡淡的一段日子，像路边不起眼却真实存在的石头。'
  },
  {
    shape: 'blackhole',
    label: '虚无裂隙',
    icon: '🕳️',
    color: 'from-purple-950 to-black',
    description: '不想多说，纯粹想掀桌重开。'
  }
];

const createInitialSeason = (seasonNumber: number = 1): SeasonRecord => ({
  id: `season_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  seasonNumber,
  title: `第 ${seasonNumber} 赛季`,
  startedAt: Date.now(),
  cards: [
    {
      id: `card_welcome_1`,
      type: 'diary',
      content: '新赛季开启。这里不需要你每天打卡，只记录你当下的真实切片。',
      createdAt: Date.now()
    },
    {
      id: `card_welcome_2`,
      type: 'effort',
      content: '今天没有背单词，但认真呼吸并散步了 20 分钟。',
      createdAt: Date.now()
    }
  ],
  relicShape: 'shit',
  status: 'active'
});

export const useSeasonStore = create<SeasonStoreState>()(
  persist(
    (set, get) => ({
      currentSeason: createInitialSeason(1),
      archivedSeasons: [],
      activeTab: 'canvas',
      isCeremonyOpen: false,
      isCollapsing: false,
      isBackupOpen: false,

      addCard: (type: CardType, content: string, meta?: any) => {
        if (!content.trim()) return;
        const newCard = {
          id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type,
          content: content.trim(),
          createdAt: Date.now(),
          meta
        };
        set(state => ({
          currentSeason: {
            ...state.currentSeason,
            cards: [newCard, ...state.currentSeason.cards]
          }
        }));
      },

      updateCard: (id: string, content: string, meta?: any) => {
        set(state => ({
          currentSeason: {
            ...state.currentSeason,
            cards: state.currentSeason.cards.map(c => 
              c.id === id ? { ...c, content: content.trim(), meta: meta || c.meta } : c
            )
          }
        }));
      },

      deleteCard: (id: string) => {
        set(state => ({
          currentSeason: {
            ...state.currentSeason,
            cards: state.currentSeason.cards.filter(c => c.id !== id)
          }
        }));
      },

      openCeremony: () => set({ isCeremonyOpen: true }),
      closeCeremony: () => set({ isCeremonyOpen: false }),
      setCollapsing: (isCollapsing: boolean) => set({ isCollapsing }),

      terminateSeason: ({ title, reason, reflection, relicShape }) => {
        const state = get();
        const current = state.currentSeason;
        
        const archivedRecord: SeasonRecord = {
          ...current,
          title: title.trim() || current.title,
          reason,
          reflection: reflection.trim(),
          relicShape,
          endedAt: Date.now(),
          status: 'archived'
        };

        const nextSeasonNumber = current.seasonNumber + 1;
        const nextSeason = createInitialSeason(nextSeasonNumber);
        nextSeason.cards = [];

        set({
          archivedSeasons: [archivedRecord, ...state.archivedSeasons],
          currentSeason: nextSeason,
          isCeremonyOpen: false,
          isCollapsing: false
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsBackupOpen: (open) => set({ isBackupOpen: open }),

      exportData: () => {
        const state = get();
        const exportPayload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          currentSeason: state.currentSeason,
          archivedSeasons: state.archivedSeasons
        };
        return JSON.stringify(exportPayload, null, 2);
      },

      importData: (jsonStr: string) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed && parsed.currentSeason && Array.isArray(parsed.archivedSeasons)) {
            set({
              currentSeason: parsed.currentSeason,
              archivedSeasons: parsed.archivedSeasons,
              activeTab: 'canvas'
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error("Import failed:", e);
          return false;
        }
      },

      resetAll: () => {
        set({
          currentSeason: createInitialSeason(1),
          archivedSeasons: [],
          activeTab: 'canvas',
          isCeremonyOpen: false,
          isCollapsing: false
        });
      }
    }),
    {
      name: 'season-fuck-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
