import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'diary' | 'goals' | 'sparks' | 'vault' | 'shit';

interface DiaryEntry {
  id: string;
  time: string;
  text: string;
  images?: string[];
  charCount: number;
}

interface GoalEffortLog {
  id: string;
  time: string;
  text: string;
}

interface GoalItem {
  id: string;
  code: string;
  title: string;
  killed: boolean;
  time: string;
  logs: GoalEffortLog[];
}

interface SparkItem {
  id: string;
  tagId: string;
  title: string;
  description: string;
  tags: string[];
  rotation: string;
  isPriority?: boolean;
  time?: string;
}

interface VaultItem {
  id: string;
  logId: string;
  title: string;
  content: string;
  rawSecret?: string;
  tags: string[];
  encrypted?: boolean;
  rotation: string;
}

export type ThemeMode = 'cyber_rebel' | 'prts_white' | 'heaven_grief';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('heaven_grief');
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [sessionId, setSessionId] = useState('994-ERR');
  const [isTearing, setIsTearing] = useState(false);
  const [showTornBanner, setShowTornBanner] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const isWhite = theme === 'prts_white';
  const isGothic = theme === 'heaven_grief';
  const isCyber = theme === 'cyber_rebel';

  // --- DIARY STATE ---
  const [diaryText, setDiaryText] = useState('');
  const [diaryImages, setDiaryImages] = useState<string[]>([]);
  const diaryFileInputRef = useRef<HTMLInputElement>(null);

  // 格式化现实时间为形如 2026.8.27 16:17
  const formatRealDateTime = (d = new Date()) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const [diaries, setDiaries] = useState<DiaryEntry[]>([
    {
      id: 'd-1',
      time: `${formatRealDateTime()} | LOG_44`,
      text: 'WHY DOES THE COMPILER HATE ME TODAY... ENDLESS LOOP IN THE MATRIX.',
      charCount: 62,
    },
    {
      id: 'd-2',
      time: `${formatRealDateTime(new Date(Date.now() - 3600000))} | LOG_43`,
      text: 'Meetings that could have been emails. Complete cognitive void.',
      charCount: 56,
    },
  ]);

  // --- GOALS (KILL-LIST & EFFORTS) STATE ---
  const [newGoalText, setNewGoalText] = useState('');
  const [expandedGoalIds, setExpandedGoalIds] = useState<Record<string, boolean>>({
    'g-3': true, // 默认展开未完成的目标
  });
  const [effortInputTexts, setEffortInputTexts] = useState<Record<string, string>>({});

  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: 'g-1',
      code: '0x99F_SYS_FAIL',
      title: 'SMASH THE CORPORATE SYSTEM',
      killed: true,
      time: formatRealDateTime(new Date(Date.now() - 7200000)),
      logs: [
        { id: 'el-1', time: formatRealDateTime(new Date(Date.now() - 8000000)), text: '已解构旧的臃肿模板架构' },
        { id: 'el-2', time: formatRealDateTime(new Date(Date.now() - 7500000)), text: '彻底清空 AI-slop 元素' },
      ],
    },
    {
      id: 'g-2',
      code: '0x88A_LEGACY_ASH',
      title: 'BURN THE OLD CODEBASE',
      killed: true,
      time: formatRealDateTime(new Date(Date.now() - 5400000)),
      logs: [
        { id: 'el-3', time: formatRealDateTime(new Date(Date.now() - 5600000)), text: '移除了无用的旧逻辑组件' },
      ],
    },
    {
      id: 'g-3',
      code: '0x001_GENESIS',
      title: 'BUILD THE NEW DIGITAL ORDER',
      killed: false,
      time: formatRealDateTime(),
      logs: [
        { id: 'el-4', time: formatRealDateTime(new Date(Date.now() - 1800000)), text: '完成 Stitch 赛博粗野朋克界面移植' },
        { id: 'el-5', time: formatRealDateTime(new Date(Date.now() - 600000)), text: '加入图文混排与 Ctrl+V 截图支持' },
      ],
    },
  ]);

  // --- SPARKS (RAW IDEAS) STATE ---
  const [newSparkTitle, setNewSparkTitle] = useState('');
  const [newSparkDesc, setNewSparkDesc] = useState('');
  const [newSparkTags, setNewSparkTags] = useState('');
  const [newSparkPriority, setNewSparkPriority] = useState(false);
  const [selectedFilterTag, setSelectedFilterTag] = useState<string | null>(null);
  const [showSparkOptions, setShowSparkOptions] = useState(false);
  const [swipedSparkId, setSwipedSparkId] = useState<string | null>(null);

  // 编辑 Spark 状态
  const [editingSparkId, setEditingSparkId] = useState<string | null>(null);
  const [editSparkDraft, setEditSparkDraft] = useState<{
    title: string;
    description: string;
    tags: string;
    isPriority: boolean;
  }>({
    title: '',
    description: '',
    tags: '',
    isPriority: false,
  });

  const [sparks, setSparks] = useState<SparkItem[]>([
    {
      id: 's-1',
      tagId: '#ID_001',
      title: 'REBEL UI SYSTEM',
      description: 'Burn down pristine corporate templates. Inject chaos, hard offset shadows, and high-voltage crimson.',
      tags: ['DESIGN SYSTEM', 'CHAOS'],
      rotation: '',
      isPriority: true,
    },
    {
      id: 's-2',
      tagId: '#ID_002',
      title: 'ANARCHY FLOW',
      description: 'Execute corruption protocols on pristine logic. Scanlines and hard edges mandatory.',
      tags: ['PROTOCOL', 'GLITCH'],
      rotation: '',
    },
    {
      id: 's-3',
      tagId: '#ID_003',
      title: 'DATA OVERDOSE',
      description: 'Too much noise in the feed. Need extreme brutalist filter to isolate pure signals.',
      tags: ['SIGNAL', 'VOID'],
      rotation: '',
    },
  ]);

  // --- VAULT (SECURE ARCHIVES) STATE ---
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultContent, setNewVaultContent] = useState('');
  const [newVaultTags, setNewVaultTags] = useState('');
  const [newVaultEncrypt, setNewVaultEncrypt] = useState(true);
  const [showVaultForm, setShowVaultForm] = useState(false);
  const [swipedVaultId, setSwipedVaultId] = useState<string | null>(null);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    {
      id: 'v-1',
      logId: 'LOG_9942',
      title: 'PROJECT CHIMAERA',
      content: 'Initial test phase completed. Subject exhibited extreme resilience. Recommend immediate release of secondary protocols.',
      rawSecret: 'Initial test phase completed. Subject exhibited extreme resilience. Recommend immediate release of secondary protocols.',
      tags: ['ANOMALY', 'SECTOR_7'],
      encrypted: false,
      rotation: '',
    },
    {
      id: 'v-2',
      logId: 'LOG_9945',
      title: 'TARGET ZERO',
      content: '0x7F 0x8A 0x22 0x1C 0x99 0xFF 0x4D 0x3E 0x11 0x0A 0x55 0x6B 0x7C 0x88 0x9F 0xAA 0xBB 0xCC',
      rawSecret: 'The future is unwritten. Burn the old roadmap and construct from raw energy.',
      tags: ['ENCRYPTED', 'RESTRICTED'],
      encrypted: true,
      rotation: '',
    },
  ]);

  // --- IMAGE UPLOAD HELPERS ---
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setDiaryImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (diaryFileInputRef.current) diaryFileInputRef.current.value = '';
  };

  const handleDiaryPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              setDiaryImages((prev) => [...prev, reader.result as string]);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleRemoveDiaryImage = (index: number) => {
    setDiaryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- ACTIONS ---
  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryText.trim() && diaryImages.length === 0) return;

    const newLog: DiaryEntry = {
      id: Date.now().toString(),
      time: `${formatRealDateTime()} | LOG_${diaries.length + 1}`,
      text: diaryText.trim(),
      images: diaryImages.length > 0 ? [...diaryImages] : undefined,
      charCount: diaryText.trim().length,
    };

    setDiaries([newLog, ...diaries]);
    setDiaryText('');
    setDiaryImages([]);
  };

  const handleToggleGoal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextKilled = !g.killed;
          if (nextKilled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate(50);
            } catch (e) {}
          }
          return { ...g, killed: nextKilled };
        }
        return g;
      })
    );
  };

  const toggleExpandGoal = (id: string) => {
    setExpandedGoalIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newId = Date.now().toString();
    const newGoal: GoalItem = {
      id: newId,
      code: `0x${Math.floor(Math.random() * 900 + 100).toString(16).toUpperCase()}_KILL`,
      title: newGoalText.trim().toUpperCase(),
      killed: false,
      time: formatRealDateTime(),
      logs: [],
    };

    setGoals([newGoal, ...goals]);
    setNewGoalText('');
    setExpandedGoalIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleAddGoalEffort = (goalId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (effortInputTexts[goalId] || '').trim();
    if (!text) return;

    const newLog: GoalEffortLog = {
      id: Date.now().toString(),
      time: formatRealDateTime(),
      text,
    };

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, logs: [newLog, ...(g.logs || [])] } : g
      )
    );

    setEffortInputTexts((prev) => ({ ...prev, [goalId]: '' }));
  };

  const handleAddSpark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSparkTitle.trim()) return;

    // 解析标签（逗号或空格分割）
    const parsedTags = newSparkTags
      .split(/[,，\s]+/)
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const newSpark: SparkItem = {
      id: Date.now().toString(),
      tagId: `#ID_${String(sparks.length + 1).padStart(3, '0')}`,
      title: newSparkTitle.trim().toUpperCase(),
      description: newSparkDesc.trim() || 'NO_DETAILS_PROVIDED // RAW THOUGHT',
      tags: parsedTags.length > 0 ? parsedTags : ['RAW', 'IDEA'],
      rotation: '',
      isPriority: newSparkPriority,
      time: formatRealDateTime(),
    };

    // 置顶项优先排在最前
    setSparks((prev) => {
      const updated = [newSpark, ...prev];
      return updated.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));
    });

    setNewSparkTitle('');
    setNewSparkDesc('');
    setNewSparkTags('');
    setNewSparkPriority(false);
  };

  void handleToggleSparkPriority;
  function handleToggleSparkPriority(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setSparks((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, isPriority: !s.isPriority } : s));
      return updated.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));
    });
  }

  const handleDeleteSpark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSparks((prev) => prev.filter((s) => s.id !== id));
    if (editingSparkId === id) setEditingSparkId(null);
  };

  const handleStartEditSpark = (spark: SparkItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSparkId(spark.id);
    setEditSparkDraft({
      title: spark.title,
      description: spark.description,
      tags: spark.tags.join(', '),
      isPriority: !!spark.isPriority,
    });
  };

  const handleSaveEditSpark = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editSparkDraft.title.trim()) return;

    const parsedTags = editSparkDraft.tags
      .split(/[,，\s]+/)
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    setSparks((prev) => {
      const updated = prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title: editSparkDraft.title.trim().toUpperCase(),
              description: editSparkDraft.description.trim() || 'NO_DETAILS_PROVIDED // RAW THOUGHT',
              tags: parsedTags.length > 0 ? parsedTags : ['RAW', 'IDEA'],
              isPriority: editSparkDraft.isPriority,
            }
          : s
      );
      return updated.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));
    });

    setEditingSparkId(null);
  };

  const handleCancelEditSpark = () => {
    setEditingSparkId(null);
  };

  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultTitle.trim() || !newVaultContent.trim()) return;

    const parsedTags = newVaultTags
      .split(/[,，\s]+/)
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    // 生成一组黑客风格的 Hex 乱码
    const hexMask = Array.from({ length: 16 }, () =>
      '0x' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
    ).join(' ');

    const newVault: VaultItem = {
      id: Date.now().toString(),
      logId: `LOG_${Math.floor(Math.random() * 9000 + 1000)}`,
      title: newVaultTitle.trim().toUpperCase(),
      content: newVaultEncrypt ? hexMask : newVaultContent.trim(),
      rawSecret: newVaultContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : (newVaultEncrypt ? ['ENCRYPTED', 'CIPHER'] : ['ARCHIVE']),
      encrypted: newVaultEncrypt,
      rotation: '',
    };

    setVaultItems([newVault, ...vaultItems]);
    setNewVaultTitle('');
    setNewVaultContent('');
    setNewVaultTags('');
    setNewVaultEncrypt(true);
    setShowVaultForm(false);
  };

  const handleDeleteVaultItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVaultItems((prev) => prev.filter((v) => v.id !== id));
  };

  const handleDecryptVault = (id: string) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(60);
      } catch (e) {}
    }

    setVaultItems((prev) =>
      prev.map((v) => {
        if (v.id === id && v.encrypted) {
          return {
            ...v,
            encrypted: false,
            content: `DECRYPTED: "${v.rawSecret || v.content}"`,
          };
        }
        return v;
      })
    );
  };

  // 全局核心破坏仪式：TEAR IT (FUCK / 彻底撕毁重开)
  const triggerTearIt = () => {
    setIsTearing(true);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 60, 150]);
      } catch (e) {}
    }

    setTimeout(() => {
      setSessionId(`${Math.floor(Math.random() * 900 + 100)}-SYS`);
      setDiaries([]);
      setGoals([
        {
          id: 'g-new',
          code: '0x001_RESET',
          title: 'RISE FROM THE ASHES',
          killed: false,
          time: '00:00',
          logs: [],
        },
      ]);
      setSparks([]);
      setIsTearing(false);
      setShowTornBanner(true);
      setTimeout(() => setShowTornBanner(false), 2400);
    }, 450);
  };

  return (
    <div className={`min-h-screen flex justify-center items-center p-0 sm:p-4 select-none ${
      isGothic
        ? 'bg-[#020204] text-[#F5F5FA]'
        : isWhite
        ? 'bg-[#ECEEF0] text-[#191C1E] font-space'
        : 'bg-[#0E0E11] text-[#E4E1E7] scanline-bg font-chivo'
    }`}>
      
      {/* 手机客户端主外壳容器 */}
      <div className={`relative w-full max-w-md h-screen sm:h-[880px] sm:max-h-[94vh] flex flex-col sm:border-2 overflow-hidden ${
        isGothic
          ? 'bg-[#050508] border-[#E8DCC4]/30 shadow-[0_0_30px_rgba(0,0,0,0.9)] sm:shadow-[0_0_25px_rgba(232,220,196,0.15)]'
          : isWhite
          ? 'bg-blueprint border-[#191C1E] shadow-[8px_8px_0px_0px_#191C1E]'
          : 'bg-[#131317] border-[#FFB3AF] shadow-[8px_8px_0px_0px_rgba(255,179,175,0.75)]'
      }`}>
        
        {/* ========================================================================= */}
        {/* 顶部栏 (TopAppBar - 纯净舒展、无挤压、直立清晰排版) */}
        {/* ========================================================================= */}
        <header className={`flex items-center justify-between px-4 py-3 border-b-2 z-30 ${
          isGothic
            ? 'bg-[#050508] border-[#E8DCC4]/30 shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
            : isWhite
            ? 'bg-[#F2F4F6] border-[#191C1E] shadow-[0_2px_0px_0px_#191C1E]'
            : 'bg-[#131317] border-[#FFB3AF] shadow-[0_4px_0px_0px_rgba(255,179,175,0.3)]'
        }`}>
          <div className="flex items-center gap-3">
            {/* 侧边栏汉堡菜单按钮 */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={`p-1.5 border transition-all cursor-pointer flex items-center justify-center ${
                isGothic
                  ? 'border-[#E8DCC4]/40 bg-transparent text-[#E8DCC4] hover:bg-[#E8DCC4] hover:text-[#050508]'
                  : isWhite
                  ? 'border-[#191C1E] bg-[#191C1E] text-white hover:bg-[#006875]'
                  : 'border-2 border-transparent hover:border-[#FFB3AF] hover:bg-[#FFB3AF] hover:text-[#68000E] text-[#FFB3AF]'
              }`}
              title="OPEN SYSTEM DRAWER (THEME MATRIX / NAV)"
            >
              <span className="material-symbols-outlined text-[20px] block leading-none">
                menu
              </span>
            </button>

            {/* 系统标题 (直立刚劲，彻底解决压缩模糊问题) */}
            <span className={`uppercase font-bold tracking-normal leading-none ${
              isGothic
                ? 'font-bodoni text-lg sm:text-xl text-[#E8DCC4] tracking-widest'
                : isWhite
                ? 'font-space text-xl text-[#191C1E]'
                : 'font-anton text-2xl text-[#FFB3AF]'
            }`}>
              {isGothic ? 'HEAVEN_GRIEF' : isWhite ? 'PRTS // TERMINAL' : 'SYS_REBEL'}
            </span>

            {/* 赛季 Badge */}
            <span className={`font-mono-code text-[10px] px-2 py-0.5 font-bold uppercase shrink-0 ${
              isGothic
                ? 'border border-[#E8DCC4]/40 text-[#E8DCC4] bg-[#0A0A0F]'
                : isWhite
                ? 'bg-[#191C1E] text-white'
                : 'bg-[#FF5357] text-[#5C000B]'
            }`}>
              {isGothic ? '0x99_GRIEF' : isWhite ? '602-PRTS' : sessionId}
            </span>
          </div>

          {/* ⚡ FUCK / HELLFALL 重置大招 */}
          <motion.button
            onClick={triggerTearIt}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all group cursor-pointer ${
              isGothic
                ? 'border border-[#FF2442] bg-[#120508] text-[#FF2442] hover:bg-[#FF2442] hover:text-white glow-crimson-laser'
                : isWhite
                ? 'bg-[#BA1A1A] text-white btn-chamfer border-none shadow-[2px_2px_0px_0px_#191C1E] hover:bg-[#93000A]'
                : 'border-2 border-[#FFB3AF] bg-[#1F1F23] hover:bg-[#FFB3AF] hover:text-[#68000E] text-[#FFB3AF] shadow-[3px_3px_0px_0px_#FF5357] hover:shadow-[1px_1px_0px_0px_#FF5357]'
            }`}
            title="TEAR CURRENT SESSION // HARD REBOOT"
          >
            <span className={`font-bold tracking-wider uppercase ${
              isGothic
                ? 'font-bodoni text-xs text-[#FF2442] group-hover:text-white'
                : isWhite
                ? 'font-space text-xs'
                : 'font-anton text-base text-[#FF5357] group-hover:text-[#68000E]'
            }`}>
              {isGothic ? 'HELLFALL' : 'FUCK'}
            </span>
            <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">
              restart_alt
            </span>
          </motion.button>
        </header>

        {/* ========================================================================= */}
        {/* 主视口内容区 (可被暴力撕毁飞出) */}
        {/* ========================================================================= */}
        <motion.div
          animate={isTearing ? {
            x: -600,
            y: 700,
            rotate: -45,
            opacity: 0,
            transition: { duration: 0.42, ease: [0.32, 0, 0.67, 0] }
          } : {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1
          }}
          className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${
            isGothic ? 'bg-[#050508]' : isWhite ? 'bg-blueprint' : 'brutalist-grid'
          }`}
        >
          
          {/* ===================================================================== */}
          {/* TAB 1: RAW_DIARY (真实图文日记 - 依据主题完全异构的三模排版架构) */}
          {/* ===================================================================== */}
          {activeTab === 'diary' && (
            isGothic ? (
              /* ⚜️ HEAVEN_GRIEF 专属：先锋赛博神圣哥特 · 悼亡圣咏录排版 */
              <div className="space-y-4">
                {/* 哥特标头 */}
                <div className="border-b border-[#E8DCC4]/30 pb-2.5 flex justify-between items-end">
                  <div>
                    <div className="font-mono-code text-[9px] text-[#E8DCC4]/70 tracking-widest uppercase">
                      RECORD_OF_SORROW // 0xAF92
                    </div>
                    <h2 className="font-bodoni text-2xl font-bold text-[#F5F5FA] tracking-wide mt-0.5">
                      LAMENT DIARY
                    </h2>
                  </div>
                  <div className="border border-[#D4AF37]/50 text-[#E8DCC4] px-2 py-0.5 font-mono-code text-[9px] uppercase tracking-wider bg-[#09090D]">
                    ✦ SANCTIFIED
                  </div>
                </div>

                {/* 🌟 哥特遥测仪表盘 (SYNAPSE METRICS) */}
                <div className="border border-[#E8DCC4]/20 bg-[#09090D] p-3 space-y-2 glow-gold-wire">
                  <div className="flex justify-between items-center text-[10px] font-mono-code text-[#E8DCC4]/80 border-b border-[#E8DCC4]/15 pb-1">
                    <span className="tracking-widest">// SYNAPSE_METRICS</span>
                    <span className="text-[#888890]">DIAGNOSTIC_V7</span>
                  </div>
                  <div className="space-y-1.5 font-mono-code text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#888890]">+ Sorrow Quotient</span>
                      <span className="text-[#E8DCC4] font-bold">98.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#888890]">+ Divine Latency</span>
                      <span className="text-[#E2E2E8]">404ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#888890]">+ Grace Degradation</span>
                      <span className="text-[#FF2442] font-bold tracking-wider animate-pulse">CRITICAL</span>
                    </div>
                  </div>
                </div>

                {/* 圣咏录入黑曜石板 */}
                <div className="border border-[#E8DCC4]/30 bg-[#0A0A0F] p-3.5 space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-mono-code text-[#E8DCC4]/60 border-b border-[#E8DCC4]/15 pb-1.5">
                    <span>// LITURGICAL_TRANSCRIBE</span>
                    <span>PSALM_BUFFER</span>
                  </div>

                  <form onSubmit={handleAddDiary} className="space-y-3">
                    <textarea
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      onPaste={handleDiaryPaste}
                      placeholder="Transcribe the digital sorrow into the obsidian altar (Ctrl+V supported)..."
                      rows={3}
                      className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] font-chivo p-3 text-xs focus:outline-none focus:border-[#E8DCC4] resize-none placeholder-[#888890]/60"
                    />

                    {/* 图片缩略图预览 */}
                    {diaryImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {diaryImages.map((img, idx) => (
                          <div key={idx} className="relative border border-[#E8DCC4]/40 bg-[#050508] p-1">
                            <img src={img} alt="attachment" className="w-16 h-16 object-cover grayscale contrast-150" />
                            <button
                              type="button"
                              onClick={() => handleRemoveDiaryImage(idx)}
                              className="absolute -top-1.5 -right-1.5 bg-[#960018] text-white w-4 h-4 flex items-center justify-center font-bold text-xs cursor-pointer border border-[#E8DCC4]"
                            >
                              ×
                            </button>
                            <span className="block font-mono-code text-[7px] text-[#E8DCC4]/70 mt-0.5 text-center">
                              RELIC_{idx + 1}.tif
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t border-[#E8DCC4]/15">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={diaryFileInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => diaryFileInputRef.current?.click()}
                          className="flex items-center gap-1 border border-[#E8DCC4]/30 bg-[#050508] text-[#E8DCC4] hover:border-[#E8DCC4] px-2 py-1 font-mono-code text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">add_photo_alternate</span>
                          <span>ATTACH_RELIC</span>
                        </button>
                        <span className="font-mono-code text-[9px] text-[#888890]">
                          LENGTH: {diaryText.length}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!diaryText.trim() && diaryImages.length === 0}
                        className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white hover:text-black disabled:opacity-30 px-3.5 py-1.5 font-bodoni text-xs font-bold uppercase transition-all cursor-pointer shadow-[0_0_8px_rgba(232,220,196,0.25)]"
                      >
                        [ COMMIT PSALM ]
                      </button>
                    </div>
                  </form>
                </div>

                {/* 悼亡日志历史流 (带有 VERSUS 圣咏标记与 3D 多面体神圣几何视窗) */}
                <div className="space-y-3 pt-1">
                  <div className="text-[10px] font-mono-code text-[#E8DCC4] font-bold border-b border-[#E8DCC4]/20 pb-1 flex justify-between">
                    <span>// PSALM_CHRONICLES ({diaries.length})</span>
                    <span>SACRED_ALTAR</span>
                  </div>

                  <div className="space-y-4">
                    {diaries.length === 0 ? (
                      <div className="py-6 text-center text-xs font-mono-code text-[#888890]">
                        NO PSALMS RECORDED IN THE SACRED ARCHIVE.
                      </div>
                    ) : (
                      diaries.map((log, index) => (
                        <article
                          key={log.id}
                          className="border border-[#E8DCC4]/30 bg-[#08080C] p-4 space-y-3 relative hover:border-[#E8DCC4] transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                        >
                          {/* 圣咏顶部罗马数字 */}
                          <div className="flex justify-between items-center text-[9px] font-mono-code border-b border-[#E8DCC4]/15 pb-1.5 text-[#E8DCC4]">
                            <span className="tracking-widest uppercase font-bold">
                              ✦ VERSUS_{index === 0 ? 'VII' : index === 1 ? 'IV' : `0${index + 1}`} // 0x99_GRIEF
                            </span>
                            <span className="text-[#888890] text-[8px]">
                              {log.time}
                            </span>
                          </div>

                          <h3 className="font-bodoni text-lg text-[#F5F5FA] font-bold tracking-wide">
                            THE WEEPING OF MARBLE SAINTS
                          </h3>

                          {/* 圣咏引言 */}
                          <p className="font-bodoni italic text-xs text-[#D8D0B8] border-l-2 border-[#D4AF37] pl-2.5 py-0.5 leading-relaxed">
                            "And so the digital tears fell upon the obsidian altar, rendering the code obsolete. The angels wept in binary, their sorrow unparsable by mortal machines."
                          </p>

                          {log.text && (
                            <p className="font-chivo text-xs text-[#C8C8D0] leading-relaxed whitespace-pre-wrap">
                              {log.text}
                            </p>
                          )}

                          {/* 🌟 核心创新：多面体神圣几何光环视窗 (100% 像素级复刻图 2 的 CORRUPTED_HALO.TIF) */}
                          <div className="p-3 border border-[#E8DCC4]/30 bg-[#050508] relative overflow-hidden group">
                            <div className="flex justify-between items-center text-[8px] font-mono-code text-[#E8DCC4] border-b border-[#E8DCC4]/15 pb-1 mb-2">
                              <span>EVIDENCE_01 // CORRUPTED_HALO.TIF</span>
                              <span className="text-[#FF2442] animate-pulse">✦ RECONSTRUCTED</span>
                            </div>
                            
                            {/* SVG 3D 多面体神圣几何光环星云 */}
                            <div className="h-28 flex items-center justify-center relative bg-gradient-to-b from-[#0A0A10] to-[#040406]">
                              <svg className="w-40 h-24 stroke-[#E8DCC4] opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 160 100" fill="none">
                                {/* 多面体星云线条 */}
                                <polygon points="80,15 110,40 80,65 50,40" strokeWidth="1" strokeDasharray="3 2" />
                                <polygon points="80,25 100,50 80,75 60,50" strokeWidth="1.2" />
                                <circle cx="80" cy="50" r="30" strokeWidth="0.8" stroke="#D4AF37" strokeDasharray="4 4" />
                                <circle cx="80" cy="50" r="18" strokeWidth="1.5" stroke="#FF2442" opacity="0.7" />
                                {/* 准星与光环坐标 */}
                                <line x1="80" y1="5" x2="80" y2="95" strokeWidth="0.5" stroke="#E8DCC4" opacity="0.4" />
                                <line x1="15" y1="50" x2="145" y2="50" strokeWidth="0.5" stroke="#E8DCC4" opacity="0.4" />
                                <polygon points="35,30 55,45 40,60 20,45" strokeWidth="0.8" stroke="#888890" />
                                <polygon points="125,30 145,45 130,60 110,45" strokeWidth="0.8" stroke="#888890" />
                              </svg>
                              <div className="absolute bottom-1 right-2 text-[7px] font-mono-code text-[#888890]">
                                LOC: [0xFA40_NEBULA]
                              </div>
                            </div>
                          </div>

                          {/* 附件缩略图 */}
                          {log.images && log.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {log.images.map((img, i) => (
                                <div
                                  key={i}
                                  onClick={() => setSelectedPreviewImage(img)}
                                  className="p-1 border border-[#E8DCC4]/40 bg-[#050508] cursor-pointer hover:border-[#E8DCC4] transition-all"
                                >
                                  <img
                                    src={img}
                                    alt="relic crop"
                                    className="w-20 h-20 object-cover grayscale contrast-150"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : isWhite ? (
              /* ⚪ PRTS_WHITE 专属：明日方舟 / 众生行记 战术时间轴折线流排版 */
              <div className="space-y-4">
                {/* PRTS 顶部战术标头 */}
                <div className="border-b-2 border-[#191C1E] pb-2 flex justify-between items-end relative">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#191C1E] text-white font-mono-code text-[9px] px-1.5 py-0.5 font-bold">[PRTS-001]</span>
                      <h2 className="font-space text-lg font-bold text-[#191C1E] uppercase tracking-wide">
                        RAW_DIARY // PROTOCOL_STREAM
                      </h2>
                    </div>
                    <div className="font-mono-code text-[9px] text-[#76777B] mt-0.5">
                      GRID_LOC: 45.923N, 14.234E · TERMINAL_ONLINE
                    </div>
                  </div>
                  <div className="font-mono-code text-[9px] bg-[#006875] text-white px-2 py-0.5 font-bold uppercase">
                    ACTIVE_LINK
                  </div>
                </div>

                {/* PRTS 战术日志录入终端卡片 */}
                <div className="bg-white border-2 border-[#191C1E] p-3.5 shadow-[4px_4px_0px_0px_#191C1E] crop-marks relative">
                  <div className="flex justify-between items-center pb-2 mb-2.5 border-b border-[#D8DADC] text-[9px] font-mono-code text-[#76777B]">
                    <span>// TRANSMITTER_STREAM_V3</span>
                    <span>|||||||||||||||| 90X2</span>
                  </div>

                  <form onSubmit={handleAddDiary} className="space-y-3">
                    <textarea
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      onPaste={handleDiaryPaste}
                      placeholder="ENTER TACTICAL LOG DATA / RAW OBSERVATION (Ctrl+V supported)..."
                      rows={3}
                      className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] font-space p-3 text-xs focus:outline-none focus:border-[#191C1E] resize-none placeholder-[#76777B]"
                    />

                    {/* 图片附件缩略图 */}
                    {diaryImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {diaryImages.map((img, idx) => (
                          <div key={idx} className="relative group border border-[#191C1E] bg-[#F8F9FB] p-1 shadow-[2px_2px_0px_0px_#191C1E]">
                            <img src={img} alt="attachment" className="w-16 h-16 object-cover grayscale contrast-125" />
                            <button
                              type="button"
                              onClick={() => handleRemoveDiaryImage(idx)}
                              className="absolute -top-2 -right-2 bg-[#BA1A1A] text-white w-4 h-4 flex items-center justify-center font-bold text-xs cursor-pointer border border-[#191C1E]"
                            >
                              ×
                            </button>
                            <span className="block font-mono-code text-[8px] text-[#76777B] mt-0.5 text-center">
                              SATELLITE_{idx + 1}.dat
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t border-[#D8DADC]">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={diaryFileInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => diaryFileInputRef.current?.click()}
                          className="flex items-center gap-1 border border-[#191C1E] bg-[#F8F9FB] text-[#191C1E] hover:bg-[#191C1E] hover:text-white px-2 py-1 font-mono-code text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">add_photo_alternate</span>
                          <span>ATTACH_IMG</span>
                        </button>
                        <span className="font-mono-code text-[9px] text-[#76777B]">
                          CHARS: {diaryText.length}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!diaryText.trim() && diaryImages.length === 0}
                        className="bg-[#191C1E] text-white hover:bg-[#006875] disabled:opacity-40 px-3.5 py-1.5 font-mono-code text-xs font-bold uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_#76777B] flex items-center gap-1.5 btn-chamfer"
                      >
                        <span>[COMMIT_LOG]</span>
                        <span className="material-symbols-outlined text-[14px]">terminal</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* PRTS 战术垂直折线时间轴列表 */}
                <div className="space-y-3 pt-1">
                  <div className="text-[10px] font-mono-code text-[#191C1E] font-bold border-b border-[#D8DADC] pb-1 flex justify-between">
                    <span>// HISTORICAL_LOG_BUFFER ({diaries.length})</span>
                    <span>TIMELINE_CHRONO</span>
                  </div>

                  <div className="relative pl-5 border-l-2 border-[#191C1E] space-y-4 ml-1.5">
                    {diaries.length === 0 ? (
                      <div className="py-6 text-center text-xs font-mono-code text-[#76777B]">
                        NO HISTORICAL ENTRIES RECORDED IN PRTS BUFFER.
                      </div>
                    ) : (
                      diaries.map((log, index) => (
                        <div key={log.id} className="relative group">
                          {/* 战术导轨菱形节点 */}
                          <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-[#191C1E] border border-white rotate-45 group-hover:bg-[#006875] transition-colors"></div>

                          {/* 战术卡片 */}
                          <div className="bg-white border border-[#191C1E] p-3 shadow-[3px_3px_0px_0px_#191C1E] hover:border-[#006875] transition-colors space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-mono-code border-b border-[#ECEEF0] pb-1">
                              <span className="bg-[#ECEEF0] text-[#191C1E] px-1 py-0.5 font-bold">
                                {log.time}
                              </span>
                              <span className="text-[#76777B]">
                                |||||||||| {index + 1}X{log.id.slice(-2)}
                              </span>
                            </div>

                            {log.text && (
                              <p className="font-space text-xs text-[#191C1E] leading-relaxed whitespace-pre-wrap">
                                {log.text}
                              </p>
                            )}

                            {/* 卫星遥感图像裁切视窗 */}
                            {log.images && log.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {log.images.map((img, i) => (
                                  <div
                                    key={i}
                                    onClick={() => setSelectedPreviewImage(img)}
                                    className="crop-marks p-1 bg-[#F2F4F6] border border-[#D8DADC] cursor-pointer hover:border-[#191C1E] transition-colors"
                                  >
                                    <img
                                      src={img}
                                      alt="tactical crop"
                                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
                                    />
                                    <span className="block font-mono-code text-[8px] text-[#76777B] text-center mt-0.5">
                                      SATELLITE_IMG_{i + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* 🌑 SYS_REBEL 专属：暗黑粗野便签打孔朋克排版 */
              <div className="space-y-4">
                {/* 模块标头 */}
                <div className="flex justify-between items-center">
                  <h2 className="font-anton text-2xl uppercase text-[#FFB3AF] bg-[#2A2A2E] px-3 py-1 border-l-4 border-[#FFB3AF] shadow-[3px_3px_0px_0px_#FFB3AF]">
                    RAW_DIARY.log
                  </h2>
                  <div className="font-mono-code text-[11px] text-[#FFB3AF] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF5357] animate-pulse"></span>
                    RECORDING
                  </div>
                </div>

                {/* 撕裂打孔便签卡片 (支持图文混合) */}
                <div className="relative bg-[#1F1F23] border-2 border-[#FFB3AF] p-4 shadow-[6px_6px_0px_0px_#FFB3AF]">
                  <div className="border-b border-dashed border-[#FFB3AF]/60 pb-1 mb-3 flex justify-between items-center text-[10px] font-mono-code text-[#E9BCB9]">
                    <span>[PERFORATION_LINE]</span>
                    <span>SYS_TIME: {formatRealDateTime()}</span>
                  </div>

                  <form onSubmit={handleAddDiary} className="space-y-3">
                    <textarea
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      onPaste={handleDiaryPaste}
                      placeholder="WRITE DOWN RAW THOUGHTS & MOMENTS (Ctrl+V supported)..."
                      rows={4}
                      className="w-full bg-[#131317] border-b-2 border-[#E4E1E7] text-[#E4E1E7] font-chivo p-3 text-sm focus:outline-none focus:border-[#FFB3AF] resize-none placeholder-[#5F3E3D]"
                    />

                    {/* 选中的图片缩略图预览列表 */}
                    {diaryImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {diaryImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group border-2 border-[#FFB3AF] bg-[#131317] p-1 shadow-[3px_3px_0px_0px_#FFB3AF]"
                          >
                            <img
                              src={img}
                              alt="attachment"
                              className="w-16 h-16 object-cover filter contrast-125"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveDiaryImage(idx)}
                              className="absolute -top-2 -right-2 bg-[#FF5357] text-[#5C000B] w-5 h-5 flex items-center justify-center font-bold text-xs border border-[#FFB3AF] hover:bg-[#FFB3AF] transition-colors"
                            >
                              ×
                            </button>
                            <span className="block font-mono-code text-[8px] text-[#E9BCB9] mt-0.5 text-center">
                              IMG_{idx + 1}.dat
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 底部操作区：添加附件 + 字符统计 + 提交 */}
                    <div className="flex justify-between items-center pt-1 border-t border-[#343438]">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={diaryFileInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => diaryFileInputRef.current?.click()}
                          className="flex items-center gap-1 border border-[#5F3E3D] hover:border-[#FFB3AF] bg-[#131317] text-[#E9BCB9] hover:text-[#FFB3AF] px-2 py-1 font-mono-code text-[11px] uppercase transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">add_photo_alternate</span>
                          <span>ATTACH_IMG</span>
                        </button>
                        <span className="font-mono-code text-[10px] text-[#8E8E93]">
                          CHARS: {diaryText.length}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!diaryText.trim() && diaryImages.length === 0}
                        className="border-2 border-[#FFB3AF] bg-[#FFB3AF] text-[#68000E] hover:bg-[#FF5357] disabled:opacity-40 px-4 py-1.5 font-mono-code text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_0px_#131317]"
                      >
                        COMMIT_LOG
                      </button>
                    </div>
                  </form>
                </div>

                {/* 历史记录列表 (支持图文渲染) */}
                <div className="border-2 border-[#2A2A2E] p-3 bg-[#0E0E11]">
                  <h3 className="font-anton text-sm text-[#E4E1E7] border-b border-dashed border-[#343438] pb-1 mb-2 uppercase">
                    PREVIOUS LOGS ({diaries.length})
                  </h3>
                  <div className="space-y-3">
                    {diaries.length === 0 ? (
                      <div className="py-8 text-center text-xs font-mono-code text-[#5F3E3D]">
                        NO LOGS FOUND. THE VOID IS CURRENTLY QUIET.
                      </div>
                    ) : (
                      diaries.map((log) => (
                        <div
                          key={log.id}
                          className="border-l-4 border-[#FFB3AF] bg-[#1F1F23]/70 p-3 text-xs hover:bg-[#2A2A2E] transition-colors space-y-2"
                        >
                          <div className="font-mono-code text-[10px] text-[#E9BCB9]">
                            {log.time}
                          </div>
                          
                          {log.text && (
                            <div className="text-[#E4E1E7] whitespace-pre-wrap leading-relaxed">
                              {log.text}
                            </div>
                          )}

                          {log.images && log.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {log.images.map((img, i) => (
                                <div
                                  key={i}
                                  onClick={() => setSelectedPreviewImage(img)}
                                  className="border-2 border-[#5F3E3D] hover:border-[#FFB3AF] bg-[#131317] p-1 cursor-pointer transition-colors"
                                >
                                  <img
                                    src={img}
                                    alt="attachment"
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover filter contrast-125 hover:scale-105 transition-transform"
                                  />
                                  <span className="block font-mono-code text-[8px] text-[#B08784] text-center mt-0.5">
                                    IMG_ATTACH_{i + 1}.dat
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* ===================================================================== */}
          {/* TAB 2: KILL_LIST_GOALS (依据主题完全异构的斩杀目标协议) */}
          {/* ===================================================================== */}
          {activeTab === 'goals' && (
            isGothic ? (
              /* ⚜️ HEAVEN_GRIEF 专属：先锋赛博神圣哥特 · 圣裁断罪台排版 */
              <div className="space-y-4">
                {/* 哥特断罪标头 */}
                <div className="border-b border-[#E8DCC4]/30 pb-2.5 flex justify-between items-end">
                  <div>
                    <div className="font-mono-code text-[9px] text-[#E8DCC4]/70 tracking-widest uppercase">
                      // 0X99_JUDGMENT
                    </div>
                    <h2 className="font-bodoni text-2xl font-bold text-[#F5F5FA] tracking-wide mt-0.5">
                      SANCTUS_PURGE
                    </h2>
                  </div>
                  <span className="font-mono-code text-[9px] border border-[#FF2442] text-[#FF2442] px-2 py-0.5 font-bold uppercase bg-[#120508] tracking-wider">
                    SIN_QUOTIENT: ACTIVE
                  </span>
                </div>

                {/* 快速下达罪名录入框 */}
                <form onSubmit={handleAddGoal} className="flex gap-2 bg-[#0A0A0F] p-2 border border-[#E8DCC4]/30">
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="ENTER ENTITY OR SIN TO CONDEMN & PURGE..."
                    className="flex-1 bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] px-3 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                  />
                  <button
                    type="submit"
                    disabled={!newGoalText.trim()}
                    className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white disabled:opacity-30 px-3.5 py-1.5 font-bodoni text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    + JUDGE
                  </button>
                </form>

                {/* 🌟 100% 像素级复刻：哥特尖拱门断罪卡片矩阵 (Gothic Arch Portal) */}
                <div className="space-y-4">
                  {goals.map((item) => {
                    const isExpanded = !!expandedGoalIds[item.id];
                    const logCount = item.logs?.length || 0;

                    return (
                      <article
                        key={item.id}
                        className={`border p-4 transition-all select-none relative overflow-hidden ${
                          item.killed
                            ? 'bg-[#060608] border-[#E8DCC4]/20 opacity-75'
                            : 'bg-[#08080C] border-[#E8DCC4]/40 shadow-[0_0_20px_rgba(232,220,196,0.12)] hover:border-[#E8DCC4]'
                        }`}
                      >
                        {/* 顶部神圣哥特尖拱门神坛视窗 (100% 复刻图 1 的 Cathedral Archway Portal) */}
                        <div className="relative border border-[#E8DCC4]/30 bg-[#040406] p-3 text-center overflow-hidden mb-3">
                          {/* 尖拱门背景装饰线 */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                            <svg className="w-full h-full stroke-[#E8DCC4]" viewBox="0 0 200 100" fill="none">
                              <path d="M 30 100 L 30 50 C 30 15 80 5 100 5 C 120 5 170 15 170 50 L 170 100" strokeWidth="1.2" strokeDasharray="3 3" />
                              <circle cx="100" cy="45" r="22" strokeWidth="0.8" stroke="#D4AF37" />
                              <line x1="100" y1="0" x2="100" y2="100" strokeWidth="0.5" stroke="#FF2442" opacity="0.6" />
                              <line x1="20" y1="45" x2="180" y2="45" strokeWidth="0.5" stroke="#FF2442" opacity="0.6" />
                            </svg>
                          </div>

                          <div className="relative z-10 space-y-1">
                            <div className="font-mono-code text-[8px] text-[#E8DCC4]/70 tracking-widest uppercase flex justify-between">
                              <span>0x99_ALTAR // {item.code}</span>
                              <span className="text-[#FF2442] font-bold">✦ SACRED_TARGET</span>
                            </div>
                            <h3 className="font-bodoni text-xl text-[#F5F5FA] font-bold tracking-wide mt-1">
                              {item.title}
                            </h3>
                            <div className="font-mono-code text-[10px] text-[#D8D0B8] tracking-wider">
                              SIN_QUOTIENT: {item.killed ? '0.0% (ABSOLVED)' : '98.4%'}
                            </div>
                          </div>

                          {/* 5段神圣几何光环念珠进度槽 (✦ ✦ ✦ ✧ ✧) */}
                          <div className="relative z-10 flex justify-center items-center gap-2 mt-2 pt-2 border-t border-[#E8DCC4]/15">
                            {[0, 1, 2, 3, 4].map((slotIdx) => (
                              <div
                                key={slotIdx}
                                className={`w-3 h-3 flex items-center justify-center border text-[9px] font-bold transition-all ${
                                  slotIdx < logCount || item.killed
                                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#120D05] shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                                    : 'border-[#E8DCC4]/20 text-[#888890] bg-[#050508]'
                                }`}
                              >
                                ✦
                              </div>
                            ))}
                            <span className="font-mono-code text-[9px] text-[#E8DCC4] ml-1.5">
                              PENANCE: {logCount}/5
                            </span>
                          </div>
                        </div>

                        {/* 1px 猩红激光刻度条 */}
                        <div className="h-1 w-full bg-[#150508] border border-[#FF2442]/30 my-2 relative overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#960018] to-[#FF2442] glow-crimson-laser transition-all"
                            style={{ width: item.killed ? '100%' : `${Math.min(100, Math.max(15, (logCount / 5) * 100))}%` }}
                          />
                        </div>

                        {/* 折叠日常忏悔记录 */}
                        <div className="border-t border-dashed border-[#E8DCC4]/20 pt-2 mt-2">
                          <div
                            onClick={() => toggleExpandGoal(item.id)}
                            className="font-mono-code text-[10px] text-[#E8DCC4] font-bold cursor-pointer flex justify-between items-center hover:text-white select-none"
                          >
                            <span>{isExpanded ? '[-] CONCEAL PSALMS' : '[+] CONFESSION LOGS'}</span>
                            <span className="text-[#888890] text-[9px]">[{logCount} ENTRIES]</span>
                          </div>

                          {isExpanded && (
                            <div className="mt-2.5 space-y-2 pt-1 border-t border-[#E8DCC4]/15">
                              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                                {logCount === 0 ? (
                                  <div className="text-[10px] font-mono-code text-[#888890] py-1.5 text-center">
                                    NO CONFESSION LOGS RECORDED. ADVANCE PURGATION ↘
                                  </div>
                                ) : (
                                  item.logs.map((log) => (
                                    <div
                                      key={log.id}
                                      className="p-1.5 text-xs bg-[#050508] border-l-2 border-[#D4AF37] space-y-0.5 text-[#F5F5FA]"
                                    >
                                      <div className="font-mono-code text-[8px] text-[#E8DCC4]/70">
                                        &gt; {log.time}
                                      </div>
                                      <div className="font-chivo text-xs leading-tight">
                                        {log.text}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              <form
                                onSubmit={(e) => handleAddGoalEffort(item.id, e)}
                                className="flex gap-1 pt-1"
                              >
                                <input
                                  type="text"
                                  value={effortInputTexts[item.id] || ''}
                                  onChange={(e) =>
                                    setEffortInputTexts((prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Log penance effort (1% advance)..."
                                  className="flex-1 bg-[#050508] border border-[#E8DCC4]/25 text-[#F5F5FA] px-2 py-1 text-xs font-chivo focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                                />
                                <button
                                  type="submit"
                                  disabled={!(effortInputTexts[item.id] || '').trim()}
                                  className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white disabled:opacity-30 px-2.5 py-1 font-bodoni text-[10px] font-bold uppercase transition-colors cursor-pointer"
                                >
                                  + LOG
                                </button>
                              </form>
                            </div>
                          )}
                        </div>

                        {/* 🌟 哥特天谴滑动斩杀条 */}
                        {!item.killed ? (
                          <div className="mt-3 border border-[#FF2442] bg-[#120406] relative h-11 flex items-center overflow-hidden select-none">
                            <div className="w-full text-center font-mono-code text-[10px] text-[#FF2442] font-bold tracking-widest uppercase opacity-85 pointer-events-none">
                              SLIDE CROSSHAIR &gt;&gt; CALL HELLFALL
                            </div>
                            <motion.div
                              drag="x"
                              dragConstraints={{ left: 0, right: 180 }}
                              dragElastic={0.08}
                              onDragEnd={(_, info) => {
                                if (info.offset.x > 105 || info.velocity.x > 300) {
                                  handleToggleGoal(item.id);
                                }
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-gradient-to-r from-[#960018] to-[#FF2442] text-[#F5F5FA] h-full px-4 flex items-center gap-1.5 font-mono-code text-xs font-bold uppercase absolute left-0 top-0 cursor-grab active:cursor-grabbing border-r-2 border-[#E8DCC4] shadow-[0_0_12px_rgba(255,36,66,0.7)]"
                            >
                              <span>✟ PURGE</span>
                              <span>&gt;&gt;</span>
                            </motion.div>
                          </div>
                        ) : (
                          <div className="mt-3 border border-[#D4AF37]/40 bg-[#0A0A0F] p-2 flex justify-between items-center font-mono-code text-[10px]">
                            <span className="text-[#D4AF37] flex items-center gap-1.5 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                              <span>✦ SANCTUARY PURGED // SIN CONDEMNED</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleToggleGoal(item.id, e)}
                              className="text-[#E8DCC4] bg-[#050508] hover:bg-[#E8DCC4] hover:text-[#050508] px-2 py-0.5 border border-[#E8DCC4]/40 font-bold uppercase transition-colors cursor-pointer"
                            >
                              [ RESTORE ⟲ ]
                            </button>
                          </div>
                        )}

                        {/* 右上角高定金色火漆圣印 */}
                        {item.killed && (
                          <div className="absolute top-2 right-2 border-2 border-[#D4AF37] text-[#E8DCC4] px-2.5 py-1 font-bodoni text-[11px] font-bold uppercase tracking-wider transform rotate-12 bg-[#08080C] shadow-[0_0_15px_rgba(212,175,55,0.4)] z-20">
                            ✦ CONDEMNED
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : isWhite ? (
              /* ⚪ PRTS_WHITE 专属：明日方舟战术协议斩杀矩阵 */
              <div className="space-y-4">
                {/* 顶部标头 */}
                <div className="border-b-2 border-[#191C1E] pb-2 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#191C1E] text-white font-mono-code text-[9px] px-1.5 py-0.5 font-bold">[PRTS-002]</span>
                      <h2 className="font-space text-lg font-bold text-[#191C1E] uppercase tracking-wide">
                        KILL_GOALS // PROTOCOL_REGISTRY
                      </h2>
                    </div>
                    <div className="font-mono-code text-[9px] text-[#76777B] mt-0.5">
                      VIOLENCE_LEVEL: MAXIMUM · STATUS: ENGAGED
                    </div>
                  </div>
                  <span className="font-mono-code text-[9px] bg-[#191C1E] text-white px-2 py-0.5 font-bold">
                    SECTOR_7G
                  </span>
                </div>

                {/* 快速下达斩杀协议 */}
                <form onSubmit={handleAddGoal} className="flex gap-2 bg-white p-2 border-2 border-[#191C1E] shadow-[3px_3px_0px_0px_#191C1E]">
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="ENTER PROTOCOL TARGET TO ELIMINATE..."
                    className="flex-1 bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] px-3 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                  />
                  <button
                    type="submit"
                    disabled={!newGoalText.trim()}
                    className="bg-[#191C1E] text-white hover:bg-[#006875] disabled:opacity-30 px-3.5 py-1.5 font-mono-code text-xs font-bold uppercase transition-colors cursor-pointer btn-chamfer"
                  >
                    + REGISTER
                  </button>
                </form>

                {/* 战术协议卡片矩阵 (100% 像素级复刻 PRTS 战术终端原型 + 交互式滑动斩杀器) */}
                <div className="space-y-4">
                  {goals.map((item) => {
                    const isExpanded = !!expandedGoalIds[item.id];
                    const logCount = item.logs?.length || 0;

                    return (
                      <article
                        key={item.id}
                        className={`border-2 p-3.5 transition-all select-none relative ${
                          item.killed
                            ? 'bg-[#F2F4F6] border-[#D8DADC] opacity-80'
                            : 'bg-white border-[#191C1E] shadow-[4px_4px_0px_0px_#191C1E]'
                        }`}
                      >
                        {/* 1. 顶部第一行：十六进制代号 + 5格高精度充能条 */}
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-mono-code text-sm font-bold text-[#191C1E] tracking-wider uppercase">
                            0x99F_{item.code}
                          </span>
                          
                          {/* 5格竖条充能块 (w-2 h-4 像素级对齐原型) */}
                          <div className="flex gap-0.5" title={`已充能推进: ${logCount}/5`}>
                            {[0, 1, 2, 3, 4].map((slotIdx) => (
                              <div
                                key={slotIdx}
                                className={`w-2 h-4 transition-all ${
                                  slotIdx < logCount
                                    ? 'bg-[#191C1E]'
                                    : 'border border-[#191C1E] bg-white'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* 2. 第二行：目标全称 (TARGET: ...) */}
                        <div className="font-mono-code text-[11px] text-[#76777B] mb-2 uppercase tracking-wide">
                          TARGET: {item.title}
                        </div>

                        {/* 3. 第三行：罗德岛冷青蓝分段式进度条 */}
                        <div className="h-1 bg-[#ECEEF0] w-full mb-3 flex gap-0.5">
                          {[0, 1, 2, 3, 4].map((idx) => (
                            <div
                              key={idx}
                              className={`h-full flex-1 transition-all ${
                                idx < logCount ? 'bg-[#006875]' : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>

                        {/* 4. 第四行：虚线分割线 + [+] DAILY LOGS 折叠项 */}
                        <div className="border-t border-dashed border-[#D8DADC] pt-2 mt-2">
                          <div
                            onClick={() => toggleExpandGoal(item.id)}
                            className="font-mono-code text-[10px] text-[#191C1E] font-bold cursor-pointer flex justify-between items-center hover:text-[#006875] select-none"
                          >
                            <span>{isExpanded ? '[-] HIDE LOGS' : '[+] DAILY LOGS'}</span>
                            <span className="text-[#76777B] text-[9px]">[{logCount} ENTRIES]</span>
                          </div>

                          {/* 展开的每日打卡日志 */}
                          {isExpanded && (
                            <div className="mt-2.5 space-y-2 pt-1 border-t border-[#ECEEF0]">
                              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                                {logCount === 0 ? (
                                  <div className="text-[10px] font-mono-code text-[#76777B] py-1.5 text-center">
                                    NO DAILY LOGS RECORDED. PUSH 1% EFFORT ↘
                                  </div>
                                ) : (
                                  item.logs.map((log) => (
                                    <div
                                      key={log.id}
                                      className="p-1.5 text-xs bg-[#F8F9FB] border-l-2 border-[#191C1E] space-y-0.5 text-[#191C1E]"
                                    >
                                      <div className="font-mono-code text-[8px] text-[#76777B]">
                                        &gt; {log.time}
                                      </div>
                                      <div className="font-space text-xs leading-tight">
                                        {log.text}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* 快速打卡输入框 */}
                              <form
                                onSubmit={(e) => handleAddGoalEffort(item.id, e)}
                                className="flex gap-1 pt-1"
                              >
                                <input
                                  type="text"
                                  value={effortInputTexts[item.id] || ''}
                                  onChange={(e) =>
                                    setEffortInputTexts((prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Log progress note (1% advance)..."
                                  className="flex-1 bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] px-2 py-1 text-xs font-space focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                                />
                                <button
                                  type="submit"
                                  disabled={!(effortInputTexts[item.id] || '').trim()}
                                  className="bg-[#191C1E] text-white hover:bg-[#006875] disabled:opacity-30 px-2.5 py-1 font-mono-code text-[10px] font-bold uppercase transition-colors cursor-pointer"
                                >
                                  + LOG
                                </button>
                              </form>
                            </div>
                          )}
                        </div>

                        {/* 🌟 战术印章移至右上角 (绝美斜角 12° 盖印，不遮挡任何内容) */}
                        {item.killed && (
                          <div className="absolute top-3 right-3 stamp-red z-20 transform rotate-12 shadow-[2px_2px_0px_0px_rgba(186,26,26,0.3)] bg-white/95">
                            PROTOCOL_TERMINATED
                          </div>
                        )}

                        {/* 5. 第五行：🌟 令人惊艳的「滑动斩杀控制器」 (Slide to Kill Protocol) */}
                        {!item.killed ? (
                          <div className="mt-3 border border-[#BA1A1A] bg-[#FFDAD6] relative h-10 flex items-center overflow-hidden select-none">
                            {/* 底轨中央醒目文字 */}
                            <div className="w-full text-center font-mono-code text-[10px] text-[#BA1A1A] font-bold tracking-widest uppercase opacity-75 pointer-events-none">
                              SLIDE &gt;&gt; TO KILL PROTOCOL
                            </div>

                            {/* 可拖拽滑动块 (滑动超过 120px 触发斩杀) */}
                            <motion.div
                              drag="x"
                              dragConstraints={{ left: 0, right: 180 }}
                              dragElastic={0.08}
                              onDragEnd={(_, info) => {
                                if (info.offset.x > 110 || info.velocity.x > 300) {
                                  handleToggleGoal(item.id);
                                }
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-[#BA1A1A] text-white h-full px-4 flex items-center gap-1 font-mono-code text-xs font-bold uppercase absolute left-0 top-0 cursor-grab active:cursor-grabbing shadow-[2px_0px_6px_rgba(186,26,26,0.4)] transition-colors hover:bg-[#93000A]"
                              title="SLIDE RIGHT TO EXECUTE TARGET"
                            >
                              <span>EXECUTE</span>
                              <span>&gt;&gt;</span>
                            </motion.div>
                          </div>
                        ) : (
                          /* 已斩杀状态：底部显示整洁的恢复控制条 */
                          <div className="mt-3 border border-[#D8DADC] bg-[#F2F4F6] p-2 flex justify-between items-center font-mono-code text-[10px]">
                            <span className="text-[#76777B] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]"></span>
                              <span>STATUS: ELIMINATED</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleToggleGoal(item.id, e)}
                              className="text-[#BA1A1A] bg-white hover:bg-[#FFDAD6] px-2 py-0.5 border border-[#BA1A1A] font-bold uppercase transition-colors cursor-pointer"
                            >
                              [ REVIVE TARGET ⟲ ]
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* 🌑 SYS_REBEL 专属：赛博暗黑粗野划线斩杀列表 */
              <div className="space-y-4">
                {/* 标头 */}
                <div className="flex justify-between items-end border-b-2 border-dashed border-[#B08784] pb-2">
                  <div>
                    <span className="font-mono-code text-[10px] bg-[#FF5357] text-[#5C000B] px-1.5 py-0.5 font-bold uppercase">
                      // PROTOCOL_OVERRIDE
                    </span>
                    <h2 className="font-anton text-2xl uppercase text-[#E4E1E7] mt-1">
                      TARGET REGISTRY
                    </h2>
                  </div>
                  <div className="font-mono-code text-[9px] text-[#E9BCB9] text-right">
                    STATUS: ACTIVE<br />
                    VIOLENCE: MAXIMUM
                  </div>
                </div>

                {/* 快速添加目标 */}
                <form onSubmit={handleAddGoal} className="flex gap-2">
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="NEW TARGET TO KILL..."
                    className="flex-1 bg-[#1F1F23] border-2 border-[#5F3E3D] text-[#E4E1E7] px-3 py-2 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                  />
                  <button
                    type="submit"
                    disabled={!newGoalText.trim()}
                    className="border-2 border-[#FFB3AF] bg-[#FF5357] text-white px-3 py-2 font-mono-code text-xs font-bold uppercase hover:bg-[#FFB3AF] hover:text-[#68000E] disabled:opacity-30 transition-colors"
                  >
                    ADD
                  </button>
                </form>

                {/* 目标列表 */}
                <div className="space-y-3">
                  {goals.map((item) => {
                    const isExpanded = !!expandedGoalIds[item.id];
                    const logCount = item.logs?.length || 0;

                    return (
                      <article
                        key={item.id}
                        className={`relative p-3.5 border-2 transition-all select-none ${
                          item.killed
                            ? 'bg-[#1F1F23] border-[#FFB3AF] opacity-70 shadow-[4px_4px_0px_0px_#FFB3AF]'
                            : 'bg-[#18181D] border-[#E4E1E7] shadow-[5px_5px_0px_0px_#E4E1E7] hover:border-[#FFB3AF] hover:shadow-[5px_5px_0px_0px_#FFB3AF]'
                        }`}
                      >
                        {/* 卡片头部：方块 + 标题 + 展开按钮 */}
                        <div 
                          onClick={() => toggleExpandGoal(item.id)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <button
                            type="button"
                            onClick={(e) => handleToggleGoal(item.id, e)}
                            title={item.killed ? 'RESTORE TARGET' : 'KILL TARGET'}
                            className={`w-9 h-9 border-2 flex items-center justify-center shrink-0 font-anton text-lg transition-transform active:scale-95 ${
                              item.killed
                                ? 'bg-[#FFB3AF] border-[#FFB3AF] text-[#68000E]'
                                : 'border-[#E4E1E7] text-[#FFB3AF] hover:border-[#FFB3AF]'
                            }`}
                          >
                            {item.killed ? 'X' : ''}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-anton text-lg tracking-tight truncate ${
                                item.killed
                                  ? 'line-through decoration-[#FF5357] decoration-4 text-[#C8C5C8]'
                                  : 'text-[#E4E1E7]'
                              }`}
                            >
                              {item.title}
                            </h4>
                            
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="font-mono-code text-[9px] text-[#B08784] shrink-0">
                                ID: {item.code}
                              </span>
                              <span className="text-[#5F3E3D] text-[9px]">·</span>
                              
                              <div className="flex items-center gap-1 w-24 h-2.5">
                                <div className="flex gap-[2px] w-full h-full">
                                  {[0, 1, 2, 3, 4].map((slotIdx) => (
                                    <div
                                      key={slotIdx}
                                      className={`flex-1 transition-all duration-200 ${
                                        slotIdx < logCount
                                          ? 'bg-[#FF5357] shadow-[0_0_4px_rgba(255,83,87,0.6)]'
                                          : 'bg-[#2A2A2E] border border-[#343438]'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <span className="font-mono-code text-[10px] text-[#FFB3AF] font-bold shrink-0">
                                COUNT: {logCount}
                              </span>
                            </div>
                          </div>

                          <div className="font-mono-code text-xs text-[#E9BCB9] px-1 py-0.5 bg-[#131317] border border-[#5F3E3D]">
                            {isExpanded ? '▲' : '▼'}
                          </div>
                        </div>

                        {item.killed && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className="border-4 border-[#FF5357] px-3 py-0.5 bg-[#131317]/85 backdrop-blur-xs stamp-animation">
                              <span className="font-anton text-2xl text-[#FF5357] tracking-widest leading-none">
                                KILLED
                              </span>
                            </div>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#5F3E3D] space-y-2.5">
                            <div className="flex justify-between items-center text-[9px] font-mono-code text-[#B08784] opacity-80 pb-0.5">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#FF5357] animate-ping inline-block"></span>
                                <span>// SUB_TRACE_STREAM [0x99_EXEC]</span>
                              </span>
                              <span className="text-[#5F3E3D] tracking-widest">[LIVE_BUFFER]</span>
                            </div>

                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {logCount === 0 ? (
                                <div className="text-[11px] font-mono-code text-[#5F3E3D] py-2 text-center">
                                  NO EFFORT LOGGED YET. ADVANCE 1% TODAY ↘
                                </div>
                              ) : (
                                item.logs.map((log) => (
                                  <div
                                    key={log.id}
                                    className="border-l-2 border-[#FF5357] bg-[#131317] p-2 text-xs text-[#E4E1E7] space-y-0.5"
                                  >
                                    <div className="font-mono-code text-[9px] text-[#B08784]">
                                      {log.time}
                                    </div>
                                    <div className="leading-relaxed whitespace-pre-wrap">
                                      {log.text}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            <form
                              onSubmit={(e) => handleAddGoalEffort(item.id, e)}
                              className="flex gap-1.5 pt-1"
                            >
                              <input
                                type="text"
                                value={effortInputTexts[item.id] || ''}
                                onChange={(e) =>
                                  setEffortInputTexts((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                                placeholder="Log 1% progress note..."
                                className="flex-1 bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] px-2.5 py-1.5 text-xs font-chivo focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                              />
                              <button
                                type="submit"
                                disabled={!(effortInputTexts[item.id] || '').trim()}
                                className="border border-[#FFB3AF] bg-[#FF5357] text-white px-2.5 py-1.5 font-mono-code text-[11px] font-bold uppercase hover:bg-[#FFB3AF] hover:text-[#68000E] disabled:opacity-30 transition-colors"
                              >
                                + LOG
                              </button>
                            </form>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* ===================================================================== */}
          {/* TAB 3: RAW_SPARKS (依据主题完全异构的灵感碎片 / 战术机密档案盒) */}
          {/* ===================================================================== */}
          {activeTab === 'sparks' && (() => {
            const allTags = Array.from(new Set(sparks.flatMap((s) => s.tags)));
            const filteredSparks = selectedFilterTag
              ? sparks.filter((s) => s.tags.includes(selectedFilterTag))
              : sparks;

            return isGothic ? (
              /* ⚜️ HEAVEN_GRIEF 专属：先锋赛博神圣哥特 · 破碎光环遗物板 (Shattered Halos) */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-[#E8DCC4]/30 pb-2.5">
                  <div>
                    <div className="font-mono-code text-[9px] text-[#E8DCC4]/70 tracking-widest uppercase">
                      // RELIC_FEED [0x99_HALO]
                    </div>
                    <h2 className="font-bodoni text-2xl font-bold text-[#F5F5FA] tracking-wide mt-0.5">
                      SHATTERED_HALOS
                    </h2>
                  </div>
                  <span className="font-mono-code text-[9px] border border-[#D4AF37]/50 text-[#E8DCC4] px-2 py-0.5 font-bold uppercase bg-[#09090D]">
                    RELICS: {filteredSparks.length}
                  </span>
                </div>

                {/* 哥特灵感录入表单 */}
                <form onSubmit={handleAddSpark} className="bg-[#0A0A0F] border border-[#E8DCC4]/30 p-3.5 space-y-2.5 glow-gold-wire">
                  <input
                    type="text"
                    value={newSparkTitle}
                    onChange={(e) => setNewSparkTitle(e.target.value)}
                    placeholder="RELIC CIPHER (e.g. CORRUPTED_HALO / DIVINE_ALGO)..."
                    className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] p-2 text-xs font-mono-code focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                  />
                  <textarea
                    value={newSparkDesc}
                    onChange={(e) => setNewSparkDesc(e.target.value)}
                    placeholder="Sacred insight / apocalyptic observation notes..."
                    rows={2}
                    className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] font-chivo p-2 text-xs focus:outline-none focus:border-[#E8DCC4] resize-none placeholder-[#888890]/60"
                  />

                  {showSparkOptions && (
                    <div className="pt-2 border-t border-[#E8DCC4]/15 space-y-2">
                      <input
                        type="text"
                        value={newSparkTags}
                        onChange={(e) => setNewSparkTags(e.target.value)}
                        placeholder="TAGS (e.g. ANOMALY, CORRUPTED_HALO)..."
                        className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#E8DCC4] select-none">
                        <input
                          type="checkbox"
                          checked={newSparkPriority}
                          onChange={(e) => setNewSparkPriority(e.target.checked)}
                          className="accent-[#FF2442] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>HIGH SANCTITY (PIN TO TOP)</span>
                      </label>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 border-t border-[#E8DCC4]/15">
                    <button
                      type="button"
                      onClick={() => setShowSparkOptions(!showSparkOptions)}
                      className="font-mono-code text-[10px] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/30 px-2 py-0.5 cursor-pointer"
                    >
                      <span>{showSparkOptions ? '[-] LESS_OPTIONS ▲' : '[+] OPTIONS ▾'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!newSparkTitle.trim()}
                      className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white disabled:opacity-40 px-4 py-1.5 font-bodoni text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      + BIND RELIC
                    </button>
                  </div>
                </form>

                {/* 顶部标签筛选 */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="font-mono-code text-[10px] text-[#888890] shrink-0">FILTER:</span>
                    <button
                      onClick={() => setSelectedFilterTag(null)}
                      className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 cursor-pointer ${
                        selectedFilterTag === null
                          ? 'bg-[#E8DCC4] text-[#050508] border-[#E8DCC4] font-bold'
                          : 'bg-[#09090D] text-[#888890] border-[#E8DCC4]/20 hover:text-[#E8DCC4]'
                      }`}
                    >
                      ALL ({sparks.length})
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedFilterTag(selectedFilterTag === tag ? null : tag)}
                        className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 cursor-pointer ${
                          selectedFilterTag === tag
                            ? 'bg-[#D4AF37] text-[#050508] border-[#D4AF37] font-bold'
                            : 'bg-[#09090D] text-[#E8DCC4] border-[#E8DCC4]/30 hover:border-[#E8DCC4]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* 悬浮黑曜石碎片卡片列表 */}
                <div className="space-y-3">
                  {filteredSparks.length === 0 ? (
                    <div className="py-8 text-center text-xs font-mono-code text-[#888890] border border-[#E8DCC4]/20 bg-[#08080C]">
                      NO RELICS FOUND UNDER THIS SACRED FILTER.
                    </div>
                  ) : (
                    filteredSparks.map((spark) => {
                      const isEditing = editingSparkId === spark.id;

                      return (
                        <div key={spark.id} className="relative overflow-hidden group">
                          {/* 底层销毁 */}
                          <div className="absolute inset-y-0 right-0 w-20 bg-[#960018] flex items-center justify-center text-white z-0">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSpark(spark.id, e)}
                              className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-black/40 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                              <span>PURGE</span>
                            </button>
                          </div>

                          {/* 顶层黑曜石卡片 */}
                          <motion.article
                            drag={isEditing ? false : 'x'}
                            dragConstraints={{ left: -75, right: 0 }}
                            dragElastic={0.05}
                            animate={{ x: swipedSparkId === spark.id ? -75 : 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -25 || info.velocity.x < -150) {
                                setSwipedSparkId(spark.id);
                              } else if (info.offset.x > 15 || info.velocity.x > 150) {
                                setSwipedSparkId(null);
                              }
                            }}
                            onClick={() => {
                              if (swipedSparkId === spark.id) setSwipedSparkId(null);
                            }}
                            onDoubleClick={() => handleStartEditSpark(spark)}
                            className="relative z-10 bg-[#08080C] border border-[#E8DCC4]/30 p-3.5 select-none cursor-grab active:cursor-grabbing hover:border-[#E8DCC4] transition-colors"
                            title="DOUBLE CLICK TO EDIT · SWIPE LEFT TO PURGE"
                          >
                            {spark.isPriority && (
                              <div className="absolute top-3 right-3 border border-[#D4AF37] text-[#E8DCC4] px-1.5 py-0.5 font-mono-code text-[8px] font-bold uppercase tracking-wider bg-[#120D05]">
                                ✦ SACRED_PRIORITY
                              </div>
                            )}

                            {isEditing ? (
                              <form onSubmit={(e) => handleSaveEditSpark(spark.id, e)} className="space-y-2 pt-1">
                                <input
                                  type="text"
                                  value={editSparkDraft.title}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-[#050508] border border-[#E8DCC4] text-[#F5F5FA] p-1.5 text-xs font-mono-code focus:outline-none"
                                />
                                <textarea
                                  value={editSparkDraft.description}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, description: e.target.value }))}
                                  rows={2}
                                  className="w-full bg-[#050508] border border-[#E8DCC4]/30 text-[#F5F5FA] font-chivo p-1.5 text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={editSparkDraft.tags}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, tags: e.target.value }))}
                                  placeholder="TAGS (e.g. ANOMALY)..."
                                  className="w-full bg-[#050508] border border-[#E8DCC4]/30 text-[#F5F5FA] p-1 text-xs font-mono-code focus:outline-none"
                                />
                                <div className="flex justify-between items-center pt-1">
                                  <label className="flex items-center gap-1 cursor-pointer font-mono-code text-[10px] text-[#E8DCC4]">
                                    <input
                                      type="checkbox"
                                      checked={editSparkDraft.isPriority}
                                      onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, isPriority: e.target.checked }))}
                                      className="accent-[#FF2442]"
                                    />
                                    <span>SACRED PRIORITY</span>
                                  </label>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={handleCancelEditSpark}
                                      className="border border-[#E8DCC4]/30 text-[#888890] hover:text-white px-2 py-0.5 font-mono-code text-[10px] cursor-pointer"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      type="submit"
                                      className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] px-2.5 py-0.5 font-bodoni text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                </div>
                              </form>
                            ) : (
                              <div>
                                <div className="flex gap-1.5 mb-2">
                                  {spark.tags.map((tag, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => setSelectedFilterTag(tag)}
                                      className="bg-[#050508] border border-[#E8DCC4]/30 text-[#E8DCC4] text-[9px] font-mono-code px-1.5 py-0.5 uppercase cursor-pointer hover:border-[#E8DCC4] transition-colors"
                                    >
                                      #{tag}
                                    </button>
                                  ))}
                                </div>

                                <h3 className="font-bodoni text-base text-[#F5F5FA] font-bold tracking-wide">
                                  {spark.title}
                                </h3>
                                <p className="font-chivo text-xs text-[#C8C8D0] mt-1 leading-relaxed">
                                  {spark.description}
                                </p>
                              </div>
                            )}
                          </motion.article>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : isWhite ? (
              /* ⚪ PRTS_WHITE 专属：明日方舟 / 众生行记 战术机密档案盒 (Tactical Dossiers) */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b-2 border-[#191C1E] pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#191C1E] text-white font-mono-code text-[9px] px-1.5 py-0.5 font-bold">[PRTS-003]</span>
                      <h2 className="font-space text-lg font-bold text-[#191C1E] uppercase tracking-wide">
                        RAW_SPARKS // DOSSIERS
                      </h2>
                    </div>
                    <div className="font-mono-code text-[9px] text-[#76777B] mt-0.5">
                      IDEATION_CLASSIFIED_MATRIX · SWIPE_PURGE
                    </div>
                  </div>
                  <span className="font-mono-code text-[9px] bg-[#006875] text-white px-2 py-0.5 font-bold">
                    ACTIVE: {filteredSparks.length}
                  </span>
                </div>

                {/* PRTS 档案录入表单 */}
                <form onSubmit={handleAddSpark} className="bg-white border-2 border-[#191C1E] p-3 space-y-2.5 shadow-[4px_4px_0px_0px_#191C1E] crop-marks">
                  <input
                    type="text"
                    value={newSparkTitle}
                    onChange={(e) => setNewSparkTitle(e.target.value)}
                    placeholder="DOSSIER CODENAME (e.g. ASSET_X99 / GLITCH ALGO)..."
                    className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] p-2 text-xs font-mono-code focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                  />
                  <textarea
                    value={newSparkDesc}
                    onChange={(e) => setNewSparkDesc(e.target.value)}
                    placeholder="Classification brief / tactical observation notes..."
                    rows={2}
                    className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] font-space p-2 text-xs focus:outline-none focus:border-[#191C1E] resize-none placeholder-[#76777B]"
                  />

                  {showSparkOptions && (
                    <div className="pt-2 border-t border-[#D8DADC] space-y-2">
                      <input
                        type="text"
                        value={newSparkTags}
                        onChange={(e) => setNewSparkTags(e.target.value)}
                        placeholder="TAGS (e.g. TACTICAL, CORE, DESIGN)..."
                        className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#191C1E] select-none">
                        <input
                          type="checkbox"
                          checked={newSparkPriority}
                          onChange={(e) => setNewSparkPriority(e.target.checked)}
                          className="accent-[#BA1A1A] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>HIGH PRIORITY (RED STAMP PIN)</span>
                      </label>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 border-t border-[#D8DADC]">
                    <button
                      type="button"
                      onClick={() => setShowSparkOptions(!showSparkOptions)}
                      className="font-mono-code text-[10px] text-[#191C1E] hover:bg-[#F2F4F6] border border-[#D8DADC] px-2 py-0.5 cursor-pointer"
                    >
                      <span>{showSparkOptions ? '[-] LESS_OPTIONS ▲' : '[+] OPTIONS ▾'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!newSparkTitle.trim()}
                      className="bg-[#191C1E] text-white hover:bg-[#006875] disabled:opacity-40 px-4 py-1.5 font-mono-code text-xs font-bold uppercase transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#76777B] btn-chamfer"
                    >
                      + COMMIT DOSSIER
                    </button>
                  </div>
                </form>

                {/* 顶部标签筛选 */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="font-mono-code text-[10px] text-[#76777B] shrink-0">FILTER:</span>
                    <button
                      onClick={() => setSelectedFilterTag(null)}
                      className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 cursor-pointer ${
                        selectedFilterTag === null
                          ? 'bg-[#191C1E] text-white border-[#191C1E] font-bold'
                          : 'bg-white text-[#76777B] border-[#D8DADC] hover:text-[#191C1E]'
                      }`}
                    >
                      ALL ({sparks.length})
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedFilterTag(selectedFilterTag === tag ? null : tag)}
                        className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 cursor-pointer ${
                          selectedFilterTag === tag
                            ? 'bg-[#006875] text-white border-[#006875] font-bold'
                            : 'bg-white text-[#191C1E] border-[#D8DADC] hover:border-[#191C1E]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* 战术档案盒列表 */}
                <div className="space-y-3">
                  {filteredSparks.length === 0 ? (
                    <div className="py-8 text-center text-xs font-mono-code text-[#76777B] border border-[#D8DADC] bg-white">
                      NO DOSSIERS FOUND UNDER THIS FILTER.
                    </div>
                  ) : (
                    filteredSparks.map((spark) => {
                      const isEditing = editingSparkId === spark.id;

                      return (
                        <div key={spark.id} className="relative overflow-hidden group">
                          {/* 底层左滑呼出的红色销毁 */}
                          <div className="absolute inset-y-0 right-0 w-20 bg-[#BA1A1A] flex items-center justify-center text-white z-0">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSpark(spark.id, e)}
                              className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-black/20 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                              <span>PURGE</span>
                            </button>
                          </div>

                          {/* 顶层档案卡片 */}
                          <motion.article
                            drag={isEditing ? false : 'x'}
                            dragConstraints={{ left: -75, right: 0 }}
                            dragElastic={0.05}
                            animate={{ x: swipedSparkId === spark.id ? -75 : 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -25 || info.velocity.x < -150) {
                                setSwipedSparkId(spark.id);
                              } else if (info.offset.x > 15 || info.velocity.x > 150) {
                                setSwipedSparkId(null);
                              }
                            }}
                            onClick={() => {
                              if (swipedSparkId === spark.id) setSwipedSparkId(null);
                            }}
                            onDoubleClick={() => handleStartEditSpark(spark)}
                            className="relative z-10 bg-white border-2 border-[#191C1E] p-3.5 shadow-[4px_4px_0px_0px_#191C1E] select-none cursor-grab active:cursor-grabbing hover:border-[#006875] transition-colors"
                            title="DOUBLE CLICK TO EDIT · SWIPE LEFT TO PURGE"
                          >
                            {/* 45° 战术红色印章 */}
                            {spark.isPriority && (
                              <div className="absolute top-3 right-3 stamp-red z-10">
                                HIGH PRIORITY
                              </div>
                            )}

                            {isEditing ? (
                              <form onSubmit={(e) => handleSaveEditSpark(spark.id, e)} className="space-y-2 pt-1">
                                <input
                                  type="text"
                                  value={editSparkDraft.title}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-[#F8F9FB] border border-[#191C1E] text-[#191C1E] p-1.5 text-xs font-mono-code focus:outline-none"
                                />
                                <textarea
                                  value={editSparkDraft.description}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, description: e.target.value }))}
                                  rows={2}
                                  className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] font-space p-1.5 text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={editSparkDraft.tags}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, tags: e.target.value }))}
                                  placeholder="TAGS (e.g. TACTICAL, CORE)..."
                                  className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] p-1 text-xs font-mono-code focus:outline-none"
                                />
                                <div className="flex justify-between items-center pt-1">
                                  <label className="flex items-center gap-1 cursor-pointer font-mono-code text-[10px] text-[#191C1E]">
                                    <input
                                      type="checkbox"
                                      checked={editSparkDraft.isPriority}
                                      onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, isPriority: e.target.checked }))}
                                      className="accent-[#BA1A1A]"
                                    />
                                    <span>HIGH PRIORITY</span>
                                  </label>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={handleCancelEditSpark}
                                      className="border border-[#D8DADC] text-[#76777B] hover:text-[#191C1E] px-2 py-0.5 font-mono-code text-[10px] cursor-pointer"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      type="submit"
                                      className="bg-[#191C1E] text-white hover:bg-[#006875] px-2.5 py-0.5 font-mono-code text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                </div>
                              </form>
                            ) : (
                              <div>
                                <div className="flex gap-1.5 mb-2">
                                  {spark.tags.map((tag, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => setSelectedFilterTag(tag)}
                                      className="bg-[#191C1E] text-white text-[9px] font-mono-code px-1.5 py-0.5 uppercase cursor-pointer hover:bg-[#006875] transition-colors"
                                    >
                                      #{tag}
                                    </button>
                                  ))}
                                </div>

                                <h3 className="font-space font-bold text-base text-[#191C1E] uppercase mb-1">
                                  {spark.title}
                                </h3>
                                <p className="font-space text-xs text-[#46464B] border-l-2 border-[#191C1E] pl-2 mb-3 leading-relaxed">
                                  {spark.description}
                                </p>

                                <div className="font-mono-code text-[9px] text-[#76777B] border-t border-[#ECEEF0] pt-1.5 flex justify-between">
                                  <span>ID: {spark.tagId}</span>
                                  <span>STS: CLASSIFIED</span>
                                </div>
                              </div>
                            )}
                          </motion.article>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* 🌑 SYS_REBEL 专属：暗黑粗野便利贴贴纸瀑布流 */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-dashed border-[#FFB3AF] pb-2">
                  <div>
                    <h2 className="font-anton text-2xl uppercase text-[#FFB3AF]">RAW SPARKS</h2>
                    <p className="font-mono-code text-[10px] text-[#E9BCB9] tracking-widest">
                      _ideation_board_v2.0 // DOUBLE_CLICK_EDIT · SWIPE_DELETE
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#FFB3AF] text-3xl">bolt</span>
                </div>

                <form onSubmit={handleAddSpark} className="bg-[#1F1F23] border-2 border-[#FFB3AF] p-3 space-y-2.5 shadow-[4px_4px_0px_0px_#FFB3AF]">
                  <input
                    type="text"
                    value={newSparkTitle}
                    onChange={(e) => setNewSparkTitle(e.target.value)}
                    placeholder="SPARK TITLE (e.g. GLITCH ALGO)..."
                    className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-2 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                  />
                  <textarea
                    value={newSparkDesc}
                    onChange={(e) => setNewSparkDesc(e.target.value)}
                    placeholder="Raw notes / fragment details..."
                    rows={2}
                    className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-2 text-xs font-chivo focus:outline-none focus:border-[#FFB3AF] resize-none placeholder-[#5F3E3D]"
                  />

                  {showSparkOptions && (
                    <div className="pt-2 border-t border-dashed border-[#5F3E3D] space-y-2">
                      <input
                        type="text"
                        value={newSparkTags}
                        onChange={(e) => setNewSparkTags(e.target.value)}
                        placeholder="TAGS (e.g. DESIGN SYSTEM, CHAOS)..."
                        className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#E9BCB9] select-none hover:text-[#FFB3AF]">
                        <input
                          type="checkbox"
                          checked={newSparkPriority}
                          onChange={(e) => setNewSparkPriority(e.target.checked)}
                          className="accent-[#FF5357] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>HIGH PRIORITY (PIN TO TOP)</span>
                      </label>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSparkOptions(!showSparkOptions)}
                      className="font-mono-code text-[11px] text-[#E9BCB9] hover:text-[#FFB3AF] flex items-center gap-1 border border-transparent hover:border-[#5F3E3D] px-1.5 py-0.5"
                    >
                      <span>{showSparkOptions ? '[-] LESS_OPTIONS ▲' : '[+] OPTIONS ▾'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!newSparkTitle.trim()}
                      className="border-2 border-[#FFB3AF] bg-[#FFB3AF] text-[#68000E] px-3.5 py-1.5 font-mono-code text-xs font-bold uppercase hover:bg-[#FF5357] hover:text-white disabled:opacity-40 transition-colors shadow-[2px_2px_0px_0px_#131317]"
                    >
                      DROP SPARK
                    </button>
                  </div>
                </form>

                {allTags.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="font-mono-code text-[10px] text-[#8E8E93] shrink-0">FILTER:</span>
                    <button
                      onClick={() => setSelectedFilterTag(null)}
                      className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 ${
                        selectedFilterTag === null
                          ? 'bg-[#FF5357] text-white border-[#FF5357] font-bold'
                          : 'bg-[#18181D] text-[#8E8E93] border-[#343438] hover:text-[#E4E1E7]'
                      }`}
                    >
                      ALL ({sparks.length})
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedFilterTag(selectedFilterTag === tag ? null : tag)}
                        className={`px-2 py-0.5 font-mono-code text-[10px] uppercase border transition-all shrink-0 ${
                          selectedFilterTag === tag
                            ? 'bg-[#FFB3AF] text-[#68000E] border-[#FFB3AF] font-bold'
                            : 'bg-[#18181D] text-[#B08784] border-[#343438] hover:border-[#5F3E3D]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {filteredSparks.length === 0 ? (
                    <div className="py-8 text-center text-xs font-mono-code text-[#5F3E3D] border border-dashed border-[#343438]">
                      NO SPARKS FOUND UNDER THIS TAG FILTER.
                    </div>
                  ) : (
                    filteredSparks.map((spark) => {
                      const isEditing = editingSparkId === spark.id;

                      return (
                        <div key={spark.id} className="relative overflow-hidden group">
                          <div className="absolute inset-y-0 right-0 w-20 bg-[#FF5357] flex items-center justify-center text-white z-0">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSpark(spark.id, e)}
                              className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-[#68000E] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                              <span>DELETE</span>
                            </button>
                          </div>

                          <motion.article
                            drag={isEditing ? false : 'x'}
                            dragConstraints={{ left: -75, right: 0 }}
                            dragElastic={0.05}
                            animate={{ x: swipedSparkId === spark.id ? -75 : 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -25 || info.velocity.x < -150) {
                                setSwipedSparkId(spark.id);
                              } else if (info.offset.x > 15 || info.velocity.x > 150) {
                                setSwipedSparkId(null);
                              }
                            }}
                            onClick={() => {
                              if (swipedSparkId === spark.id) setSwipedSparkId(null);
                            }}
                            onDoubleClick={() => handleStartEditSpark(spark)}
                            className={`relative z-10 bg-[#1F1F23] border-2 border-[#FFB3AF] p-3.5 shadow-[5px_5px_0px_0px_#FFB3AF] ${spark.rotation} select-none cursor-grab active:cursor-grabbing`}
                          >
                            <div className="flex justify-between items-center border-b border-dashed border-[#FFB3AF] pb-1.5 mb-2">
                              <span className="font-mono-code text-[10px] text-[#FFB3AF] font-bold">
                                {spark.tagId}
                              </span>
                              {spark.isPriority && (
                                <span className="font-mono-code text-[9px] bg-[#FF5357] text-[#5C000B] px-1.5 py-0.5 font-bold uppercase">
                                  HIGH PRIORITY
                                </span>
                              )}
                            </div>

                            {isEditing ? (
                              <form onSubmit={(e) => handleSaveEditSpark(spark.id, e)} className="space-y-2 pt-1">
                                <input
                                  type="text"
                                  value={editSparkDraft.title}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-[#131317] border border-[#FFB3AF] text-[#E4E1E7] p-1.5 text-xs font-mono-code focus:outline-none"
                                />
                                <textarea
                                  value={editSparkDraft.description}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, description: e.target.value }))}
                                  rows={2}
                                  className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-1.5 text-xs font-chivo focus:outline-none focus:border-[#FFB3AF] resize-none"
                                />
                                <input
                                  type="text"
                                  value={editSparkDraft.tags}
                                  onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, tags: e.target.value }))}
                                  placeholder="TAGS (e.g. DESIGN SYSTEM, CHAOS)..."
                                  className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-1 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF]"
                                />
                                <div className="flex justify-between items-center pt-1">
                                  <label className="flex items-center gap-1 cursor-pointer font-mono-code text-[10px] text-[#E9BCB9]">
                                    <input
                                      type="checkbox"
                                      checked={editSparkDraft.isPriority}
                                      onChange={(e) => setEditSparkDraft((prev) => ({ ...prev, isPriority: e.target.checked }))}
                                      className="accent-[#FF5357]"
                                    />
                                    <span>HIGH PRIORITY</span>
                                  </label>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={handleCancelEditSpark}
                                      className="border border-[#5F3E3D] px-2 py-0.5 font-mono-code text-[10px] text-[#8E8E93] hover:text-[#E4E1E7]"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      type="submit"
                                      className="border border-[#FFB3AF] bg-[#FFB3AF] text-[#68000E] px-2.5 py-0.5 font-mono-code text-[10px] font-bold uppercase hover:bg-[#FF5357] hover:text-white"
                                    >
                                      SAVE
                                    </button>
                                  </div>
                                </div>
                              </form>
                            ) : (
                              <>
                                <h3 className="font-anton text-lg text-[#E4E1E7] uppercase mb-1">
                                  {spark.title}
                                </h3>
                                <p className="font-chivo text-xs text-[#E9BCB9] leading-relaxed mb-2">
                                  {spark.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {spark.tags.map((tag, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => setSelectedFilterTag(tag)}
                                      className="border border-[#5F3E3D] hover:border-[#FFB3AF] hover:text-[#FFB3AF] px-1.5 py-0.5 font-mono-code text-[9px] text-[#C8C5C8] uppercase transition-colors cursor-pointer"
                                    >
                                      #{tag}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </motion.article>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

          {/* ===================================================================== */}
          {/* TAB 4: THE_VAULT (依据主题完全异构的加密黑匣子监视台) */}
          {/* ===================================================================== */}
          {activeTab === 'vault' && (
            isGothic ? (
              /* ⚜️ HEAVEN_GRIEF 专属：先锋赛博神圣哥特 · 圣骸禁锢圣所 (Sanctum Reliquary) */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-[#E8DCC4]/30 pb-2.5">
                  <div>
                    <div className="font-mono-code text-[9px] text-[#E8DCC4]/70 tracking-widest uppercase">
                      // 0XFA_CIPHER [LEVEL_5]
                    </div>
                    <h2 className="font-bodoni text-2xl font-bold text-[#F5F5FA] tracking-wide mt-0.5">
                      SANCTUM_RELIQUARY
                    </h2>
                  </div>
                  <div className="border border-[#FF2442] bg-[#120508] text-[#FF2442] px-2 py-0.5 font-mono-code text-[9px] font-bold flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    SEALED
                  </div>
                </div>

                {/* 圣所黑曜石核心监控部件 */}
                <div className="p-3.5 border border-[#E8DCC4]/30 bg-[#09090D] glow-gold-wire space-y-2">
                  <div className="flex justify-between items-center border-b border-[#E8DCC4]/15 pb-1 font-mono-code text-[10px] text-[#E8DCC4]">
                    <span>SANCTUARY_CORE_TELEMETRY</span>
                    <span className="text-[#FF2442] animate-pulse">SEAL_UNSTABLE</span>
                  </div>
                  <div className="font-mono-code text-[10px] space-y-1 text-[#888890]">
                    <div className="flex justify-between">
                      <span>ALTAR_CONTAINMENT</span> <span className="text-[#E8DCC4] font-bold">LOCKED (99.8%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STIGMATA_RESONANCE</span> <span className="text-[#FF2442] font-bold">OVERHEAT // 404Hz</span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1 h-1.5">
                    <div className="bg-[#E8DCC4] flex-1"></div>
                    <div className="bg-[#D4AF37] flex-1"></div>
                    <div className="bg-[#FF2442] flex-1"></div>
                    <div className="bg-[#2A2A35] flex-1"></div>
                  </div>
                </div>

                {/* 存入机密表单 */}
                <div className="p-3.5 space-y-2.5 bg-[#0A0A0F] border border-[#E8DCC4]/30">
                  <div className="flex justify-between items-center">
                    <span className="font-mono-code text-[10px] text-[#E8DCC4] font-bold">
                      // ENCRYPT_INTO_SANCTUM
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVaultForm(!showVaultForm)}
                      className="font-mono-code text-[10px] px-2 py-0.5 transition-colors cursor-pointer border border-[#E8DCC4]/30 bg-[#050508] text-[#E8DCC4] hover:border-[#E8DCC4]"
                    >
                      {showVaultForm ? '[-] HIDE_PANEL ▲' : '[+] NEW_CIPHER ▾'}
                    </button>
                  </div>

                  {showVaultForm && (
                    <form onSubmit={handleAddVaultItem} className="space-y-2.5 pt-1 border-t border-[#E8DCC4]/15">
                      <input
                        type="text"
                        value={newVaultTitle}
                        onChange={(e) => setNewVaultTitle(e.target.value)}
                        placeholder="CIPHER CODENAME (e.g. SACRED_MATRIX_09)..."
                        className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] p-2 text-xs font-mono-code focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                      />
                      <textarea
                        value={newVaultContent}
                        onChange={(e) => setNewVaultContent(e.target.value)}
                        placeholder="CONFIDENTIAL DOCTRINE TO ENCRYPT & ENCLAVE..."
                        rows={3}
                        className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] font-chivo p-2 text-xs focus:outline-none focus:border-[#E8DCC4] resize-none placeholder-[#888890]/60"
                      />
                      <input
                        type="text"
                        value={newVaultTags}
                        onChange={(e) => setNewVaultTags(e.target.value)}
                        placeholder="TAGS (e.g. LEVEL_5, CONDEMNED)..."
                        className="w-full bg-[#050508] border border-[#E8DCC4]/20 text-[#F5F5FA] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#E8DCC4] placeholder-[#888890]/60"
                      />
                      <div className="flex justify-between items-center pt-1 border-t border-[#E8DCC4]/15">
                        <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#E8DCC4] select-none">
                          <input
                            type="checkbox"
                            checked={newVaultEncrypt}
                            onChange={(e) => setNewVaultEncrypt(e.target.checked)}
                            className="accent-[#FF2442] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>ENCRYPT WITH HEX CIPHER</span>
                        </label>
                        <button
                          type="submit"
                          disabled={!newVaultTitle.trim() || !newVaultContent.trim()}
                          className="border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white disabled:opacity-40 px-3.5 py-1.5 font-bodoni text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          LOCK & CONCEAL
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* 归档机密卡片列表 */}
                <div className="space-y-3">
                  {vaultItems.map((item) => (
                    <div key={item.id} className="relative overflow-hidden group">
                      <div className="absolute inset-y-0 right-0 w-20 bg-[#960018] flex items-center justify-center text-white z-0">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteVaultItem(item.id, e)}
                          className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-black/30 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                          <span>PURGE</span>
                        </button>
                      </div>

                      <motion.article
                        drag="x"
                        dragConstraints={{ left: -75, right: 0 }}
                        dragElastic={0.05}
                        animate={{ x: swipedVaultId === item.id ? -75 : 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -25 || info.velocity.x < -150) {
                            setSwipedVaultId(item.id);
                          } else if (info.offset.x > 15 || info.velocity.x > 150) {
                            setSwipedVaultId(null);
                          }
                        }}
                        onClick={() => {
                          if (swipedVaultId === item.id) setSwipedVaultId(null);
                        }}
                        className={`relative z-10 p-3.5 select-none cursor-grab active:cursor-grabbing border ${
                          item.encrypted
                            ? 'border-[#E8DCC4]/30 bg-[#08080C] shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                            : 'border-[#E8DCC4] bg-[#0A0A0F] shadow-[0_0_12px_rgba(232,220,196,0.15)]'
                        }`}
                      >
                        <div className="flex justify-between items-center pb-1 mb-2 border-b border-[#E8DCC4]/15">
                          <span className="font-mono-code text-[10px] text-[#E8DCC4]">
                            LOG_ID: {item.logId}
                          </span>
                          <span
                            className={`font-mono-code text-[9px] px-1.5 py-0.5 font-bold uppercase ${
                              item.encrypted ? 'border border-[#FF2442] text-[#FF2442] bg-[#120508]' : 'bg-[#E8DCC4] text-[#050508]'
                            }`}
                          >
                            {item.encrypted ? 'SEALED // ENCRYPTED' : 'UNLOCKED'}
                          </span>
                        </div>

                        <h3 className="font-bodoni text-base font-bold text-[#F5F5FA] uppercase mb-1">
                          {item.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed mb-3 ${
                            item.encrypted ? 'font-mono-code break-all text-[#888890]' : 'font-chivo text-[#C8C8D0]'
                          }`}
                        >
                          {item.content}
                        </p>

                        {item.encrypted ? (
                          <button
                            type="button"
                            onClick={() => handleDecryptVault(item.id)}
                            className="w-full border border-[#E8DCC4] bg-[#050508] hover:bg-[#E8DCC4] hover:text-[#050508] text-[#E8DCC4] font-bodoni text-xs py-1.5 uppercase transition-all cursor-pointer shadow-[0_0_8px_rgba(232,220,196,0.15)]"
                          >
                            [ DISSOLVE SEAL // EXTRACT CIPHER ]
                          </button>
                        ) : (
                          <div className="flex gap-1.5">
                            {item.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 font-mono-code text-[9px] border border-[#E8DCC4]/30 bg-[#050508] text-[#E8DCC4]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.article>
                    </div>
                  ))}
                </div>
              </div>
            ) : isWhite ? (
              /* ⚪ PRTS_WHITE 专属：罗德岛绝密黑匣子中央监视台 */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b-2 border-[#191C1E] pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#191C1E] text-white font-mono-code text-[9px] px-1.5 py-0.5 font-bold">[PRTS-004]</span>
                      <h2 className="font-space text-lg font-bold text-[#191C1E] uppercase tracking-wide">
                        RHODES_SECURITY // THE_VAULT
                      </h2>
                    </div>
                    <p className="font-mono-code text-[9px] text-[#76777B] mt-0.5">
                      BLACK_BOX_ARCHIVE // LEVEL_5_RESTRICTED
                    </p>
                  </div>
                  <div className="font-mono-code text-[9px] bg-[#BA1A1A] text-white px-2 py-0.5 font-bold flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    RESTRICTED
                  </div>
                </div>

                {/* 罗德岛全息监控部件 */}
                <div className="p-3 border-2 border-[#191C1E] bg-white shadow-[4px_4px_0px_0px_#191C1E] crop-marks">
                  <div className="flex justify-between items-center border-b border-[#ECEEF0] pb-1 mb-2 font-mono-code text-[10px] text-[#191C1E] font-bold">
                    <span>SECURITY_CORE_STATUS</span>
                    <span className="text-[#BA1A1A] animate-pulse">FIREWALL_BREACHED</span>
                  </div>
                  <div className="font-mono-code text-[10px] space-y-1 text-[#46464B]">
                    <div className="flex justify-between">
                      <span>MAIN_GRID</span> <span className="text-[#191C1E] font-bold">OFFLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CORE_TEMP</span> <span className="text-[#BA1A1A] font-bold">CRITICAL // 94°C</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-1 h-2">
                    <div className="bg-[#191C1E] flex-1"></div>
                    <div className="bg-[#191C1E] flex-1"></div>
                    <div className="bg-[#006875] flex-1"></div>
                    <div className="bg-[#D8DADC] flex-1"></div>
                  </div>
                </div>

                {/* 存入新机密表单 */}
                <div className="p-3 space-y-2.5 bg-white border-2 border-[#191C1E] shadow-[4px_4px_0px_0px_#191C1E]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono-code text-[10px] font-bold text-[#191C1E]">
                      // ENCRYPT_INTO_BLACK_BOX
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVaultForm(!showVaultForm)}
                      className="font-mono-code text-[10px] px-2 py-0.5 transition-colors cursor-pointer border border-[#D8DADC] bg-[#F8F9FB] text-[#191C1E] hover:border-[#191C1E]"
                    >
                      {showVaultForm ? '[-] HIDE_PANEL ▲' : '[+] NEW_SECRET ▾'}
                    </button>
                  </div>

                  {showVaultForm && (
                    <form onSubmit={handleAddVaultItem} className="space-y-2.5 pt-1 border-t border-[#D8DADC]">
                      <input
                        type="text"
                        value={newVaultTitle}
                        onChange={(e) => setNewVaultTitle(e.target.value)}
                        placeholder="SECRET CODENAME (e.g. OPERATION_DARKSTAR)..."
                        className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] p-2 text-xs font-mono-code focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                      />
                      <textarea
                        value={newVaultContent}
                        onChange={(e) => setNewVaultContent(e.target.value)}
                        placeholder="CONFIDENTIAL CONTENT TO LOCK & CIPHER..."
                        rows={3}
                        className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] font-space p-2 text-xs focus:outline-none resize-none placeholder-[#76777B]"
                      />
                      <input
                        type="text"
                        value={newVaultTags}
                        onChange={(e) => setNewVaultTags(e.target.value)}
                        placeholder="TAGS (e.g. TOP_SECRET, LEVEL_5)..."
                        className="w-full bg-[#F8F9FB] border border-[#D8DADC] text-[#191C1E] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#191C1E] placeholder-[#76777B]"
                      />
                      <div className="flex justify-between items-center pt-1 border-t border-[#D8DADC]">
                        <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#191C1E] select-none">
                          <input
                            type="checkbox"
                            checked={newVaultEncrypt}
                            onChange={(e) => setNewVaultEncrypt(e.target.checked)}
                            className="accent-[#BA1A1A] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>ENCRYPT WITH HEX CIPHER</span>
                        </label>
                        <button
                          type="submit"
                          disabled={!newVaultTitle.trim() || !newVaultContent.trim()}
                          className="bg-[#191C1E] text-white hover:bg-[#006875] disabled:opacity-40 px-3.5 py-1.5 font-mono-code text-xs font-bold uppercase transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#76777B] flex items-center gap-1 btn-chamfer"
                        >
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          <span>LOCK & SAVE</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* 归档机密列表 */}
                <div className="space-y-3">
                  {vaultItems.map((item) => (
                    <div key={item.id} className="relative overflow-hidden group">
                      <div className="absolute inset-y-0 right-0 w-20 bg-[#BA1A1A] flex items-center justify-center text-white z-0">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteVaultItem(item.id, e)}
                          className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-black/20 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                          <span>PURGE</span>
                        </button>
                      </div>

                      <motion.article
                        drag="x"
                        dragConstraints={{ left: -75, right: 0 }}
                        dragElastic={0.05}
                        animate={{ x: swipedVaultId === item.id ? -75 : 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -25 || info.velocity.x < -150) {
                            setSwipedVaultId(item.id);
                          } else if (info.offset.x > 15 || info.velocity.x > 150) {
                            setSwipedVaultId(null);
                          }
                        }}
                        onClick={() => {
                          if (swipedVaultId === item.id) setSwipedVaultId(null);
                        }}
                        className={`relative z-10 p-3.5 select-none cursor-grab active:cursor-grabbing border-2 ${
                          item.encrypted
                            ? 'border-[#191C1E] bg-[#F8F9FB] shadow-[4px_4px_0px_0px_#191C1E]'
                            : 'border-[#191C1E] bg-white shadow-[4px_4px_0px_0px_#006875]'
                        }`}
                      >
                        <div className="flex justify-between items-center pb-1 mb-2 border-b border-[#ECEEF0]">
                          <span className="font-mono-code text-[10px] text-[#191C1E] font-bold">
                            LOG_ID: {item.logId}
                          </span>
                          <span
                            className={`font-mono-code text-[9px] px-1.5 py-0.5 font-bold uppercase ${
                              item.encrypted ? 'border border-[#BA1A1A] text-[#BA1A1A]' : 'bg-[#191C1E] text-white'
                            }`}
                          >
                            {item.encrypted ? 'ENCRYPTED' : 'DECRYPTED'}
                          </span>
                        </div>

                        <h3 className="font-space text-base font-bold text-[#191C1E] uppercase mb-1">
                          {item.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed mb-3 ${
                            item.encrypted ? 'font-mono-code break-all text-[#76777B]' : 'font-space text-[#46464B]'
                          }`}
                        >
                          {item.content}
                        </p>

                        {item.encrypted ? (
                          <button
                            type="button"
                            onClick={() => handleDecryptVault(item.id)}
                            className="w-full bg-[#191C1E] text-white hover:bg-[#006875] font-mono-code text-xs py-1.5 uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_#76777B] btn-chamfer"
                          >
                            [ ATTEMPT DECRYPTION ]
                          </button>
                        ) : (
                          <div className="flex gap-1.5">
                            {item.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 font-mono-code text-[9px] border border-[#D8DADC] bg-[#F8F9FB] text-[#191C1E]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.article>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 🌑 SYS_REBEL 专属：暗黑粗野黑客乱码视窗 */
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b-2 border-dashed border-[#FFB3AF] pb-2">
                  <div>
                    <h2 className="font-anton text-2xl uppercase text-[#FFB3AF]">THE VAULT</h2>
                    <p className="font-mono-code text-[10px] text-[#C8C5C8]">
                      SECURE ARCHIVE v2.4 // ENCRYPTED FRAGMENTS
                    </p>
                  </div>
                  <div className="font-mono-code text-[9px] bg-[#FF5357] text-[#5C000B] px-2 py-0.5 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    RESTRICTED
                  </div>
                </div>

                {/* 系统监控小部件 */}
                <div className="border-2 border-[#909191] bg-[#1F1F23] p-3 shadow-[4px_4px_0px_0px_#909191]">
                  <div className="flex justify-between items-center border-b border-dashed border-[#909191] pb-1 mb-2 font-mono-code text-[10px] text-[#C6C6C7]">
                    <span>SYSTEM_STATUS</span>
                    <span className="text-[#FF5357]">FIREWALL_BREACHED</span>
                  </div>
                  <div className="font-mono-code text-[10px] space-y-1 text-[#E9BCB9]">
                    <div className="flex justify-between">
                      <span>MAIN_GRID</span> <span className="text-[#FFB3AF]">OFFLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CORE_TEMP</span> <span className="text-[#FF5357] animate-pulse">CRITICAL</span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1 h-2">
                    <div className="bg-[#FF5357] flex-1"></div>
                    <div className="bg-[#FF5357] flex-1"></div>
                    <div className="bg-[#FF5357] flex-1"></div>
                    <div className="bg-[#343438] flex-1"></div>
                  </div>
                </div>

                {/* 存入新机密表单 */}
                <div className="bg-[#1F1F23] border-2 border-[#FFB3AF] p-3 space-y-2.5 shadow-[4px_4px_0px_0px_#FFB3AF]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono-code text-[10px] text-[#FFB3AF] font-bold">
                      // ENCRYPT_INTO_VAULT
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVaultForm(!showVaultForm)}
                      className="font-mono-code text-[10px] text-[#E9BCB9] hover:text-[#FFB3AF] border border-[#5F3E3D] hover:border-[#FFB3AF] px-1.5 py-0.5 transition-colors cursor-pointer"
                    >
                      {showVaultForm ? '[-] HIDE_PANEL ▲' : '[+] NEW_SECRET ▾'}
                    </button>
                  </div>

                  {showVaultForm && (
                    <form onSubmit={handleAddVaultItem} className="space-y-2.5 pt-1 border-t border-dashed border-[#5F3E3D]">
                      <input
                        type="text"
                        value={newVaultTitle}
                        onChange={(e) => setNewVaultTitle(e.target.value)}
                        placeholder="SECRET CODENAME (e.g. OPERATION_DARKSTAR)..."
                        className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-2 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                      />
                      <textarea
                        value={newVaultContent}
                        onChange={(e) => setNewVaultContent(e.target.value)}
                        placeholder="CONFIDENTIAL CONTENT TO LOCK & CIPHER..."
                        rows={3}
                        className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] p-2 text-xs font-chivo focus:outline-none focus:border-[#FFB3AF] resize-none placeholder-[#5F3E3D]"
                      />
                      <input
                        type="text"
                        value={newVaultTags}
                        onChange={(e) => setNewVaultTags(e.target.value)}
                        placeholder="TAGS (e.g. TOP_SECRET, LEVEL_5)..."
                        className="w-full bg-[#131317] border border-[#5F3E3D] text-[#E4E1E7] px-2 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#FFB3AF] placeholder-[#5F3E3D]"
                      />
                      <div className="flex justify-between items-center pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer font-mono-code text-[11px] text-[#E9BCB9] select-none hover:text-[#FFB3AF]">
                          <input
                            type="checkbox"
                            checked={newVaultEncrypt}
                            onChange={(e) => setNewVaultEncrypt(e.target.checked)}
                            className="accent-[#FF5357] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>ENCRYPT WITH HEX CIPHER</span>
                        </label>
                        <button
                          type="submit"
                          disabled={!newVaultTitle.trim() || !newVaultContent.trim()}
                          className="flex items-center gap-1 border-2 border-[#FFB3AF] bg-[#FFB3AF] text-[#68000E] px-3.5 py-1.5 font-mono-code text-xs font-bold uppercase hover:bg-[#FF5357] hover:text-white disabled:opacity-40 transition-colors shadow-[2px_2px_0px_0px_#131317]"
                        >
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          <span>LOCK & SAVE</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* 归档机密列表 */}
                <div className="space-y-3">
                  {vaultItems.map((item) => (
                    <div key={item.id} className="relative overflow-hidden group">
                      <div className="absolute inset-y-0 right-0 w-20 bg-[#FF5357] flex items-center justify-center text-white z-0">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteVaultItem(item.id, e)}
                          className="w-full h-full flex flex-col items-center justify-center font-mono-code text-[10px] font-bold uppercase hover:bg-[#68000E] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                          <span>PURGE</span>
                        </button>
                      </div>

                      <motion.article
                        drag="x"
                        dragConstraints={{ left: -75, right: 0 }}
                        dragElastic={0.05}
                        animate={{ x: swipedVaultId === item.id ? -75 : 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 450 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -25 || info.velocity.x < -150) {
                            setSwipedVaultId(item.id);
                          } else if (info.offset.x > 15 || info.velocity.x > 150) {
                            setSwipedVaultId(null);
                          }
                        }}
                        onClick={() => {
                          if (swipedVaultId === item.id) setSwipedVaultId(null);
                        }}
                        className={`relative z-10 border-2 p-3.5 select-none cursor-grab active:cursor-grabbing ${
                          item.encrypted
                            ? 'border-[#B08784] bg-[#1F1F23] shadow-[4px_4px_0px_0px_#B08784]'
                            : 'border-[#FFB3AF] bg-[#131317] shadow-[5px_5px_0px_0px_#FFB3AF]'
                        }`}
                      >
                        <div className="flex justify-between items-center border-b border-dotted border-[#B08784] pb-1 mb-2">
                          <span className="font-mono-code text-[10px] text-[#E4E1E7]">
                            LOG_ID: {item.logId}
                          </span>
                          <span
                            className={`font-mono-code text-[9px] px-1.5 py-0.5 font-bold uppercase ${
                              item.encrypted ? 'border border-[#FF5357] text-[#FF5357]' : 'bg-[#FFB3AF] text-[#68000E]'
                            }`}
                          >
                            {item.encrypted ? 'ENCRYPTED' : 'DECRYPTED'}
                          </span>
                        </div>

                        <h3 className="font-anton text-lg text-[#FFB3AF] uppercase mb-1">
                          {item.title}
                        </h3>
                        <p
                          className={`font-chivo text-xs text-[#E9BCB9] leading-relaxed mb-3 ${
                            item.encrypted ? 'font-mono-code break-all opacity-70' : ''
                          }`}
                        >
                          {item.content}
                        </p>

                        {item.encrypted ? (
                          <button
                            type="button"
                            onClick={() => handleDecryptVault(item.id)}
                            className="w-full border-2 border-[#FFB3AF] bg-[#131317] text-[#FFB3AF] font-mono-code text-xs py-1.5 uppercase hover:bg-[#FFB3AF] hover:text-[#68000E] transition-all shadow-[2px_2px_0px_0px_#FFB3AF] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                          >
                            Attempt Decryption
                          </button>
                        ) : (
                          <div className="flex gap-1.5">
                            {item.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="border border-[#B08784] px-1.5 py-0.5 font-mono-code text-[9px] text-[#C8C5C8]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.article>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ===================================================================== */}
          {/* TAB 5: SHIT_DUMP (废弃/脑内垃圾暂存场 - 占位模块) */}
          {/* ===================================================================== */}
          {activeTab === 'shit' && (
            <div className="space-y-4">
              <div className={`flex justify-between items-end border-b-2 pb-2 ${
                isGothic
                  ? 'border-[#E8DCC4]/30'
                  : isWhite ? 'border-[#191C1E]' : 'border-dashed border-[#FF5357]'
              }`}>
                <div>
                  <span className={`font-mono-code text-[10px] px-1.5 py-0.5 font-bold uppercase ${
                    isGothic
                      ? 'border border-[#FF2442] text-[#FF2442] bg-[#120508]'
                      : isWhite ? 'bg-[#BA1A1A] text-white' : 'bg-[#FF5357] text-[#5C000B]'
                  }`}>
                    // SECTOR_05
                  </span>
                  <h2 className={`text-2xl uppercase mt-1 font-bold ${
                    isGothic
                      ? 'font-bodoni text-[#F5F5FA]'
                      : isWhite ? 'font-space text-[#191C1E]' : 'font-anton text-[#FF5357]'
                  }`}>
                    {isGothic ? 'VOID_ABYSS.null' : 'SHIT_DUMP.bin'}
                  </h2>
                </div>
                <div className={`font-mono-code text-[9px] text-right ${
                  isGothic ? 'text-[#888890]' : isWhite ? 'text-[#76777B]' : 'text-[#E9BCB9]'
                }`}>
                  STATUS: STANDBY<br />
                  WASTE: 100% UNFILTERED
                </div>
              </div>

              {/* 占位卡片 */}
              <div className={`p-6 text-center space-y-4 ${
                isGothic
                  ? 'border border-[#E8DCC4]/30 bg-[#08080C] shadow-[0_0_15px_rgba(232,220,196,0.08)]'
                  : isWhite
                  ? 'border-2 border-[#191C1E] bg-white shadow-[6px_6px_0px_0px_#191C1E]'
                  : 'border-2 border-dashed border-[#FF5357] bg-[#1F1F23] shadow-[6px_6px_0px_0px_#FF5357]'
              }`}>
                <div className={`w-16 h-16 mx-auto flex items-center justify-center border-2 ${
                  isGothic
                    ? 'border-[#E8DCC4]/40 text-[#E8DCC4] bg-[#050508] glow-gold-wire'
                    : isWhite
                    ? 'bg-[#F8F9FB] border-[#191C1E] text-[#191C1E] shadow-[3px_3px_0px_0px_#191C1E]'
                    : 'bg-[#131317] border-[#FF5357] text-[#FF5357] shadow-[3px_3px_0px_0px_#FF5357]'
                }`}>
                  <span className="material-symbols-outlined text-3xl">delete_sweep</span>
                </div>

                <div>
                  <h3 className={`text-xl uppercase font-bold ${
                    isGothic
                      ? 'font-bodoni text-[#F5F5FA]'
                      : isWhite ? 'font-space text-[#191C1E]' : 'font-anton text-[#FFB3AF]'
                  }`}>
                    MODULE UNDER SANCTIFICATION
                  </h3>
                  <p className={`font-mono-code text-xs mt-1 max-w-xs mx-auto leading-relaxed ${
                    isGothic ? 'text-[#888890]' : isWhite ? 'text-[#76777B]' : 'text-[#E9BCB9]'
                  }`}>
                    [ VOID // UNFILTERED COGNITIVE PURGE BUFFER ]<br />
                    Module reserved for raw thought streams & instant disposal pipeline.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('diary')}
                    className={`px-4 py-2 font-mono-code text-xs font-bold uppercase transition-colors cursor-pointer ${
                      isGothic
                        ? 'border border-[#E8DCC4] bg-[#E8DCC4] text-[#050508] hover:bg-white'
                        : isWhite
                        ? 'bg-[#191C1E] text-white hover:bg-[#006875] shadow-[3px_3px_0px_0px_#76777B]'
                        : 'border-2 border-[#FFB3AF] bg-[#FFB3AF] text-[#68000E] hover:bg-[#FF5357] hover:text-white shadow-[3px_3px_0px_0px_#131317]'
                    }`}
                  >
                    RETURN_TO_DIARY
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>

        {/* ========================================================================= */}
        {/* 底部导航栏 (BottomNavBar - 三模适配) */}
        {/* ========================================================================= */}
        <nav className={`h-16 flex justify-around items-center px-3 z-30 border-t-2 ${
          isGothic
            ? 'bg-[#050508] border-[#E8DCC4]/30'
            : isWhite ? 'bg-[#F2F4F6] border-[#191C1E]' : 'bg-[#131317] border-[#FFB3AF]'
        }`}>
          
          {/* 日记 */}
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
              activeTab === 'diary'
                ? isGothic
                  ? 'border border-[#E8DCC4] bg-[#0A0A0F] text-[#E8DCC4] shadow-[0_0_8px_rgba(232,220,196,0.3)]'
                  : isWhite
                  ? 'bg-[#191C1E] text-white shadow-[2px_2px_0px_0px_#76777B]'
                  : 'bg-[#FF5357] text-[#5C000B] scale-105 shadow-[2px_2px_0px_0px_#131317]'
                : isGothic ? 'text-[#888890] hover:text-[#E8DCC4]' : isWhite ? 'text-[#76777B] hover:text-[#191C1E]' : 'text-[#E9BCB9] hover:text-[#FFB3AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">book</span>
            <span className="font-mono-code text-[9px] uppercase font-bold mt-0.5">
              {isGothic ? 'PSALMS' : 'DIARY'}
            </span>
          </button>

          {/* 目标 */}
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
              activeTab === 'goals'
                ? isGothic
                  ? 'border border-[#E8DCC4] bg-[#0A0A0F] text-[#E8DCC4] shadow-[0_0_8px_rgba(232,220,196,0.3)]'
                  : isWhite
                  ? 'bg-[#191C1E] text-white shadow-[2px_2px_0px_0px_#76777B]'
                  : 'bg-[#FF5357] text-[#5C000B] scale-105 shadow-[2px_2px_0px_0px_#131317]'
                : isGothic ? 'text-[#888890] hover:text-[#E8DCC4]' : isWhite ? 'text-[#76777B] hover:text-[#191C1E]' : 'text-[#E9BCB9] hover:text-[#FFB3AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">target</span>
            <span className="font-mono-code text-[9px] uppercase font-bold mt-0.5">
              {isGothic ? 'JUDGE' : 'KILL'}
            </span>
          </button>

          {/* 灵感 */}
          <button
            onClick={() => setActiveTab('sparks')}
            className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
              activeTab === 'sparks'
                ? isGothic
                  ? 'border border-[#E8DCC4] bg-[#0A0A0F] text-[#E8DCC4] shadow-[0_0_8px_rgba(232,220,196,0.3)]'
                  : isWhite
                  ? 'bg-[#191C1E] text-white shadow-[2px_2px_0px_0px_#76777B]'
                  : 'bg-[#FF5357] text-[#5C000B] scale-105 shadow-[2px_2px_0px_0px_#131317]'
                : isGothic ? 'text-[#888890] hover:text-[#E8DCC4]' : isWhite ? 'text-[#76777B] hover:text-[#191C1E]' : 'text-[#E9BCB9] hover:text-[#FFB3AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">bolt</span>
            <span className="font-mono-code text-[9px] uppercase font-bold mt-0.5">
              {isGothic ? 'HALOS' : 'SPARKS'}
            </span>
          </button>

          {/* 收藏 */}
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
              activeTab === 'vault'
                ? isGothic
                  ? 'border border-[#E8DCC4] bg-[#0A0A0F] text-[#E8DCC4] shadow-[0_0_8px_rgba(232,220,196,0.3)]'
                  : isWhite
                  ? 'bg-[#191C1E] text-white shadow-[2px_2px_0px_0px_#76777B]'
                  : 'bg-[#FF5357] text-[#5C000B] scale-105 shadow-[2px_2px_0px_0px_#131317]'
                : isGothic ? 'text-[#888890] hover:text-[#E8DCC4]' : isWhite ? 'text-[#76777B] hover:text-[#191C1E]' : 'text-[#E9BCB9] hover:text-[#FFB3AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">lock</span>
            <span className="font-mono-code text-[9px] uppercase font-bold mt-0.5">
              {isGothic ? 'SANCTUM' : 'VAULT'}
            </span>
          </button>

        </nav>

        {/* 撕毁重开全屏横幅 (强尼·银手 2023 昨日重现彩蛋) */}
        <AnimatePresence>
          {showTornBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-[#131317]/95 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="border-4 border-[#FF5357] p-5 bg-[#0E0E11] shadow-[8px_8px_0px_0px_#FF5357]">
                <div className="font-mono-code text-[10px] text-[#FFB3AF] tracking-widest uppercase mb-1">
                  // SILVERHAND_RESONANCE [2023_FLASHBACK]
                </div>
                <div className="font-anton text-3xl sm:text-4xl text-[#FF5357] tracking-wider uppercase leading-tight">
                  PARTY LIKE IT'S 2023
                </div>
                <p className="font-mono-code text-xs text-[#E4E1E7] mt-2.5">
                  [ WAKE THE FUCK UP, SAMURAI · WE HAVE A CITY TO BURN ]
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 侧边抽屉栏 (三模主题矩阵切换) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* 暗黑背景遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black z-40 cursor-pointer"
              />

              {/* 滑出抽屉主体 */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className={`absolute inset-y-0 left-0 w-3/4 max-w-[300px] border-r-2 z-50 p-4 flex flex-col justify-between ${
                  isGothic
                    ? 'bg-[#050508] border-[#E8DCC4]/30 shadow-[8px_0px_20px_rgba(0,0,0,0.9)]'
                    : isWhite
                    ? 'bg-[#F2F4F6] border-[#191C1E] shadow-[6px_0px_0px_0px_#191C1E] bg-blueprint'
                    : 'bg-[#131317] border-[#FFB3AF] shadow-[8px_0px_0px_0px_rgba(255,179,175,0.4)] brutalist-grid'
                }`}
              >
                <div className="space-y-4">
                  {/* 抽屉头部 */}
                  <div className={`flex justify-between items-center border-b-2 pb-3 ${
                    isGothic
                      ? 'border-[#E8DCC4]/30'
                      : isWhite ? 'border-[#191C1E]' : 'border-[#FFB3AF]'
                  }`}>
                    <div>
                      <h3 className={`text-xl uppercase font-bold ${
                        isGothic
                          ? 'font-bodoni text-[#E8DCC4]'
                          : isWhite ? 'font-space text-[#191C1E]' : 'font-anton text-[#FFB3AF]'
                      }`}>
                        {isGothic ? 'SANCTUM_CORE' : isWhite ? 'PRTS_SYSTEM' : 'SYS_CONTROL'}
                      </h3>
                      <p className={`font-mono-code text-[9px] ${
                        isGothic ? 'text-[#888890]' : isWhite ? 'text-[#76777B]' : 'text-[#B08784]'
                      }`}>
                        {isGothic ? 'HEAVEN_GRIEF // v4.0' : isWhite ? 'RHODES_PROTOCOL // v3.1' : 'SESSION_DRAWER // v2.0'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className={`px-2 py-0.5 font-mono-code text-xs font-bold transition-colors cursor-pointer border ${
                        isGothic
                          ? 'border-[#E8DCC4]/40 text-[#E8DCC4] hover:bg-[#E8DCC4] hover:text-[#050508]'
                          : isWhite
                          ? 'border-[#191C1E] bg-[#191C1E] text-white hover:bg-[#BA1A1A]'
                          : 'border-[#FF5357] text-[#FF5357] hover:bg-[#FF5357] hover:text-white'
                      }`}
                    >
                      [×]
                    </button>
                  </div>

                  {/* 🌟 侧边栏专属：三模主题切换矩阵 */}
                  <div className={`p-3 space-y-2 border ${
                    isGothic
                      ? 'bg-[#09090D] border-[#E8DCC4]/30 glow-gold-wire'
                      : isWhite
                      ? 'bg-white border-[#191C1E] shadow-[3px_3px_0px_0px_#191C1E]'
                      : 'bg-[#1F1F23] border-[#343438] shadow-[3px_3px_0px_0px_#FFB3AF]'
                  }`}>
                    <div className={`text-[10px] font-mono-code flex justify-between items-center ${
                      isGothic ? 'text-[#E8DCC4] font-bold' : isWhite ? 'text-[#191C1E] font-bold' : 'text-[#E9BCB9]'
                    }`}>
                      <span>// THEME_MATRIX</span>
                      <span className={`text-[8px] px-1.5 py-0.5 font-mono-code uppercase font-bold ${
                        isGothic ? 'bg-[#D4AF37] text-[#050508]' : isWhite ? 'bg-[#006875] text-white' : 'bg-[#FF5357] text-white'
                      }`}>
                        {isGothic ? 'ACTIVE: GOTHIC' : isWhite ? 'ACTIVE: PRTS' : 'ACTIVE: REBEL'}
                      </span>
                    </div>

                    {/* 三选按钮 */}
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setTheme('cyber_rebel')}
                        className={`py-2 px-0.5 text-center font-mono-code text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                          isCyber
                            ? 'bg-[#FF5357] text-white border-[#FF5357] shadow-[2px_2px_0px_0px_#131317]'
                            : 'bg-[#18181D] text-[#8E8E93] border-[#343438] hover:text-white'
                        }`}
                      >
                        CYBER
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('prts_white')}
                        className={`py-2 px-0.5 text-center font-mono-code text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                          isWhite
                            ? 'bg-[#191C1E] text-white border-[#191C1E] shadow-[2px_2px_0px_0px_#006875]'
                            : 'bg-[#18181D] text-[#8E8E93] border-[#343438] hover:text-white'
                        }`}
                      >
                        PRTS
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('heaven_grief')}
                        className={`py-2 px-0.5 text-center font-mono-code text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                          isGothic
                            ? 'bg-[#E8DCC4] text-[#050508] border-[#E8DCC4] shadow-[0_0_8px_rgba(232,220,196,0.4)]'
                            : 'bg-[#18181D] text-[#8E8E93] border-[#343438] hover:text-white'
                        }`}
                      >
                        GOTHIC
                      </button>
                    </div>
                  </div>

                  {/* 快捷板块导航 */}
                  <div className="space-y-1 font-mono-code text-xs">
                    <div className={`text-[9px] pb-1 uppercase tracking-wider ${
                      isGothic ? 'text-[#888890]' : isWhite ? 'text-[#76777B]' : 'text-[#8E8E93]'
                    }`}>
                      // DIRECTORY_LINKS
                    </div>
                    {[
                      { id: 'diary', label: isGothic ? '01. LAMENT_DIARY' : '01. RAW_DIARY', icon: 'book' },
                      { id: 'goals', label: isGothic ? '02. JUDGMENT_ALTAR' : '02. KILL_LIST_GOALS', icon: 'target' },
                      { id: 'sparks', label: isGothic ? '03. SHATTERED_HALOS' : '03. RAW_SPARKS', icon: 'bolt' },
                      { id: 'vault', label: isGothic ? '04. SANCTUM_RELIQUARY' : '04. THE_VAULT', icon: 'lock' },
                      { id: 'shit', label: isGothic ? '05. VOID_ABYSS' : '05. SHIT_DUMP (WASTE)', icon: 'delete_sweep' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as TabType);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 text-left border transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? isGothic
                              ? 'bg-[#E8DCC4] text-[#050508] border-[#E8DCC4] font-bold shadow-[0_0_8px_rgba(232,220,196,0.3)]'
                              : isWhite
                              ? 'bg-[#191C1E] text-white border-[#191C1E] font-bold shadow-[2px_2px_0px_0px_#76777B]'
                              : 'bg-[#FFB3AF] text-[#68000E] border-[#FFB3AF] font-bold shadow-[2px_2px_0px_0px_#131317]'
                            : isGothic
                              ? 'border-transparent text-[#888890] hover:text-[#E8DCC4]'
                              : isWhite
                              ? 'border-transparent hover:border-[#D8DADC] text-[#191C1E] hover:bg-[#E0E3E5]'
                              : 'border-transparent hover:border-[#5F3E3D] text-[#E4E1E7] hover:text-[#FFB3AF]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 底部协议控制 */}
                <div className={`pt-4 border-t space-y-2 font-mono-code text-[10px] ${
                  isGothic ? 'border-[#E8DCC4]/20' : isWhite ? 'border-[#D8DADC]' : 'border-dashed border-[#5F3E3D]'
                }`}>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      triggerTearIt();
                    }}
                    className={`w-full p-2 font-bold uppercase transition-colors text-center block cursor-pointer ${
                      isGothic
                        ? 'border border-[#FF2442] text-[#FF2442] hover:bg-[#FF2442] hover:text-white'
                        : isWhite
                        ? 'border-2 border-[#BA1A1A] text-[#BA1A1A] hover:bg-[#BA1A1A] hover:text-white'
                        : 'border-2 border-dashed border-[#FF5357] text-[#FF5357] hover:bg-[#FF5357] hover:text-white'
                    }`}
                  >
                    {isGothic ? '[ INVOKE_HELLFALL_RESTART ]' : '[ EXECUTE_FUCK_PROTOCOL ]'}
                  </button>
                  <div className={`text-center text-[8px] ${
                    isGothic ? 'text-[#888890]' : isWhite ? 'text-[#76777B]' : 'text-[#5F3E3D]'
                  }`}>
                    {isGothic ? 'HEAVEN_GRIEF ENGINE // PURGE IS IMMINENT' : isWhite ? 'PRTS PROTOCOL ENGINE // ALL CLEAR' : 'SYS_REBEL ENGINE // NO REGRETS'}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 图片大图预览 Modal */}
        <AnimatePresence>
          {selectedPreviewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPreviewImage(null)}
              className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <div className="border-2 border-[#FFB3AF] p-1 bg-[#131317] shadow-[6px_6px_0px_0px_#FFB3AF] max-w-full max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center border-b border-[#FFB3AF] pb-1 px-2 mb-2 font-mono-code text-[10px] text-[#FFB3AF]">
                  <span>FILE_VIEWER.dat</span>
                  <span className="text-[#FF5357] font-bold">[CLICK TO CLOSE]</span>
                </div>
                <img
                  src={selectedPreviewImage}
                  alt="preview"
                  className="max-h-[70vh] object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default App;
