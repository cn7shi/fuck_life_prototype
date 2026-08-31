// True Physical & Acoustic Sample Modeling Engine (真实物理录音级微声采样引擎)

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

// 1. 真实客制化机械键盘 (Real Mechanical Switch "Thock" & Stem Clack)
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Bottom-out housing thock (轴心触底沉闷木质声 180Hz -> 60Hz)
  const thock = ctx.createOscillator();
  const thockGain = ctx.createGain();
  thock.type = 'triangle';
  thock.frequency.setValueAtTime(240, now);
  thock.frequency.exponentialRampToValueAtTime(55, now + 0.035);

  thockGain.gain.setValueAtTime(0.22, now);
  thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  thock.connect(thockGain);
  thockGain.connect(ctx.destination);
  thock.start(now);
  thock.stop(now + 0.035);

  // 2. Leaf ping / stem contact click (弹片与轴心撞击高频清脆切片 3.8kHz)
  const snap = ctx.createOscillator();
  const snapGain = ctx.createGain();
  snap.type = 'sine';
  snap.frequency.setValueAtTime(3600, now);
  snap.frequency.exponentialRampToValueAtTime(900, now + 0.012);

  snapGain.gain.setValueAtTime(0.08, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  snap.connect(snapGain);
  snapGain.connect(ctx.destination);
  snap.start(now);
  snap.stop(now + 0.012);
}

// 2. 真实重型物理印章盖印声 (Real Heavy Wooden / Metal Desk Stamp Impact)
export function playKillSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Heavy desk table thump (木桌沉重撞击低音 85Hz)
  const thump = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(95, now);
  thump.frequency.exponentialRampToValueAtTime(28, now + 0.14);

  thumpGain.gain.setValueAtTime(0.65, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  thump.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.14);

  // 2. Rubber stamp slap transient (印章橡胶面接触纸面清脆啪嗒声)
  const bufferSize = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100, now);
  filter.Q.setValueAtTime(2, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.4, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.04);
}

// 3. 真实物理撕纸声采样 (Real Physical Paper Fiber Tearing & Rip)
export function playTearSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const dur = 0.32;

  // 真实纸张纤维撕断颗粒声 (Real Paper Rip Transient Wave)
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    // 模拟纤维连续断裂的微突触脉冲
    const progress = i / bufferSize;
    const fiberBurst = Math.sin(i * 0.15) * Math.cos(i * 0.07);
    const noise = (Math.random() * 2 - 1) * 0.8;
    const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.3);
    data[i] = (fiberBurst * 0.4 + noise * 0.6) * envelope;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1600, now);
  filter.frequency.linearRampToValueAtTime(800, now + dur);
  filter.Q.setValueAtTime(1.8, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + dur);
}

// 4. 真实物理风铃/铜钵空灵共振 (Real Singing Bowl & Chime Modal Resonance)
export function playRebootSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const harmonics = [
    { freq: 440, gain: 0.18, decay: 0.6 },
    { freq: 880, gain: 0.08, decay: 0.4 },
    { freq: 1320, gain: 0.04, decay: 0.25 },
  ];

  harmonics.forEach((h) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(h.freq, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(h.gain, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + h.decay);
  });
}

// 5. 真实打字机微动齿轮声 (Real Mechanical Typewriter Escapement Click)
export function playDecryptSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 4; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + i * 0.035;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + i * 80, startTime);
    osc.frequency.exponentialRampToValueAtTime(400, startTime + 0.015);

    gain.gain.setValueAtTime(0.07, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.015);
  }
}
