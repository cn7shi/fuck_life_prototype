// Studio-Grade Tactile & Dopamine Audio Engine (高级触觉与多巴胺声学物理引擎)

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(enabled?: boolean): boolean {
  soundEnabled = enabled !== undefined ? enabled : !soundEnabled;
  if (soundEnabled) {
    getAudioContext();
  }
  return soundEnabled;
}

// 1. 极致解压的触觉气泡微动音 (Ultra-Satisfying Tactile "Pop-Tok" / iOS Switch)
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Warm round pop (柔和饱满的木质微气泡音 520Hz -> 220Hz)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(560, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.022);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.14, now + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.022);
}

// 2. 斩杀胜利重击盖章音 (Triumphant Desk Stamp "THUD-SNAP!" / JoyCon Clack)
export function playKillSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. 沉重桌面低频夯击 (Heavy Sub Thump 75Hz -> 24Hz)
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(80, now);
  subOsc.frequency.exponentialRampToValueAtTime(24, now + 0.15);

  subGain.gain.setValueAtTime(0.001, now);
  subGain.gain.linearRampToValueAtTime(0.5, now + 0.004);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.15);

  // 2. 机械卡扣清脆撞击 (Crisp Latch Snap 1200Hz)
  const snapOsc = ctx.createOscillator();
  const snapGain = ctx.createGain();
  snapOsc.type = 'triangle';
  snapOsc.frequency.setValueAtTime(1200, now);
  snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.03);

  snapGain.gain.setValueAtTime(0.001, now);
  snapGain.gain.linearRampToValueAtTime(0.2, now + 0.002);
  snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  snapOsc.connect(snapGain);
  snapGain.connect(ctx.destination);
  snapOsc.start(now);
  snapOsc.stop(now + 0.03);
}

// 3. 真实物理撕纸声 + 真空重置 (Real Organic Paper Rip & Void Drop)
export function playTearSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const dur = 0.26;

  // 真实纸张撕裂纹理
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const progress = i / bufferSize;
    // 粗糙撕拉纤维阻尼
    const tearBurst = (Math.random() * 2 - 1) * Math.sin(i * 0.12);
    const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.2);
    data[i] = tearBurst * envelope;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + dur);
  filter.Q.setValueAtTime(2.0, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + dur);
}

// 4. 治愈系大三和弦唤醒风铃 (Uplifting Major Triad Awakening Chime)
export function playRebootSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C大调大三和弦纯净琶音 (C5 -> E5 -> G5 -> C6)
  const notes = [
    { freq: 523.25, timeOffset: 0.00, gain: 0.16 }, // C5
    { freq: 659.25, timeOffset: 0.04, gain: 0.14 }, // E5
    { freq: 783.99, timeOffset: 0.08, gain: 0.13 }, // G5
    { freq: 1046.50, timeOffset: 0.12, gain: 0.15 }, // C6
  ];

  notes.forEach(({ freq, timeOffset, gain: noteGain }) => {
    const startTime = now + timeOffset;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(noteGain, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

// 5. 极微弱机械齿轮密文滴答声 (Subtle Mechanical Typewriter Ticks)
export function playDecryptSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const startTime = now + i * 0.03;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + i * 120, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.015);
  }
}
