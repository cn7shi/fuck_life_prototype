// Real Open-Source Studio Game Audio Engine (基于 Kenney CC0 专业开源游戏音频库)

export type SoundProfile = 'kenney_ui' | 'cyber_glitch' | 'mechanical' | 'retro_arcade';

let soundEnabled = true;
let currentProfile: SoundProfile = 'kenney_ui';

// 从 localStorage 读取上次选中的音效包
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('fk_sound_profile') as SoundProfile | null;
  if (saved && ['kenney_ui', 'cyber_glitch', 'mechanical', 'retro_arcade'].includes(saved)) {
    currentProfile = saved;
  }
}

// 缓存与预加载音效池 (零延迟即按即响)
const audioPool: Record<string, HTMLAudioElement[]> = {};
const POOL_SIZE = 4;

function getAudio(path: string): HTMLAudioElement {
  if (!audioPool[path]) {
    audioPool[path] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioPool[path].push(audio);
    }
  }

  // 找一个当前闲置或最早播放的音频实例
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

// 预加载所有核心音效
if (typeof window !== 'undefined') {
  const preloadList = [
    '/sounds/click_002.wav',
    '/sounds/click1.wav',
    '/sounds/switch10.wav',
    '/sounds/tick_001.wav',
    '/sounds/drop_001.wav',
    '/sounds/drop_002.wav',
    '/sounds/scratch_001.wav',
    '/sounds/scratch_002.wav',
    '/sounds/glitch_001.wav',
    '/sounds/confirmation_001.wav',
    '/sounds/maximize_001.wav',
    '/sounds/glass_001.wav',
  ];

  preloadList.forEach((src) => {
    try {
      getAudio(src);
    } catch {
      // ignore
    }
  });
}

function playSoundFile(path: string, volume = 0.7) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const audio = getAudio(path);
    audio.volume = Math.max(0, Math.min(1, volume));
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 应对浏览器自动播放拦截策略
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

// 1. 点击声 (4 款专业开源游戏 UI 音效切片)
export function playClickSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'kenney_ui':
      // Kenney 经典清脆极简微动
      playSoundFile('/sounds/click_002.wav', 0.6);
      break;
    case 'cyber_glitch':
      // 战术机能高频开关
      playSoundFile('/sounds/switch12.wav', 0.5);
      break;
    case 'mechanical':
      // 真实机械开关与打字机
      playSoundFile('/sounds/click1.wav', 0.65);
      break;
    case 'retro_arcade':
      // 极轻复古微滴答
      playSoundFile('/sounds/tick_001.wav', 0.6);
      break;
  }
}

// 2. 斩杀盖章声 (重型下落与确认音效)
export function playKillSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'kenney_ui':
      playSoundFile('/sounds/drop_001.wav', 0.8);
      break;
    case 'cyber_glitch':
      playSoundFile('/sounds/drop_002.wav', 0.85);
      break;
    case 'mechanical':
      playSoundFile('/sounds/switch10.wav', 0.9);
      break;
    case 'retro_arcade':
      playSoundFile('/sounds/drop_003.wav', 0.75);
      break;
  }
}

// 3. 撕纸重置 FUCK 声 (真实撕纸擦拭与 Glitch 爆破)
export function playTearSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'kenney_ui':
    case 'mechanical':
      // 真实物理纸张刮擦与撕裂
      playSoundFile('/sounds/scratch_001.wav', 0.85);
      break;
    case 'cyber_glitch':
      // 赛博电磁故障重载
      playSoundFile('/sounds/glitch_001.wav', 0.8);
      break;
    case 'retro_arcade':
      playSoundFile('/sounds/scratch_003.wav', 0.75);
      break;
  }
}

// 4. 重开唤醒声 (通关/确认/风铃和弦)
export function playRebootSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'kenney_ui':
      // 游戏通关升级音
      playSoundFile('/sounds/confirmation_001.wav', 0.8);
      break;
    case 'cyber_glitch':
      // 赛博系统重构上线
      playSoundFile('/sounds/maximize_001.wav', 0.8);
      break;
    case 'mechanical':
      // 真实纯净玻璃风铃
      playSoundFile('/sounds/glass_001.wav', 0.75);
      break;
    case 'retro_arcade':
      // 经典双和弦确认
      playSoundFile('/sounds/confirmation_002.wav', 0.8);
      break;
  }
}

// 5. 密文解密滴答声
export function playDecryptSound() {
  if (!soundEnabled) return;
  playSoundFile('/sounds/tick_002.wav', 0.5);
}
