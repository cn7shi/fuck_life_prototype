// Web Audio API 0ms 零延迟极速声学引擎 (AudioContext + AudioBuffer 内存预解码池)

export type SoundProfile = 'cyber_terminal' | 'tactical_mech' | 'hacker_matrix' | 'kenney_clean';

let soundEnabled = true;
let currentProfile: SoundProfile = 'cyber_terminal';
let clickToggle = 0;

// 从 localStorage 读取用户选择的音效包
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('fk_sound_profile') as SoundProfile | null;
  if (saved && ['cyber_terminal', 'tactical_mech', 'hacker_matrix', 'kenney_clean'].includes(saved)) {
    currentProfile = saved;
  }
}

// 核心 Web Audio 上下文与音频缓冲区缓存 (AudioBuffer Cache)
let audioCtx: AudioContext | null = null;
const audioBufferCache: Record<string, AudioBuffer> = {};
const loadingPromises: Record<string, Promise<AudioBuffer | null>> = {};

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// 异步拉取并解码音频为内存无损 Buffer (0ms 瞬时播放)
async function loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
  if (audioBufferCache[url]) return audioBufferCache[url];
  if (url in loadingPromises) return loadingPromises[url];

  const promise = (async () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return null;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache[url] = decoded;
      return decoded;
    } catch {
      return null;
    }
  })();

  loadingPromises[url] = promise;
  return promise;
}

// 核心预加载列表
const ALL_SFX = [
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
  '/sounds/drop_001.wav',
  '/sounds/confirmation_001.wav',
];

if (typeof window !== 'undefined') {
  // 页面加载即后台预拉取解码
  ALL_SFX.forEach((url) => loadAudioBuffer(url));

  // 用户首次触控/点击时激活 AudioContext
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

// 0ms 播放函数 (AudioBufferSourceNode)
function playBuffer(url: string, volume = 0.75, pitch = 1.0) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const buffer = audioBufferCache[url];
    if (!buffer) {
      // 若尚未解码完成，后台拉取并不阻塞
      loadAudioBuffer(url).then((buf) => {
        if (buf && ctx) {
          const source = ctx.createBufferSource();
          source.buffer = buf;
          source.playbackRate.value = pitch;
          const gain = ctx.createGain();
          gain.gain.value = Math.max(0, Math.min(1, volume));
          source.connect(gain);
          gain.connect(ctx.destination);
          source.start(0);
        }
      });
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch;

    const gain = ctx.createGain();
    gain.gain.value = Math.max(0, Math.min(1, volume));

    source.connect(gain);
    gain.connect(ctx.destination);

    // 真正 0.000s 零延迟触发
    source.start(0);
  } catch {
    // 忽略异常
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

// 1. 点击 / TAB 切换 SFX (微调随机音高，带来有机触感)
export function playClickSound() {
  if (!soundEnabled) return;
  clickToggle = (clickToggle + 1) % 2;
  const randomPitch = 0.98 + Math.random() * 0.04;

  switch (currentProfile) {
    case 'cyber_terminal':
      playBuffer(clickToggle === 0 ? '/sounds/twoTone1.ogg' : '/sounds/twoTone2.ogg', 0.6, randomPitch);
      break;
    case 'tactical_mech':
      playBuffer('/sounds/switch12.wav', 0.6, randomPitch);
      break;
    case 'hacker_matrix':
      playBuffer('/sounds/tone1.ogg', 0.5, randomPitch);
      break;
    case 'kenney_clean':
      playBuffer('/sounds/click_002.wav', 0.6, randomPitch);
      break;
  }
}

// 2. 斩杀目标 / EXECUTE SFX (双层等离子斩击 + 重型装甲下沉)
export function playKillSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      playBuffer('/sounds/zap1.ogg', 0.85);
      setTimeout(() => {
        playBuffer('/sounds/impactPlate_heavy_000.ogg', 0.45);
      }, 30);
      break;
    case 'tactical_mech':
      playBuffer('/sounds/impactPlate_heavy_000.ogg', 0.9);
      break;
    case 'hacker_matrix':
      playBuffer('/sounds/laser1.ogg', 0.85);
      break;
    case 'kenney_clean':
      playBuffer('/sounds/drop_001.wav', 0.8);
      break;
  }
}

// 3. FUCK 撕毁 / 终端崩溃停机 SFX
export function playTearSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      playBuffer('/sounds/phaserDown1.ogg', 0.9);
      break;
    case 'tactical_mech':
      playBuffer('/sounds/impactMetal_heavy_000.ogg', 0.85);
      break;
    case 'hacker_matrix':
      playBuffer('/sounds/spaceTrash1.ogg', 0.8);
      break;
    case 'kenney_clean':
      playBuffer('/sounds/drop_001.wav', 0.8);
      break;
  }
}

// 4. 重开唤醒 / 跃迁上线 SFX
export function playRebootSound() {
  if (!soundEnabled) return;
  switch (currentProfile) {
    case 'cyber_terminal':
      playBuffer('/sounds/phaseJump1.ogg', 0.9);
      break;
    case 'tactical_mech':
      playBuffer('/sounds/powerUp10.ogg', 0.85);
      break;
    case 'hacker_matrix':
      playBuffer('/sounds/powerUp7.ogg', 0.8);
      break;
    case 'kenney_clean':
      playBuffer('/sounds/confirmation_001.wav', 0.8);
      break;
  }
}

// 5. 密文解密 / 复制 SFX
export function playDecryptSound() {
  if (!soundEnabled) return;
  playBuffer('/sounds/threeTone1.ogg', 0.65);
}
