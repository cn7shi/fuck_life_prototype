// Cyberpunk & Sci-Fi Terminal Studio Audio Engine (真实赛博黑客终端与机能开源游戏音频引擎)

export type SoundProfile = 'cyber_terminal' | 'tactical_mech' | 'hacker_matrix' | 'kenney_clean';

let soundEnabled = true;
let currentProfile: SoundProfile = 'cyber_terminal';

// 从 localStorage 读取用户选择的音效包，默认是 ⚡ cyber_terminal
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('fk_sound_profile') as SoundProfile | null;
  if (saved && ['cyber_terminal', 'tactical_mech', 'hacker_matrix', 'kenney_clean'].includes(saved)) {
    currentProfile = saved;
  }
}

// 零延迟多实例音频池
const audioPool: Record<string, HTMLAudioElement[]> = {};
const POOL_SIZE = 5;

function getAudio(path: string): HTMLAudioElement {
  if (!audioPool[path]) {
    audioPool[path] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioPool[path].push(audio);
    }
  }

  const pool = audioPool[path];
  for (const audio of pool) {
    if (audio.paused || audio.ended) {
      audio.currentTime = 0;
      return audio;
    }
  }

  const oldest = pool[0];
  oldest.currentTime = 0;
  return oldest;
}

// 预加载所有赛博终端核心音频
if (typeof window !== 'undefined') {
  const preloadList = [
    '/sounds/twoTone1.ogg',
    '/sounds/twoTone2.ogg',
    '/sounds/threeTone1.ogg',
    '/sounds/tone1.ogg',
    '/sounds/zap1.ogg',
    '/sounds/zap2.ogg',
    '/sounds/laser1.ogg',
    '/sounds/impactPlate_heavy_000.ogg',
    '/sounds/impactMetal_heavy_000.ogg',
    '/sounds/phaserDown1.ogg',
    '/sounds/spaceTrash1.ogg',
    '/sounds/phaseJump1.ogg',
    '/sounds/powerUp7.ogg',
    '/sounds/powerUp10.ogg',
    '/sounds/click_002.wav',
    '/sounds/switch12.wav',
  ];

  preloadList.forEach((src) => {
    try {
      getAudio(src);
    } catch {
      // ignore
    }
  });
}

function playSoundFile(path: string, volume = 0.75) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const audio = getAudio(path);
    audio.volume = Math.max(0, Math.min(1, volume));
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 自动播放策略保护
      });
    }
  } catch {
    // ignore
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(enabled?: boolean): boolean {
  soundEnabled = enabled !== undefined ? enabled : !soundEnabled;
  return soundEnabled;
}

export function getSoundProfile(): SoundProfile {
  return currentProfile;
}

export function setSoundProfile(profile: SoundProfile) {
  currentProfile = profile;
  if (typeof window !== 'undefined') {
    localStorage.setItem('fk_sound_profile', profile);
  }
  playClickSound();
}

// ============================================================================
// 1. 点击 / 切换 TAB / 交互声 (真实赛博终端光标与全息脉冲)
// ============================================================================
export function playClickSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      // 2077 HUD 全息数据脉冲滴答
      playSoundFile('/sounds/twoTone1.ogg', 0.65);
      break;
    case 'tactical_mech':
      // 机能战术金属快门
      playSoundFile('/sounds/switch12.wav', 0.6);
      break;
    case 'hacker_matrix':
      // 矩阵终端高频数据流
      playSoundFile('/sounds/tone1.ogg', 0.55);
      break;
    case 'kenney_clean':
      // 极简微动
      playSoundFile('/sounds/click_002.wav', 0.6);
      break;
  }
}

// ============================================================================
// 2. 斩杀目标 / EXECUTE 协议达成声 (等离子斩击 / 重型装甲砸落)
// ============================================================================
export function playKillSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      // 赛博电浆等离子离子电火花斩杀 (Plasma Zap Strike)
      playSoundFile('/sounds/zap1.ogg', 0.85);
      break;
    case 'tactical_mech':
      // 重型战术金属装甲猛烈夯击 (Heavy Armor Plate Slam)
      playSoundFile('/sounds/impactPlate_heavy_000.ogg', 0.9);
      break;
    case 'hacker_matrix':
      // 激光阵列熔断斩击 (Laser Target Vaporized)
      playSoundFile('/sounds/laser1.ogg', 0.8);
      break;
    case 'kenney_clean':
      playSoundFile('/sounds/drop_001.wav', 0.8);
      break;
  }
}

// ============================================================================
// 3. FUCK 撕毁 / 终端崩溃倾倒声 (Terminal Dump / Phaser Down Crash)
// ============================================================================
export function playTearSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      // 赛博神经链接过载熔断 (Phaser Overload Dump)
      playSoundFile('/sounds/phaserDown1.ogg', 0.85);
      break;
    case 'tactical_mech':
      // 重型金属粉碎撕裂 (Heavy Metal Impact Tear)
      playSoundFile('/sounds/impactMetal_heavy_000.ogg', 0.85);
      break;
    case 'hacker_matrix':
      // 内存垃圾强制抹除 (Memory Buffer Purge)
      playSoundFile('/sounds/spaceTrash1.ogg', 0.8);
      break;
    case 'kenney_clean':
      playSoundFile('/sounds/scratch_001.wav', 0.8);
      break;
  }
}

// ============================================================================
// 4. 重开唤醒 / 跃迁上线声 (Cyber Warp / Neural Link Reconnected)
// ============================================================================
export function playRebootSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      // 神经跃迁引擎重启动能 (Phase Jump Warp)
      playSoundFile('/sounds/phaseJump1.ogg', 0.85);
      break;
    case 'tactical_mech':
      // 罗德岛 PRTS 战术协议全系统充能 (Tactical Power Up)
      playSoundFile('/sounds/powerUp10.ogg', 0.85);
      break;
    case 'hacker_matrix':
      // 矩阵核心超频上线 (Matrix Core Online)
      playSoundFile('/sounds/powerUp7.ogg', 0.8);
      break;
    case 'kenney_clean':
      playSoundFile('/sounds/confirmation_001.wav', 0.8);
      break;
  }
}

// ============================================================================
// 5. 密文解密 / 黑客破解声 (Hacker Terminal Decrypt)
// ============================================================================
export function playDecryptSound() {
  if (!soundEnabled) return;
  playSoundFile('/sounds/threeTone1.ogg', 0.6);
}
