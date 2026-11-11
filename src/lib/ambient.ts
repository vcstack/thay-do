/** Âm thanh nền cho sân đọc sách — tạo bằng Web Audio API, không cần file nhạc. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let rainNodes: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let windNodes: { src: AudioBufferSourceNode; gain: GainNode; lfo: OscillatorNode } | null = null;
let chimeTimer: ReturnType<typeof setInterval> | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds = 2): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Tiếng mưa: nhiễu trắng qua lọc trầm. */
export function startRain(): boolean {
  const c = getCtx();
  if (!c || !master || rainNodes) return false;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  const gain = c.createGain();
  gain.gain.value = 0.35;
  src.connect(filter).connect(gain).connect(master);
  src.start();
  rainNodes = { src, gain };
  return true;
}

export function stopRain() {
  if (!rainNodes) return;
  try {
    rainNodes.src.stop();
  } catch {
    /* ignore */
  }
  rainNodes = null;
}

/** Tiếng gió: nhiễu qua lọc dải, tần số dao động chậm. */
export function startWind(): boolean {
  const c = getCtx();
  if (!c || !master || windNodes) return false;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.8;
  const gain = c.createGain();
  gain.gain.value = 0.25;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain).connect(filter.frequency);
  src.connect(filter).connect(gain).connect(master);
  src.start();
  lfo.start();
  windNodes = { src, gain, lfo };
  return true;
}

export function stopWind() {
  if (!windNodes) return;
  try {
    windNodes.src.stop();
    windNodes.lfo.stop();
  } catch {
    /* ignore */
  }
  windNodes = null;
}

/** Chuông gió: nốt ngẫu nhiên theo thang ngũ cung, vang dần rồi tắt. */
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export function startChimes(): boolean {
  const c = getCtx();
  if (!c || !master || chimeTimer) return false;
  const ring = () => {
    if (!ctx || !master) return;
    const freq = PENTA[Math.floor(Math.random() * PENTA.length)];
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 2.6);
  };
  ring();
  chimeTimer = setInterval(ring, 2600 + Math.random() * 2000);
  return true;
}

export function stopChimes() {
  if (!chimeTimer) return;
  clearInterval(chimeTimer);
  chimeTimer = null;
}

export function stopAllAmbient() {
  stopRain();
  stopWind();
  stopChimes();
}
