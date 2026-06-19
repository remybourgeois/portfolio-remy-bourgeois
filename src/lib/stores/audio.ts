// src/lib/stores/audio.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// MP3 is universally supported (Chrome, Firefox, Safari, iOS) — no detection needed
const BGM_URL = '/assets/music-background.mp3';
export const SFX_CLICKS = [1,2,3,4,5,6,7,8,9].map(n => `/assets/sfx-${n}.mp3`);
export const SFX_SUCCESS = '/assets/sfx-success.mp3';
export const SFX_BACK    = '/assets/sfx-back.mp3';

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
  isBGMSuppressed = false;
  sfxBuffers: Record<string, AudioBuffer> = {};
  bgmActive = false;

  // Raw ArrayBuffers fetched before any AudioContext exists (iOS-safe)
  private rawSFX: Record<string, ArrayBuffer> = {};

  private createContext() {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.isGlobalMuted ? 0 : 0.15;
    this.masterGain.connect(this.ctx.destination);
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.bgmVolume;
    this.bgmGain.connect(this.masterGain);
  }

  // Phase 1 — called at startup, NO AudioContext needed
  async loadSFX(urls: string[]) {
    await Promise.all(urls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        this.rawSFX[url] = await res.arrayBuffer();
      } catch (e) { console.warn(`SFX fetch error ${url}`, e); }
    }));
  }

  // Phase 2 — called from init() which runs inside a user gesture
  private async decodeSFX() {
    if (!this.ctx) return;
    const urls = Object.keys(this.rawSFX);
    console.log('[Audio] decodeSFX — decoding', urls.length, 'files');
    await Promise.all(Object.entries(this.rawSFX).map(async ([url, ab]) => {
      try {
        this.sfxBuffers[url] = await this.ctx!.decodeAudioData(ab.slice(0));
      } catch (e) { console.warn(`[Audio] SFX decode error ${url}`, e); }
    }));
    console.log('[Audio] decodeSFX — done, buffers:', Object.keys(this.sfxBuffers).length);
  }

  // Must be called inside a user gesture handler (tap/click)
  init() {
    if (this.isInitialized) return;
    this.createContext();          // create context IN the gesture
    this.ctx!.resume();            // resume synchronously IN the gesture chain (iOS requirement)
    console.log('[Audio] init — ctx state:', this.ctx!.state, 'sampleRate:', this.ctx!.sampleRate);
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
    this.decodeSFX(); // async decode now that context exists — ready well before next click
  }

  markBGMActive() { this.bgmActive = true; }

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
    if (this.bgmActive && this.bgmElement?.paused && !this.isGlobalMuted) {
      this.bgmElement.play().catch(() => {});
    }
  }

  startBGM() {
    if (!this.bgmElement) return;
    this.bgmActive = true;
    if (!this.isInitialized) this.init();
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.value = this.isGlobalMuted ? 0 : this.bgmVolume;
    }
    // play() called synchronously inside the user gesture — iOS autoplay policy satisfied
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
    this.bgmActive = true;
    if (!this.isInitialized) this.init();
    this.bgmElement.currentTime = 0;
    this.bgmElement.play().catch(() => {});
    const now = this.ctx.currentTime;
    const target = this.isGlobalMuted ? 0 : this.bgmVolume;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0, now);
    this.bgmGain.gain.linearRampToValueAtTime(target, now + 2);
  }

  disableBGM() {
    this.bgmActive = false;
    this.fadeOutBGM();
  }

  setGlobalMute(muted: boolean) {
    this.isGlobalMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.15, this.ctx.currentTime, 0.1);
    }
  }

  playSound(url: string) {
    if (!this.ctx || !this.sfxBuffers[url] || this.isGlobalMuted) return;
    const play = () => {
      const src = this.ctx!.createBufferSource();
      src.buffer = this.sfxBuffers[url];
      const gain = this.ctx!.createGain();
      gain.gain.value = this.sfxVolume;
      src.connect(gain);
      gain.connect(this.masterGain!);
      src.start(0);
    };
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  }

  playRandomSFX() {
    if (!this.bgmActive) return;
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
    console.log('[Audio] playIntro — init:', this.isInitialized, 'ctx:', this.ctx?.state, 'muted:', this.isGlobalMuted, 'buf:', !!this.staticBuffer);
    if (!this.isInitialized || !this.ctx || this.isGlobalMuted) return;
    if (!this.staticBuffer) { console.warn('[Audio] playIntro — staticBuffer null'); return; }
    const doPlay = () => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      console.log('[Audio] playIntro doPlay — ctx state:', this.ctx.state, 't:', t);
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
    };
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(doPlay).catch(() => {});
    } else {
      doPlay();
    }
  }

  playReset() {
    if (this.sfxBuffers[SFX_BACK]) { this.playSound(SFX_BACK); return; }
    if (!this.ctx || this.isGlobalMuted) return;
    const doPlay = () => {
      if (!this.ctx) return;
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
    };
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(doPlay).catch(() => {});
    } else {
      doPlay();
    }
  }

  suspendForVisibility() { this.ctx?.suspend(); this.bgmElement?.pause(); }

  resumeFromVisibility() {
    this.ctx?.resume();
    if (this.bgmActive && this.bgmElement && !this.isGlobalMuted) {
      this.bgmElement.play().catch(() => {});
    }
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
  // isBGMSuppressed removed — startBGM is called synchronously inside the user gesture, iOS accepts it

  const { subscribe, update } = writable({ isMuted: false });

  // Only fetch raw bytes here — NO AudioContext created (iOS requires context inside gesture)
  engine.loadSFX([...SFX_CLICKS, SFX_SUCCESS, SFX_BACK]);

  return {
    subscribe,
    engine,
    toggleMute() {
      engine.init();
      engine.wakeUp();
      engine.isGlobalMuted = !engine.isGlobalMuted;
      engine.setGlobalMute(engine.isGlobalMuted);
      if (engine.isGlobalMuted) {
        engine.fadeOutBGM();
      } else if (engine.bgmActive) {
        engine.startBGM();
      }
      update(() => ({ isMuted: engine.isGlobalMuted }));
    }
  };
}

export const audioStore = createAudioStore();
