// src/lib/stores/audio.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const BGM_URL = '/assets/music-background.ogg';
const SFX_CLICKS = [
  '/assets/sfx-1.ogg','/assets/sfx-2.ogg','/assets/sfx-3.ogg',
  '/assets/sfx-4.ogg','/assets/sfx-5.ogg','/assets/sfx-6.ogg',
  '/assets/sfx-7.ogg','/assets/sfx-8.ogg','/assets/sfx-9.ogg'
];
export const SFX_SUCCESS = '/assets/sfx-success.ogg';
export const SFX_BACK    = '/assets/sfx-back.ogg';

class AudioEngine {
  ctx: AudioContext | null = null;
  isInitialized = false;
  masterGain: GainNode | null = null;
  bgmGain: GainNode | null = null;
  staticNode: AudioBufferSourceNode | null = null;
  staticFilter: BiquadFilterNode | null = null;
  staticGain: GainNode | null = null;
  staticBuffer: AudioBuffer | null = null;
  bgmElement: HTMLAudioElement | null = null;
  bgmSourceNode: MediaElementAudioSourceNode | null = null;
  bgmVolume = 0.8;
  sfxVolume = 0.5;
  isGlobalMuted = false;
  sfxBuffers: Record<string, AudioBuffer> = {};

  private ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isGlobalMuted ? 0 : 0.15;
      this.masterGain.connect(this.ctx.destination);
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);
    }
  }

  async loadSFX(urls: string[]) {
    this.ensureContext();
    await Promise.all(urls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const ab = await res.arrayBuffer();
        this.sfxBuffers[url] = await this.ctx!.decodeAudioData(ab);
      } catch (e) { console.warn(`SFX load error ${url}`, e); }
    }));
  }

  init() {
    if (this.isInitialized) return;
    this.ensureContext();
    const bufferSize = this.ctx!.sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    this.staticBuffer = buffer;
    if (this.bgmElement && !this.bgmSourceNode) this.connectBGM();
    this.isInitialized = true;
  }

  setupBGM(url: string) {
    this.bgmElement = new Audio(url);
    this.bgmElement.loop = true;
    this.bgmElement.crossOrigin = 'anonymous';
  }

  private connectBGM() {
    if (!this.ctx || !this.bgmElement) return;
    try {
      this.bgmSourceNode = this.ctx.createMediaElementSource(this.bgmElement);
      this.bgmSourceNode.connect(this.bgmGain!);
    } catch {}
  }

  wakeUp() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    if (this.bgmElement?.paused && !this.isGlobalMuted) this.bgmElement.play().catch(() => {});
  }

  startBGM() {
    if (!this.bgmElement) return;
    if (!this.isInitialized) this.init();
    if (this.bgmGain) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx!.currentTime);
      this.bgmGain.gain.value = this.isGlobalMuted ? 0 : this.bgmVolume;
    }
    this.bgmElement.play().catch(() => {});
  }

  fadeOutBGM() {
    if (!this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => this.bgmElement?.pause(), 1500);
  }

  fadeInBGM() {
    if (!this.bgmElement || !this.bgmGain || !this.ctx) return;
    if (!this.isInitialized) this.init();
    this.bgmElement.currentTime = 0;
    this.bgmElement.play().catch(() => {});
    const now = this.ctx.currentTime;
    const target = this.isGlobalMuted ? 0 : this.bgmVolume;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0, now);
    this.bgmGain.gain.linearRampToValueAtTime(target, now + 2);
  }

  setGlobalMute(muted: boolean) {
    this.isGlobalMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.15, this.ctx.currentTime, 0.1);
    }
  }

  playSound(url: string) {
    if (!this.ctx || !this.sfxBuffers[url] || this.isGlobalMuted) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.sfxBuffers[url];
    const gain = this.ctx.createGain();
    gain.gain.value = this.sfxVolume;
    src.connect(gain);
    gain.connect(this.masterGain!);
    src.start(0);
  }

  playRandomSFX() {
    const url = SFX_CLICKS[Math.floor(Math.random() * SFX_CLICKS.length)];
    this.playSound(url);
  }

  updateStatic(intensity: number) {
    if (!this.isInitialized || !this.ctx) return;
    if (intensity < 0.05) {
      this.staticGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      return;
    }
    if (!this.staticNode) {
      this.staticNode = this.ctx.createBufferSource();
      this.staticNode.buffer = this.staticBuffer;
      this.staticNode.loop = true;
      this.staticFilter = this.ctx.createBiquadFilter();
      this.staticFilter.type = 'bandpass';
      this.staticFilter.Q.value = 1;
      this.staticGain = this.ctx.createGain();
      this.staticGain.gain.value = 0;
      this.staticNode.connect(this.staticFilter);
      this.staticFilter.connect(this.staticGain);
      this.staticGain.connect(this.masterGain!);
      this.staticNode.start();
    }
    const now = this.ctx.currentTime;
    this.staticGain!.gain.setTargetAtTime(Math.min(intensity * 0.4, 0.5) * this.sfxVolume, now, 0.05);
    this.staticFilter!.frequency.setTargetAtTime(200 + intensity * 2000, now, 0.05);
  }

  playIntro() {
    if (!this.isInitialized || !this.ctx || this.isGlobalMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.staticBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.linearRampToValueAtTime(800, t + 1);
    filter.frequency.exponentialRampToValueAtTime(100, t + 2.5);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, t + 0.5);
    noiseGain.gain.linearRampToValueAtTime(0, t + 2.5);
    noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(this.masterGain!);
    noise.start(); noise.stop(t + 3);
  }

  playReset() {
    if (this.sfxBuffers[SFX_BACK]) { this.playSound(SFX_BACK); return; }
    if (!this.ctx || this.isGlobalMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.connect(g); g.connect(this.masterGain!);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(330, t + 0.1);
    osc.frequency.setValueAtTime(220, t + 0.2);
    g.gain.setValueAtTime(0.15 * this.sfxVolume, t);
    g.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.start(t); osc.stop(t + 0.5);
  }

  suspendForVisibility() { this.ctx?.suspend(); this.bgmElement?.pause(); }
  resumeFromVisibility() {
    this.ctx?.resume();
    if (this.bgmElement && !this.isGlobalMuted) this.bgmElement.play().catch(() => {});
  }
  destroy() { this.ctx?.close(); }
}

function createAudioStore() {
  if (!browser) {
    return { subscribe: writable({ isMuted: false }).subscribe, engine: null as unknown as AudioEngine };
  }
  const engine = new AudioEngine();
  engine.setupBGM(BGM_URL);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) engine.setGlobalMute(true);

  const { subscribe, update } = writable({ isMuted: isMobile });

  engine.loadSFX([...SFX_CLICKS, SFX_SUCCESS, SFX_BACK]);

  return {
    subscribe,
    engine,
    toggleMute() {
      engine.init(); engine.wakeUp();
      engine.isGlobalMuted = !engine.isGlobalMuted;
      engine.setGlobalMute(engine.isGlobalMuted);
      if (engine.isGlobalMuted) engine.fadeOutBGM();
      else engine.startBGM();
      update(() => ({ isMuted: engine.isGlobalMuted }));
    }
  };
}

export const audioStore = createAudioStore();
